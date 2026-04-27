"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + Math.random() * 10 : prev));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      {/* Logo / Brand */}
      <div style={styles.logo}>⚡ MyApp</div>

      {/* Loader Bar */}
      <div style={styles.progressContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Percentage */}
      <p style={styles.percent}>{Math.floor(progress)}%</p>

      {/* Loading text */}
      <p style={styles.text}>Preparing your experience...</p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "#e2e8f0",
    fontFamily: "Inter, sans-serif",
  },

  logo: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "40px",
    letterSpacing: "1px",
    animation: "fadeIn 1s ease-in-out",
  },

  progressContainer: {
    width: "250px",
    height: "6px",
    background: "#1e293b",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #38bdf8, #6366f1)",
    transition: "width 0.3s ease",
  },

  percent: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#94a3b8",
  },

  text: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#64748b",
    letterSpacing: "0.5px",
  },
};