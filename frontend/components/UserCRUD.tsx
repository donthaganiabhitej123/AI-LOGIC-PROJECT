"use client";

import axios from "axios";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createUser,
  deleteUser,
  downloadFile,
  getFiles,
  getUsers,
  handleApiError,
  sendChatMessage,
  updateUser,
  uploadFile,
  type UploadedFile,
  type User,
} from "../lib/api";

import { debounce } from "../lib/debounce";
import socket from "../lib/socket";

export default function UserCRUD() {
  // ==========================================
  // USER STATE
  // ==========================================

  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // CHAT STATE
  // ==========================================

  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  // ==========================================
  // FILE STATE
  // ==========================================

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // ==========================================
  // SOCKET.IO
  // ==========================================

  useEffect(() => {
    const handleNotification = (message: string) => {
      setMessage(message);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    };

    const handleChatMessage = (message: string) => {
      setChatMessages((currentMessages) => [
        ...currentMessages,
        `You: ${message}`,
      ]);
    };

    const handleChatResponse = (message: string) => {
      setChatMessages((currentMessages) => [
        ...currentMessages,
        `Backend: ${message}`,
      ]);
    };

    socket.on("user-message", handleNotification);
    socket.on("chat-message", handleChatMessage);
    socket.on("chat-response", handleChatResponse);

    return () => {
      socket.off("user-message", handleNotification);
      socket.off("chat-message", handleChatMessage);
      socket.off("chat-response", handleChatResponse);
    };
  }, []);

  // ==========================================
  // SEND CHAT MESSAGE
  // ==========================================

  const handleSendMessage = async () => {
    const message = chatMessage.trim();

    if (!message) return;

    try {
      setError("");
      await sendChatMessage(message);
      setChatMessage("");
    } catch (error: unknown) {
      setError(handleApiError(error));
    }
  };

  // ==========================================
  // CLEAR FORM
  // ==========================================

  const clearForm = () => {
    setName("");
    setEmail("");
    setAge("");
    setPassword("");
    setEditingId(null);
    setError("");
  };

  // ==========================================
  // GET USERS
  // ==========================================

  const loadUsers = async () => {
    try {
      const data = await getUsers();

      setUsers(data);
      setError("");
    } catch (error: unknown) {
      // The old dashboard may request the admin-only users list.
      // Handle these expected RBAC responses without displaying an error.
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 ||
          error.response?.status === 403)
      ) {
        setUsers([]);
        setError("");
        return;
      }

      setError(handleApiError(error));
    }
  };

  // ==========================================
  // GET FILES
  // ==========================================

  const loadFiles = useCallback(async () => {
    try {
      const data = await getFiles();

      setFiles(data);
    } catch (error: unknown) {
      setError(handleApiError(error));
    }
  }, []);

  // ==========================================
  // LOAD USERS AND FILES
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      await loadUsers();
      await loadFiles();
    };

    void loadData();
  }, [loadFiles]);

  // ==========================================
  // CREATE / UPDATE USER
  // ==========================================

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");

      // UPDATE USER
      if (editingId !== null) {
        const updatedUser = await updateUser(
          editingId,
          name,
          email,
          Number(age)
        );

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );

        clearForm();
        return;
      }

      // CREATE USER
      const newUser = await createUser(
        name,
        email,
        Number(age),
        password
      );

      setUsers((currentUsers) => [
        newUser,
        ...currentUsers,
      ]);

      clearForm();
    } catch (error: unknown) {
      setError(handleApiError(error));
    }
  };

  // ==========================================
  // EDIT USER
  // ==========================================

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setAge(String(user.age));
    setPassword("");
    setError("");
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteUser(id);

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== id)
      );
    } catch (error: unknown) {
      setError(handleApiError(error));
    }
  };

  // ==========================================
  // FILE UPLOAD
  // ==========================================

  const handleUpload = useCallback(
    async (file: File) => {
      try {
        setError("");
        setUploading(true);
        setUploadProgress(0);

        await uploadFile(file, (progress) => {
          setUploadProgress(progress);
        });

        setSelectedFile(null);
        setUploadProgress(100);

        await loadFiles();

        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
      } catch (error: unknown) {
        setError(handleApiError(error));
      } finally {
        setUploading(false);
      }
    },
    [loadFiles]
  );

  const debouncedUpload = useMemo(
    () =>
      debounce((file: File) => {
        void handleUpload(file);
      }, 2000),
    [handleUpload]
  );

  // ==========================================
  // FILE DOWNLOAD
  // ==========================================

  const handleDownload = async (
    id: number,
    fileName: string
  ) => {
    try {
      setError("");
      setDownloadingId(id);
      setDownloadProgress(0);

      const blob = await downloadFile(id, (progress) => {
        setDownloadProgress(progress);
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setDownloadProgress(100);

      setTimeout(() => {
        setDownloadProgress(0);
        setDownloadingId(null);
      }, 1000);
    } catch (error: unknown) {
      setError(handleApiError(error));
      setDownloadingId(null);
      setDownloadProgress(0);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="user-crud">
      {/* SUCCESS MESSAGE */}

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {/* USER FORM */}

      <section className="crud-card">
        <h2>
          {editingId !== null ? "Update User" : "Create User"}
        </h2>

        <form onSubmit={handleSubmit} className="user-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />

          {editingId === null && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          )}

          <div className="form-buttons">
            <button type="submit">
              {editingId !== null ? "Update User" : "Create User"}
            </button>

            {editingId !== null && (
              <button type="button" onClick={clearForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* USERS */}

      <section className="crud-card">
        <div className="section-header">
          <h2>Users</h2>

        <button
  type="button"
  className="action-btn refresh-btn"
  aria-label="Refresh"
  onClick={loadUsers}
>
  <i className="fa-solid fa-rotate" aria-hidden="true" />
</button>
        </div>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* FILE UPLOAD */}

      <section className="crud-card">
        <h2>File Upload</h2>

        <input
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            setSelectedFile(file);
          }}
        />

        <button
          type="button"
          onClick={() => {
            if (!selectedFile) return;
            debouncedUpload(selectedFile);
          }}
          disabled={uploading || !selectedFile}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        {uploading && (
          <div className="progress-container">
            <div className="progress-info">
              <span>Upload Progress</span>
              <span>{uploadProgress}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill upload-progress"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* FILE LIST */}

      <section className="crud-card">
        <div className="section-header">
          <h2>Uploaded Files</h2>

          <button type="button" onClick={() => void loadFiles()}>
            Refresh
          </button>
        </div>

        {files.length === 0 ? (
          <p>No files found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>{file.id}</td>
                    <td>{file.file_name}</td>
                    <td>{file.file_type}</td>
                    <td>{file.file_size} bytes</td>

                    <td>
                      <button
                        type="button"
                        disabled={downloadingId === file.id}
                        onClick={() =>
                          handleDownload(file.id, file.file_name)
                        }
                      >
                        {downloadingId === file.id
                          ? "Downloading..."
                          : "Download"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {downloadingId !== null && (
          <div className="progress-container">
            <div className="progress-info">
              <span>Download Progress</span>
              <span>{downloadProgress}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill download-progress"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* CHAT BOX */}

      <section className="crud-card chat-card">
        <h2>Chat</h2>

        <div className="chat-messages">
          {chatMessages.length === 0 ? (
            <p className="empty-chat">No messages yet</p>
          ) : (
            chatMessages.map((chat, index) => (
              <div key={index} className="chat-message">
                {chat}
              </div>
            ))
          )}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type a message..."
            value={chatMessage}
            onChange={(event) => setChatMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleSendMessage();
              }
            }}
          />

          <button
            type="button"
            onClick={() => void handleSendMessage()}
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}