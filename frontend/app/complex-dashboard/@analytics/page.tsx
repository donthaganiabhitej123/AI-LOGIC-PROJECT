import { getAnalytics } from "../../../lib/dashboardApi";

export default async function AnalyticsPage() {
  const data = await getAnalytics();

  if (!data.success) {
    return (
      <section>
        <h2>Analytics Error</h2>

        <p>Failed to load analytics data.</p>

        <button type="button">
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section>
      <h2>Analytics</h2>

      <p>Analytics loaded successfully.</p>

      <p>Total Users: {data.analytics?.totalUsers}</p>

      <p>Total Products: {data.analytics?.totalProducts}</p>
    </section>
  );
}