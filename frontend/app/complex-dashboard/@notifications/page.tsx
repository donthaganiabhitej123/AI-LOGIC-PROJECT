import { getNotifications } from "../../../lib/dashboardApi";

export default async function NotificationsPage() {
  const data = await getNotifications();

  return (
    <section>
      <h2>Notifications</h2>

      <p>Notifications loaded successfully.</p>

      {(data.notifications ?? []).map((notification) => (
        <div key={notification.id}>
          <p>{notification.message}</p>
        </div>
      ))}
    </section>
  );
}