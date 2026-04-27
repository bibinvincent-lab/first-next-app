// "use client";
// import {useState} from "react";
// export default function AddUser(){
//     const [name,setName]=useState("");
//     const [email,setEmail]=useState("");
// const handleSubmit=async()=>{
//     await fetch("/api/users",{
//         method:"POST",
//         headers: {
//       "Content-Type": "application/json",
//     },
//         body:JSON.stringify({name,email}),
//     });
//     alert("Saved!");
//     setName("")
//     setEmail("")
// };
// return(
//     <div>
//         <h1>Add User</h1>
//         <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
//         <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
//         <button onClick={handleSubmit}>Submit</button> 

//     </div>
// );

    
// }

export default function AddPage() {
  return (
    <div>
      <h1>Add User Page</h1>
      <p>This page is under construction.</p>
    </div>
  );
}