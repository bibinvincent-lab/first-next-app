// export default function Loads()
// {
//     return<h2>Loading uses.....</h2>
// }
"use client";
import {useState,useEffect} from "react";
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
export default function Loads()
{
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const[users,setUsers]=useState([]);

    useEffect(() => {
        const auth = localStorage.getItem("auth");
        if (auth !== "true") {
            router.push("/signup");
            return;
        }
        setIsAuthenticated(true);

        // Fetch users
        fetch("https://jsonplaceholder.typicode.com/users")
        .then(res=>res.json())
        .then(data=>setUsers(data));
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
    return <div> <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul></div>;
    }
