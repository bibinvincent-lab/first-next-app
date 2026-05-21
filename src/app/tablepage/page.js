"use client";
import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import EditUserDialog from "../components/EditUserDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Pagination,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuth } from '@/hooks/useAuth';

export default function TablePage() {
  const { isAuthenticated, isLoading, requireAuth } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      requireAuth();
    }
  }, [isLoading, requireAuth]);
  const [formData, setFormData] = useState({
    rollno: "",
    name: "",
    email: "",
    phoneno: "",
    age: ""
  });
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmEditDialog, setConfirmEditDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (currentPage = 1) => {
    try {
      const res = await fetch(`/api/users?page=${currentPage}&limit=${limit}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data.users)) {
        setUsers(data.users);
        setTotal(data.total);
        setPage(data.page);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const cancelEdit = () => {
    setSelectedUser(null);
    setOpenDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      if (result.success) {
        fetchUsers(page);
        setFormData({ rollno: "", name: "", email: "", phoneno: "", age: "" });
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error("Failed to submit:", err);
    }
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    setConfirmEditDialog(true);
  };

  const confirmEdit = () => {
    setConfirmEditDialog(false);
    setSelectedUser(userToEdit);
    setOpenDialog(true);
    setUserToEdit(null);
  };

  const cancelConfirmEdit = () => {
    setConfirmEditDialog(false);
    setUserToEdit(null);
  };

  const handleSaveEdit = async (editedUser) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });
      const result = await res.json();

      if (result.success) {
        fetchUsers(page);
        setOpenDialog(false);
        setSelectedUser(null);
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (rollno) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const params = new URLSearchParams({ rollno });
      const res = await fetch(`/api/users?${params}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      if (result.success) fetchUsers(page);
      else console.error(result.error);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress aria-label="Loading…" />
        <Typography sx={{ ml: 2 }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", mt: 5 }}>
      {/* FORM */}
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, boxShadow: 3, borderRadius: 2, mb: 5, backgroundColor: "#fafafa" }}>
        <h2 style={{ textAlign: "center" }}>Add New User</h2>

        <TextField fullWidth label="Roll No" name="rollno" value={formData.rollno} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Phone Number" name="phoneno" value={formData.phoneno} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} margin="normal" required />

        <Box mt={2}>
          <Button type="submit" variant="contained" size="large" fullWidth endIcon={<SendIcon />}>
            Add User
          </Button>
        </Box>
      </Box>

      {/* TABLE */}
      <Box sx={{ boxShadow: 3, borderRadius: 2, p: 3 }}>
        <h2 style={{ textAlign: "center" }}>User List</h2>
        <Table sx={{ width: "100%", borderCollapse: "collapse", mt: 2 }}>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Roll No</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Age</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.rollno} sx={{ textAlign: "center" }}>
                  <TableCell>{user.rollno}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneno}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(user.rollno)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>No users available</TableCell>
              </TableRow>
            )}
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
      </Box>

      <EditUserDialog
        open={openDialog}
        user={selectedUser}
        onCancel={cancelEdit}
        onConfirm={handleSaveEdit}
      />

      {/* Confirmation Dialog for Edit */}
      <Dialog
        open={confirmEditDialog}
        onClose={cancelConfirmEdit}
        aria-labelledby="confirm-edit-dialog-title"
        aria-describedby="confirm-edit-dialog-description"
      >
        <DialogTitle id="confirm-edit-dialog-title">
          Confirm Edit
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-edit-dialog-description">
            You are trying to edit {userToEdit?.name}. Do you wish to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelConfirmEdit} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmEdit} variant="contained" color="primary" autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}