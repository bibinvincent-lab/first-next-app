"use client";
import { useState } from "react";

export default function Table() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: "",
    age: ""
  });

  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add new user to array
    setUsers([...users, { ...formData, id: Date.now() }]);

    // Clear form
    setFormData({
      name: "",
      email: "",
      phoneno: "",
      age: ""
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
        <h2>Contact Form</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="phoneno"
          placeholder="Phone Number"
          value={formData.phoneno}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">Submit</button>
      </form>

      <h1>User List</h1>

      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.phoneno}</p>
          <p>{user.age}</p>
          <br /><br />
        </div>
      ))}
    </>
  );
}