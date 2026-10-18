
"use client";

import axios from "axios";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
} from "formik";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/authSlice";
import { loginUser } from "../../lib/api";
import { loginSchema } from "../../lib/validations/loginSchema";
import type { AppDispatch } from "../../store/store";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleLogin = async (
    values: LoginFormValues,
    {
      setSubmitting,
      setStatus,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setStatus: (status?: string) => void;
    }
  ): Promise<void> => {
    try {
      setStatus("");

      const response = await loginUser(
        values.email,
        values.password
      );

      // Continue only when login succeeds with valid user data.
      if (
        !response.success ||
        !response.user ||
        !response.token
      ) {
        setStatus("Login failed. Please check your credentials.");
        return;
      }

      const role = response.user.role;

      if (role !== "admin" && role !== "user") {
        setStatus(
          "Login succeeded, but the user role is missing or invalid."
        );
        return;
      }

      // Store the authenticated user and token in Redux.
      dispatch(
        setCredentials({
          user: response.user,
          token: response.token,
        })
      );

      // Redirect according to the user's role.
      if (role === "admin") {
        router.replace("/dashboard/admin");
      } else {
        router.replace("/dashboard/user");
      }

      router.refresh();
    } catch (error: unknown) {
      console.error("Login error:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (!error.response) {
          setStatus("Network error. Please check your connection.");
        } else if (status === 400) {
          setStatus("Please check your email and password.");
        } else if (status === 401) {
          setStatus("Invalid email or password.");
        } else if (status !== undefined && status >= 500) {
          setStatus("Server error. Please try again later.");
        } else {
          setStatus("An unexpected error occurred.");
        }
      } else {
        setStatus("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Login</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, status, values, errors, touched }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="email">Email</label>

                <div className="input-with-status">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                  />

                  {touched.email && values.email && (
                    <span
                      className={
                        errors.email
                          ? "validation-error"
                          : "validation-success"
                      }
                    >
                      {errors.email ? "✕" : "✓"}
                    </span>
                  )}
                </div>

                <ErrorMessage
                  name="email"
                  component="p"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <div className="input-with-status">
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                  />

                  {touched.password && values.password && (
                    <span
                      className={
                        errors.password
                          ? "validation-error"
                          : "validation-success"
                      }
                    >
                      {errors.password ? "✕" : "✓"}
                    </span>
                  )}
                </div>

                <ErrorMessage
                  name="password"
                  component="p"
                  className="error-message"
                />
              </div>

              {status && (
                <p className="error-message" role="alert">
                  {status}
                </p>
              )}

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
