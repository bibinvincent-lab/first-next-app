// "use client";

// import { useState } from "react";

// export default function Table() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phoneno: "",
//     age:""

//   });

//   const [users, setUsers] = useState([]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Add new user to array
//     setUsers([...users, { ...formData, id: Date.now() }]);

//     // Clear form
//     setFormData({
//       name: "",
//       email: "",
//       phoneno: "", 
//       age:""
//     });
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
//         <h2>Contact Form</h2>

//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//         />

//         <br /><br />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//         />

//         <br /><br />

//         <input
//           type="text"
//           name="phoneno"
//           placeholder="Phone Number"
//           value={formData.phoneno}
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="age"
//           placeholder="Age"
//           value={formData.age}
//           onChange={handleChange}
//         />

//         <br /><br />

//         <button type="submit">Submit</button>
//       </form>

//       <h1>User List</h1>

//       {users.map((user) => (
//         <div key={user.id}>
//           <h2>{user.name}</h2>
//           <p>{user.email}</p>
//           <p>{user.phoneno}</p>
//           <p>{user.age}</p><br/><br/>
//         </div>
//       ))}
//     </>[
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from '@mui/material';
import Table from "@/app/table/page";

export default function Test() {
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

  return( <>
  <h1 style={{textAlign:"center"}}>Table Component</h1>
  <Table />
  
  </>
    
);}