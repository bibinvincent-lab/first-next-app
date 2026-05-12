"use client";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { posts } from "@/lib/posts";
import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  CircularProgress,
} from '@mui/material';

export default function BlogListPage() {
  const { requireAuth, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const authorized = requireAuth();
      setIsAuthorized(authorized);
    }
  }, [isLoading, requireAuth]);

  // Show loading state while checking authorization
  if (isLoading || !isAuthorized) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 6 }}>
      
      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            color: 'grey.900',
            mb: 3,
            fontSize: { xs: '2.5rem', md: '4rem' },
          }}
        >
          Latest{" "}
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Articles
          </Box>
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: 'grey.600',
            maxWidth: 900,
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Discover insights, tutorials, and stories from industry experts.
        </Typography>
      </Box>

      {/* Grid */}
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={post.slug}>
            <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: 1,
                  borderColor: 'grey.100',
                  boxShadow: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ height: 192 }}>
                  <CardMedia
                    component="img"
                    height="192"
                    image={post.cover}
                    alt={post.title}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {post.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'grey.600', mb: 2 }}>
                    {post.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Avatar src={post.author.avatar} />
                      <Typography variant="body2">
                        {post.author.name}
                      </Typography>
                    </Box>

                    <Typography variant="body2">
                      {new Date(post.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>

              </Card>

            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}