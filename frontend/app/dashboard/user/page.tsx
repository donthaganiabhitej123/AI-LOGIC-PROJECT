
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import { fetchMyDetails } from "../../../features/userDetailsThunk";
import type { AppDispatch, RootState } from "../../../store/store";



export default function UserDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading, error } = useSelector(
    (state: RootState) => state.userDetails
  );

  useEffect(() => {
    const request = dispatch(fetchMyDetails());

    return () => {
      request.abort();
    };
  }, [dispatch]);

  return (
    <main style={{ padding: "24px" }}>
      <header>
        <h1>User Dashboard</h1>
        <p>Welcome to your personal dashboard.</p>
      </header>

      {loading && <p>Loading your details...</p>}

      {!loading && error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!loading && !error && user && (
        <section
          style={{
            marginTop: "20px",
            padding: "24px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            maxWidth: "600px",
          }}
        >
          <h2>My Account</h2>

          <p>
            <strong>User ID:</strong> {user.id}
          </p>

          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {"age" in user && user.age !== undefined && (
            <p>
              <strong>Age:</strong> {String(user.age)}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
