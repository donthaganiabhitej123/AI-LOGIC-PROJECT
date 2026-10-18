"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserCRUD from "../../components/UserCRUD";

export default function DashboardPage() {
  const router = useRouter();

  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    window.history.pushState(
      null,
      "",
      window.location.href
    );

    const handleBack = () => {
      window.history.pushState(
        null,
        "",
        window.location.href
      );
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      const data: { success?: boolean; message?: string } =
        await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setLogoutError(
          data.message || "Logout failed. Please try again."
        );
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setLogoutError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>User Dashboard</h1>
            <p>Welcome</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </header>

        {logoutError && (
          <p role="alert" className="error-message">
            {logoutError}
          </p>
        )}

        <UserCRUD />
      </div>
    </main>
  );
}