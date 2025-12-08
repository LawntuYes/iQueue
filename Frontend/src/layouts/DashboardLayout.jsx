import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">Sidebar</aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
