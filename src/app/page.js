"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { posts } from '@/lib/posts';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  CircularProgress,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, requireAuth } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const authorized = requireAuth();
      // Only show content if authorized (no redirect happened)
    }
  }, [isLoading, requireAuth]);

  // Get featured posts (first 3)
  const featuredPosts = posts.slice(0, 3);

  if (isLoading || !isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress aria-label="Loading…" />
        <Typography sx={{ ml: 2 }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%)',
          color: 'white',
          py: { xs: 12, md: 16 },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0, 0, 0, 0.2)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            maxWidth: 'lg',
            mx: 'auto',
            px: { xs: 2, sm: 3, lg: 4 },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              lineHeight: 1.2,
            }}
          >
            Welcome to <Box component="span" sx={{ display: 'block' }}>BlogSpace</Box>
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'blue.100',
              mb: 4,
              maxWidth: '3xl',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Discover insights, stories, and expertise from industry leaders.
            Join our community of curious minds and lifelong learners.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/blog"
              variant="contained"
              sx={{
                bgcolor: 'purple',
                color: 'blue.600',
                fontWeight: 'semibold',
                borderRadius: '9999px',
                px: 4,
                py: 2,
                '&:hover': {
                  bgcolor: 'grey.50',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
                boxShadow: 2,
              }}
            >
              Explore Articles
            </Button>
            {/* <Button
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'white',
                fontWeight: 'semibold',
                borderRadius: '9999px',
                px: 4,
                py: 2,
                '&:hover': {
                  bgcolor: 'white',
                  color: 'blue.600',
                },
                transition: 'all 0.2s',
              }}
            >
              Learn More
            </Button> */}
          </Box>
        </Box>
      </Box>

      {/* Featured Posts Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
        <Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 2 }}>
              Featured Articles
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.600', maxWidth: '2xl', mx: 'auto' }}>
              Handpicked articles that showcase the best of our content
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <Grid item xs={12} md={6} lg={4} key={post.slug}>
                <Card
                  component={Link}
                  href={`/blog/${post.slug}`}
                  sx={{
                    textDecoration: 'none',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: 1,
                    borderColor: 'grey.100',
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="192"
                    image={post.cover}
                    alt={post.title}
                    sx={{
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'semibold',
                        color: 'grey.900',
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        '&:hover': {
                          color: 'blue.600',
                        },
                        transition: 'color 0.3s',
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'grey.600',
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={post.author.avatar} alt={post.author.name} sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2" sx={{ color: 'grey.500' }}>
                          {post.author.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'grey.500' }}>
                        {new Date(post.date).toLocaleDateString("en-GB")}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              href="/blog"
              variant="outlined"
              sx={{
                bgcolor: 'grey.100',
                color: 'grey.700',
                borderRadius: '9999px',
                px: 3,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'grey.200',
                },
                transition: 'all 0.2s',
              }}
              endIcon={<ArrowForwardIcon />}
            >
              View All Articles
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Section */}
      {/* <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'blue.600', mb: 1 }}>
                  500+
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.600' }}>
                  Articles Published
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'purple.600', mb: 1 }}>
                  10K+
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.600' }}>
                  Monthly Readers
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'green.600', mb: 1 }}>
                  50+
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.600' }}>
                  Expert Authors
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'orange.600', mb: 1 }}>
                  99%
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.600' }}>
                  Satisfaction Rate
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box> */}

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ maxWidth: '4xl', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" sx={{ color: 'blue.100', mb: 4, lineHeight: 1.6 }}>
            Join thousands of readers who trust us for quality content and insights.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/blog"
              variant="contained"
              sx={{
                bgcolor: 'purple',
                color: 'blue.600',
                fontWeight: 'semibold',
                borderRadius: '9999px',
                px: 4,
                py: 2,
                '&:hover': {
                  bgcolor: 'grey.50',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
                boxShadow: 2,
              }}
            >
              Start Reading
            </Button>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}