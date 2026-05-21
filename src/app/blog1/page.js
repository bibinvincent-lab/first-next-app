
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from "next/link";
import { posts } from "@/lib/posts";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
} from '@mui/material';
import { createConnection } from '@/lib/db';
import { isSessionExpired, isSessionInactive } from '@/lib/session';

async function validateSession(sessionToken) {
  const connection = await createConnection();
  try {
    const [sessions] = await connection.execute(
      `SELECT s.expires_at, s.last_activity
       FROM user_sessions s
       WHERE s.session_token = ?`,
      [sessionToken]
    );

    if (sessions.length === 0) return false;

    const session = sessions[0];
    if (isSessionExpired(session.expires_at) || isSessionInactive(session.last_activity)) {
      await connection.execute(
        'DELETE FROM user_sessions WHERE session_token = ?',
        [sessionToken]
      );
      return false;
    }

    await connection.execute(
      'UPDATE user_sessions SET last_activity = NOW() WHERE session_token = ?',
      [sessionToken]
    );
    return true;
  } finally {
    connection.release();
  }
}

export default async function BlogListPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  if (!sessionToken || !(await validateSession(sessionToken))) {
    redirect("/login");
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 'bold',
            color: 'grey.900',
            mb: 3,
            fontSize: { xs: '2.5rem', md: '4rem' },
          }}
        >
          Latest{' '}
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
            maxWidth: '3xl',
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Discover insights, tutorials, and stories from industry experts.
          Stay updated with the latest trends and best practices.
        </Typography>
      </Box>

      {/* Blog Grid */}
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={post.slug}>
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
              {/* Post Image */}
              <Box sx={{ position: 'relative', height: 192, overflow: 'hidden' }}>
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
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              {/* Post Content */}
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

                {/* Meta Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={post.author.avatar} alt={post.author.name} sx={{ width: 24, height: 24 }} />
                    <Typography variant="body2" sx={{ color: 'grey.500' }}>
                      {post.author.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'grey.500' }}>
                    {new Date(post.date).toLocaleDateString()}
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
