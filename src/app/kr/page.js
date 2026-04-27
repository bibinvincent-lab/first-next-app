"use client";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';

export default function BlogNav() {
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
  return (
    <div>
      <h1>KR Page</h1>
      <p>This page demonstrates navigation.</p>
      <Link href={`/blog?page=2`}>Next Page</Link>
      <h1>Hello, Next.js!</h1>
    </div>
  );
}