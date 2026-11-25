import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [health, setHealth] = useState({
    status: "checking",
    database: "checking",
    message: "Checking backend connection...",
  });

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        if (!res.ok) {
          throw new Error("Backend returned an error");
        }
        const data = await res.json();
        setHealth(data);
      } catch {
        setHealth({
          status: "error",
          database: "disconnected",
          message: "Could not reach backend API",
        });
      }
    }

    checkHealth();
  }, []);

  const isHealthy = health.status === "ok" && health.database === "connected";

  return (
    <main className="page">
      <section className="card">
        <span className={`badge ${isHealthy ? "ok" : "error"}`}>
          <span className="dot" />
          API: {health.status} · MongoDB: {health.database}
        </span>

        <h1>MERN Stack Setup Ready</h1>
        <p className="subtitle">
          MongoDB + Express + React (Vite) + Node.js starter boilerplate running on{" "}
          <code>localhost:5174</code>.
        </p>

        <div className="info-grid">
          <div className="info-item">
            <strong>Frontend</strong>
            <span>React + Vite (port 5174)</span>
            <code>client/src/App.jsx</code>
          </div>
          <div className="info-item">
            <strong>Backend</strong>
            <span>Express + Node.js (port 5001)</span>
            <code>server/src/server.js</code>
          </div>
          <div className="info-item">
            <strong>Database</strong>
            <span>MongoDB + Mongoose</span>
            <code>server/src/config/db.js</code>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
