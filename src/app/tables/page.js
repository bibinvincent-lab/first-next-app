"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from '@mui/material';

export default function Table() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth !== "true") {
      router.push("/signup");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: "",
    age: ""
  });

  const [users, setUsers] = useState([]);

  if (!isAuthenticated) {
    return (
      // <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      //   <div className="text-center">
      //     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      //     <p className="text-gray-600">Checking authentication...</p>
      //   </div>
      // </div>
      <Box sx={{ display: 'flex' }}>
      <CircularProgress aria-label="Loading…" />Checking authentication...
    </Box>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setUsers([...users, { ...formData, id: Date.now() }]);

    setFormData({
      name: "",
      email: "",
      phoneno: "",
      age: ""
    });
  };

  return (
    <div style={styles.container}>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Contact Form</h2>

        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} style={styles.input}/>
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input}/>
        <input name="phoneno" placeholder="Phone Number" value={formData.phoneno} onChange={handleChange} style={styles.input}/>
        <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} style={styles.input}/>

        <button type="submit" style={styles.button}>Submit</button>
      </form>

      {/* TABLE */}
      <div style={styles.tableBox}>
        <h2 style={styles.heading}>User List</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black" }}>Name</th>
              <th style={{ border: "1px solid black" }}>Email</th>
              <th style={{ border: "1px solid black" }}>Phone</th>
              <th style={{ border: "1px solid black" }}>Age</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} style={styles.row}>
                  <td style={{ border: "1px solid black" }}>{user.name}</td>
                  <td style={{ border: "1px solid black" }}>{user.email}</td>
                  <td style={{ border: "1px solid black" }}>{user.phoneno}</td>
                  <td style={{ border: "1px solid black" }}>{user.age}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                  No users yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    fontFamily: "Segoe UI, sans-serif",
    background: "#f5f7fb",
    minHeight: "100vh",
    padding: "40px"
  },

  form: {
    maxWidth: "400px",
    margin: "auto",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  heading: {
    textAlign: "center",
    marginBottom: "10px"
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "0.3s",
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  tableBox: {
    marginTop: "40px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid black" 
  },

  row: {
    borderBottom: "1px solid #eee"
  }
};