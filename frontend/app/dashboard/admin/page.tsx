
"use client";

import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";

import "datatables.net-buttons-dt";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "datatables.net-buttons/js/buttons.colVis.mjs";
import DataTable from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";

import { ErrorMessage, Field, Form, Formik } from "formik";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import { handleApiError } from "../../../lib/api";


import {
  createUserSchema,
  editUserSchema,
} from "../../../lib/validations/userSchema";

type UserRole = "admin" | "user";

interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  role?: UserRole;
}

interface UsersResponse {
  success?: boolean;
  users?: User[];
  data?: User[];
  message?: string;
}

const inputStyle: CSSProperties = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  boxSizing: "border-box",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
};

export default function AdminDashboardPage() {
  const tableRef = useRef<HTMLTableElement | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // GET: Load users.
  const loadUsers = async (signal?: AbortSignal): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<UsersResponse | User[]>(
        "/api/users",
        {
          withCredentials: true,
          signal,
        }
      );

      const payload = response.data;
      const list = Array.isArray(payload)
        ? payload
        : payload.users ?? payload.data;

      if (!Array.isArray(list)) {
        throw new Error("Unexpected users API response format.");
      }

      setUsers(list);
    } catch (err: unknown) {
      if (signal?.aborted) return;

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const apiMessage = err.response?.data?.message;

        setError(
          status === 401
            ? "Your session has expired. Please log in again."
            : status === 403
              ? "Admin access is required to manage users."
              : typeof apiMessage === "string"
                ? apiMessage
                : "Unable to load users."
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Unable to load users."
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  // Initial GET request.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers(): Promise<void> {
      try {
        const response = await axios.get<UsersResponse | User[]>(
          "/api/users",
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );

        const payload = response.data;
        const list = Array.isArray(payload)
          ? payload
          : payload.users ?? payload.data;

        if (!Array.isArray(list)) {
          throw new Error("Unexpected users API response format.");
        }

        if (!controller.signal.aborted) {
          setUsers(list);
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) return;

        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          const apiMessage = err.response?.data?.message;

          setError(
            status === 401
              ? "Your session has expired. Please log in again."
              : status === 403
                ? "Admin access is required to manage users."
                : typeof apiMessage === "string"
                  ? apiMessage
                  : "Unable to load users."
          );
        } else {
          setError(
            err instanceof Error ? err.message : "Unable to load users."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchUsers();

    return () => controller.abort();
  }, []);

  // Initialize DataTables.
  useEffect(() => {
    const tableElement = tableRef.current;

    if (loading || !tableElement) return;

    const table = new DataTable(tableElement, {
      pageLength: 3,
      lengthMenu: [3, 6, 9, 12],
      searching: true,
      paging: true,
      ordering: true,

      layout: {
        topStart: {
          buttons: ["colvis"],
        },
        topEnd: {
          search: true,
        },
      } as NonNullable<
        ConstructorParameters<typeof DataTable>[1]
      >["layout"],

      language: {
        search:
          '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>',
        searchPlaceholder: "Search users...",
      },

      columnDefs: [
        {
          targets: 5,
          orderable: false,
          searchable: false,
        },
      ],
    });

    return () => {
      table.destroy();
    };
  }, [loading, users]);

  // Open Edit User modal.
  const startEdit = (user: User): void => {
    setEditingUser(user);
    setError("");
    setMessage("");
  };

  // Close Edit User modal.
  const cancelEdit = (): void => {
    setEditingUser(null);
  };

  // DELETE: Delete a user.
  const handleDeleteUser = async (user: User): Promise<void> => {
    if (deletingId !== null) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete user "${user.name}" (ID ${user.id})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setError("");
    setMessage("");
    setDeletingId(user.id);

    try {
      const response = await axios.delete(`/api/users/${user.id}`, {
        withCredentials: true,
      });

      const successMessage =
        response.data?.message ?? "User deleted successfully.";

      setMessage(successMessage);

      await Swal.fire({
        title: "Deleted!",
        text: successMessage,
        icon: "success",
      });

      if (editingUser?.id === user.id) {
        cancelEdit();
      }

      await loadUsers();
    } catch (err: unknown) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);

      await Swal.fire({
        title: "Delete Failed",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage users, account details, and assigned roles.</p>
        </div>
      </header>

      {/* Display API errors. */}
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}

      {/* Display success messages. */}
      {message && (
        <p role="status" className="admin-success">
          {message}
        </p>
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !submitting
            ) {
              setShowAddUserModal(false);
            }
          }}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-user-title"
          >
            <div className="modal-header">
              <div>
                <h2 id="add-user-title">Add New User</h2>
                <p>Enter the details to create a user account.</p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                aria-label="Close Add User dialog"
                disabled={submitting}
                onClick={() => setShowAddUserModal(false)}
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>

            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                age: "",
                role: "user" as UserRole,
              }}
              validationSchema={createUserSchema}
              onSubmit={async (values, { resetForm }) => {
                setError("");
                setMessage("");
                setSubmitting(true);

                try {
                  const response = await axios.post(
                    "/api/users",
                    {
                      name: values.name.trim(),
                      email: values.email.trim(),
                      password: values.password,
                      age: Number(values.age),
                      role: values.role,
                    },
                    { withCredentials: true }
                  );

                  const successMessage =
                    response.data?.message ??
                    "User created successfully.";

                  await Swal.fire({
                    title: "User Created!",
                    text: successMessage,
                    icon: "success",
                  });

                  setMessage(successMessage);
                  resetForm();
                  setShowAddUserModal(false);
                  await loadUsers();
                } catch (err: unknown) {
                  const errorMessage = handleApiError(err);
                  setError(errorMessage);

                  await Swal.fire({
                    title: "Unable to Create User",
                    text: errorMessage,
                    icon: "error",
                  });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="admin-form" noValidate>
                  <label>
                    Name
                    <Field
                      name="name"
                      autoComplete="name"
                      aria-invalid={Boolean(touched.name && errors.name)}
                      style={inputStyle}
                    />
                    {touched.name && errors.name && (
                      <span className="field-error">
                        {errors.name}
                      </span>
                    )}
                  </label>

                  <label>
                    Email
                    <Field
                      name="email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={Boolean(touched.email && errors.email)}
                      style={inputStyle}
                    />
                    {touched.email && errors.email && (
                      <span className="field-error">
                        {errors.email}
                      </span>
                    )}
                  </label>

                  <label>
                    Password
                    <Field
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(
                        touched.password && errors.password
                      )}
                      style={inputStyle}
                    />
                    {touched.password && errors.password && (
                      <span className="field-error">
                        {errors.password}
                      </span>
                    )}
                  </label>

                  <label>
                    Age
                    <Field
                      name="age"
                      type="number"
                      min="1"
                      max="150"
                      aria-invalid={Boolean(touched.age && errors.age)}
                      style={inputStyle}
                    />
                    {touched.age && errors.age && (
                      <span className="field-error">
                        {errors.age}
                      </span>
                    )}
                  </label>

                  <label>
                    Role
                    <Field
                      as="select"
                      name="role"
                      aria-invalid={Boolean(touched.role && errors.role)}
                      style={inputStyle}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Field>
                    {touched.role && errors.role && (
                      <span className="field-error">
                        {errors.role}
                      </span>
                    )}
                  </label>

                  <div className="modal-actions">
                    <button
                      type="submit"
                      className="add-user-btn"
                      disabled={isSubmitting || submitting}
                    >
                      <i
                        className="fa-solid fa-user-plus"
                        aria-hidden="true"
                      />
                      {isSubmitting || submitting
                        ? "Adding User..."
                        : "Add User"}
                    </button>

                    <button
                      type="button"
                      className="cancel-btn"
                      disabled={isSubmitting || submitting}
                      onClick={() => setShowAddUserModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </section>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !savingEdit
            ) {
              cancelEdit();
            }
          }}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
          >
            <div className="modal-header">
              <div>
                <h2 id="edit-user-title">
                  Edit User #{editingUser.id}
                </h2>
                <p>Update the details for {editingUser.name}.</p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                aria-label="Close Edit User dialog"
                disabled={savingEdit}
                onClick={cancelEdit}
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>

            <Formik
              key={editingUser.id}
              initialValues={{
                name: editingUser.name,
                email: editingUser.email,
                age:
                  editingUser.age === undefined
                    ? ""
                    : String(editingUser.age),
                role: editingUser.role ?? "user",
              }}
              validationSchema={editUserSchema}
              onSubmit={async (values) => {
                if (savingEdit) return;

                setError("");
                setMessage("");
                setSavingEdit(true);

                try {
                  const response = await axios.put(
                    `/api/users/${editingUser.id}`,
                    {
                      name: values.name.trim(),
                      email: values.email.trim(),
                      age: Number(values.age),
                      role: values.role,
                    },
                    { withCredentials: true }
                  );

                  const successMessage =
                    response.data?.message ??
                    "User updated successfully.";

                  await Swal.fire({
                    title: "User Updated!",
                    text: successMessage,
                    icon: "success",
                  });

                  setMessage(successMessage);
                  cancelEdit();
                  await loadUsers();
                } catch (err: unknown) {
                  const errorMessage = handleApiError(err);
                  setError(errorMessage);

                  await Swal.fire({
                    title: "Unable to Update User",
                    text: errorMessage,
                    icon: "error",
                  });
                } finally {
                  setSavingEdit(false);
                }
              }}
            >
              {({
                errors,
                touched,
                isSubmitting,
                submitCount,
              }) => (
                <Form className="admin-form" noValidate>
                  <label>
                    Name
                    <Field
                      name="name"
                      autoComplete="name"
                      aria-invalid={Boolean(
                        (touched.name || submitCount > 0) && errors.name
                      )}
                      style={inputStyle}
                    />
                    {(touched.name || submitCount > 0) && (
                      <ErrorMessage
                        name="name"
                        component="span"
                        className="field-error"
                      />
                    )}
                  </label>

                  <label>
                    Email
                    <Field
                      name="email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={Boolean(
                        (touched.email || submitCount > 0) && errors.email
                      )}
                      style={inputStyle}
                    />
                    {(touched.email || submitCount > 0) && (
                      <ErrorMessage
                        name="email"
                        component="span"
                        className="field-error"
                      />
                    )}
                  </label>

                  <label>
                    Age
                    <Field
                      name="age"
                      type="number"
                      min="1"
                      max="150"
                      aria-invalid={Boolean(
                        (touched.age || submitCount > 0) && errors.age
                      )}
                      style={inputStyle}
                    />
                    {(touched.age || submitCount > 0) && (
                      <ErrorMessage
                        name="age"
                        component="span"
                        className="field-error"
                      />
                    )}
                  </label>

                  <label>
                    Role
                    <Field
                      as="select"
                      name="role"
                      aria-invalid={Boolean(
                        (touched.role || submitCount > 0) && errors.role
                      )}
                      style={inputStyle}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Field>
                    {(touched.role || submitCount > 0) && (
                      <ErrorMessage
                        name="role"
                        component="span"
                        className="field-error"
                      />
                    )}
                  </label>

                  <div className="modal-actions">
                    <button
                      type="submit"
                      className="add-user-btn"
                      disabled={isSubmitting || savingEdit}
                    >
                      <i
                        className="fa-solid fa-floppy-disk"
                        aria-hidden="true"
                      />
                      {isSubmitting || savingEdit
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      className="cancel-btn"
                      disabled={isSubmitting || savingEdit}
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </section>
        </div>
      )}

      {/* USERS TABLE */}
      <section className="admin-users-section">
        <div className="admin-users-heading">
          <h2>All Users</h2>

          <div className="admin-toolbar-actions">
            <button
              type="button"
              className="action-btn refresh-btn"
              aria-label="Refresh"
              title="Refresh"
              onClick={() => void loadUsers()}
              disabled={loading}
            >
              <i className="fa-solid fa-rotate" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="add-user-btn"
              onClick={() => {
                setError("");
                setMessage("");
                setShowAddUserModal(true);
              }}
            >
              <i className="fa-solid fa-user-plus" aria-hidden="true" />
              Add User
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="table-container">
            <table
              ref={tableRef}
              className="admin-users-table"
            >
              <thead>
                <tr>
                  {[
                    "ID",
                    "Name",
                    "Email",
                    "Age",
                    "Role",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.age ?? "—"}</td>
                    <td>{user.role ?? "—"}</td>

                    <td className="admin-actions-cell">
                      <button
                        type="button"
                        className="action-btn edit-btn"
                        title="Edit user"
                        aria-label={`Edit ${user.name}`}
                        onClick={() => startEdit(user)}
                      >
                        <i
                          className="fa-solid fa-pen-to-square"
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        type="button"
                        className="action-btn delete-btn"
                        title="Delete user"
                        aria-label={`Delete ${user.name}`}
                        disabled={deletingId !== null}
                        onClick={() => void handleDeleteUser(user)}
                      >
                        <i
                          className="fa-solid fa-trash"
                          aria-hidden="true"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className="admin-empty-state">No users found.</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
