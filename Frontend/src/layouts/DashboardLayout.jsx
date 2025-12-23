import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DashboardLayout() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
