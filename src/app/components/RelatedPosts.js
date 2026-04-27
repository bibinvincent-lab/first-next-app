"use client";
import Link from 'next/link';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Avatar } from '@mui/material';

export default function RelatedPosts({ currentPostId, posts = [] }) {
  // Filter out current post and get first 3 related posts
  const relatedPosts = posts
    .filter(post => post.slug !== currentPostId)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 4 }}>
        Related Articles
      </Typography>
      <Grid container spacing={3}>
        {relatedPosts.map((post) => (
          <Grid size={{ xs: 12, md: 4 }} key={post.slug}>
            <Card
              component={Link}
              href={`/blog/${post.slug}`}
              sx={{
                bgcolor: 'white',
                borderRadius: 4,
                boxShadow: 2,
                border: 1,
                borderColor: 'grey.100',
                textDecoration: 'none',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {/* Post Image */}
              <Box sx={{ position: 'relative', height: 192, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  image={post.cover}
                  alt={post.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              {/* Post Content */}
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'semibold',
                    color: 'grey.900',
                    mb: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.3,
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
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
                    lineHeight: 1.4,
                  }}
                >
                  {post.description}
                </Typography>

                {/* Meta Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      src={post.author.avatar}
                      alt={post.author.name}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="body2" sx={{ color: 'grey.500' }}>
                      {post.author.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'grey.500' }}>
                    {new Date(post.date).toLocaleDateString('en-GB')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}