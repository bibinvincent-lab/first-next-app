"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Button, Pagination
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import EditUserModal from "./components/EditUserModal";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function TestPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, requireAuth } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const authorized = requireAuth();
      // Only show content if authorized (no redirect happened)
    }
  }, [isLoading, requireAuth]);

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);                //set 5 for testing.
  const searchParams = useSearchParams();

  // Get edit roll number from query
  const editRollno = searchParams.get("edit");

  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

useEffect(() => {
  if (editRollno) {
    const user = users.find(u => String(u.rollno) === editRollno);

    if (user) {
      setSelectedUser(user);
      setOpen(true);
    }
  } else {
    setOpen(false);
    setSelectedUser(null);
  }
}, [editRollno, users]);

  const fetchUsers = async (currentPage = 1) => {
    const res = await fetch(`/api/users?page=${currentPage}&limit=${limit}`);
    const data = await res.json();
    if (data.users) {
      setUsers(data.users);
      setTotal(data.total);
      setPage(data.page);
    } else {
      setUsers([]);
    }
  };

  const handleDelete = async (rollno) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/users?rollno=${rollno}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success) setUsers(users.filter(u => u.rollno !== rollno));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleClose = () => {
    router.push("/test"); // remove query param to close modal
  };


  if (isLoading || !isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress aria-label="Loading…" />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", mt: 5 }}>
      <h2>User List</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Roll No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.rollno}>
              <TableCell>{user.rollno}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneno}</TableCell>
              <TableCell>{user.age}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => router.push(`/test?edit=${user.rollno}`)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(user.rollno)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(total / limit)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
{/* console.log("editRollno:", editRollno);
console.log("users:", users); */}
      <EditUserModal
        open={open}
        user={selectedUser}
        onClose={handleClose}
        onSaved={() => {
          fetchUsers(page);
          handleClose();
        }}
      />
    </Box>
  );
}