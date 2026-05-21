"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useAuth } from "@/hooks/useAuth";

export default function ContactPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, requireAuth } = useAuth();

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!isLoading) {
      const authorized = requireAuth();
      // Only show form if authorized (no redirect happened)
    }
  }, [isLoading, requireAuth]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formState.name || !formState.email || !formState.subject || !formState.message) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  // 🔄 Loading screen (MUI)
  if (isLoading || !isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 8 }}>
      
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        
        <Grid container spacing={4}>
          
          {/* LEFT SECTION */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper elevation={6} sx={{ borderRadius: 4, overflow: "hidden" }}>
              
              {/* HEADER */}
              <Box
                sx={{
                  background: "linear-gradient(to right, #2563eb, #7c3aed, #2563eb)",
                  color: "white",
                  p: 5,
                }}
              >
                <Typography variant="overline">
                  Contact Support
                </Typography>

                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                  Get in Touch
                </Typography>

                <Typography sx={{ mt: 2 }}>
                  Have questions or feedback? Send us a message and our team will respond.
                </Typography>
              </Box>

              {/* CONTENT */}
              <Box sx={{ p: 4 }}>
                
                <Grid container spacing={4}>
                  
                  {/* CONTACT INFO */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Contact Information
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                      Reach out for support or inquiries.
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Typography><b>Email:</b> support@blogspace.com</Typography>
                      <Typography><b>Phone:</b> +1 (555) 014-5678</Typography>
                      <Typography><b>Address:</b> Austin, TX</Typography>
                    </Box>
                  </Grid>

                  {/* FORM */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      
                      <TextField
                        label="Name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        fullWidth
                      />

                      <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        fullWidth
                      />

                      <TextField
                        label="Subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        fullWidth
                      />

                      <TextField
                        label="Message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                      >
                        Send Message
                      </Button>

                      {status === "success" && (
                        <Typography color="success.main">
                          Message sent successfully!
                        </Typography>
                      )}

                      {status === "error" && (
                        <Typography color="error">
                          Please fill all fields.
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* RIGHT SIDEBAR */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              
              <Typography variant="h6" fontWeight="bold">
                Need immediate help?
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Support available Mon–Fri, 9AM–6PM
              </Typography>

              <Box sx={{ mt: 3, p: 2, bgcolor: "#f1f5f9", borderRadius: 2 }}>
                <Typography fontWeight="bold">Office Hours</Typography>
                <Typography>Mon–Fri</Typography>
                <Typography>9:00 AM – 6:00 PM</Typography>
              </Box>

              <Box sx={{ mt: 3, p: 2, bgcolor: "#f1f5f9", borderRadius: 2 }}>
                <Typography fontWeight="bold">Response Time</Typography>
                <Typography>Within 24 hours</Typography>
              </Box>

              <Box sx={{ mt: 3, p: 2, bgcolor: "primary.main", color: "white", borderRadius: 2 }}>
                <Typography>newsletter@blogspace.com</Typography>
              </Box>

            </Paper>
          </Grid>

        </Grid>


      </Box>
    </Box>
  );
}