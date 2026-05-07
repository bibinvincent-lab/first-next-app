"use client";

import { usePathname } from "next/navigation";
import { Box } from '@mui/material';
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideLayout = ["/register", "/login"].includes(pathname);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50',
      }}
    >
      {!hideLayout && <Navbar />}

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {!hideLayout && <Footer />}
    </Box>
  );
}