import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/home.css";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>

      <div className="hero-content">
        <h1 className="hero-title">
          <span className="gradient-text">iQueue</span>
          <br />
          Simply Better.
        </h1>

        <p className="hero-subtitle">
          The modern way to manage your time and appointments.
          <br />
          Seamless, efficient, and designed for you.
        </p>

        {!user && (
          <div className="hero-buttons">
            <Link to="/register" className="btn-modern btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-modern btn-outline">
              Login
            </Link>
          </div>
        )}

        {user && (
          <div className="hero-buttons">
            <span
              style={{ color: "#6b7280", fontSize: "1.1rem", fontWeight: 500 }}
            >
              Welcome, {user.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
