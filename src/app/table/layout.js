export default function TableLayout({ children }) {
  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "darkblue" }}>
        User Management System
      </h1>

      <hr />

      {children}
    </div>
  );
}
