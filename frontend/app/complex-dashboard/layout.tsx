import type { ReactNode } from "react";

interface ComplexDashboardLayoutProps {
  children: ReactNode;
  analytics: ReactNode;
  notifications: ReactNode;
  users: ReactNode;
}

export default function ComplexDashboardLayout({
  children,
  analytics,
  notifications,
  users,
}: ComplexDashboardLayoutProps) {
  return (
    <main className="min-h-screen p-6">
      {/* Main Dashboard */}
      <section className="mb-6">
        {children}
      </section>

      {/* Three Parallel Route Boxes */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        
        {/* Analytics Box */}
        <div className="rounded-xl border bg-white p-6 shadow-md">
          {analytics}
        </div>

        {/* Notifications Box */}
        <div className="rounded-xl border bg-white p-6 shadow-md">
          {notifications}
        </div>

        {/* Users Box */}
        <div className="rounded-xl border bg-white p-6 shadow-md">
          {users}
        </div>

      </section>
    </main>
  );
}