
"use client";

import {
  faHouse,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogoutUser, handleApiError } from "../lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  // Show Navbar only on dashboard pages.
  if (!pathname.startsWith("/dashboard")) {
    return null;
  }

  const handleLogout = async (): Promise<void> => {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const result = await LogoutUser();

      if (!result.success) {
        setError(
          result.message || "Logout failed. Please try again."
        );
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch (err: unknown) {
      setError(handleApiError(err));
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header
      className="app-navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
      }}
    >
      {/* Reload current page */}
      <button
        type="button"
        title="Reload current page"
        aria-label="Reload current page"
        onClick={() => window.location.reload()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          background: "#f3f4f6",
          color: "#111827",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <FontAwesomeIcon icon={faHouse} size="lg" aria-hidden="true" />
      </button>

      {/* Logout button */}
      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={loggingOut}
        className="navbar-logout"
      >
        <FontAwesomeIcon
          icon={faRightFromBracket}
          aria-hidden="true"
        />{" "}
        {loggingOut ? "Logging out..." : "Logout"}
      </button>

      {/* Logout error */}
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
    </header>
  );
}
