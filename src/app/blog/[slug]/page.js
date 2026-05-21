import { notFound, redirect } from "next/navigation";
import { cookies } from 'next/headers';
import { getPost, posts } from "@/lib/posts";
import BlogHero from "@/app/components/BlogHero";
import BlogContent from "@/app/components/BlogContent";
import Tags from "@/app/components/Tags";
import RelatedPosts from "@/app/components/RelatedPosts";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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

export default async function BlogPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  if (!sessionToken || !(await validateSession(sessionToken))) {
    redirect("/login");
  }

  if (!post) {
    notFound();
  }

  return (
    <Box sx={{ maxWidth: '5xl', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
        {/* Blog Hero Section */}
        <BlogHero post={post} />

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Blog Content - Main Column */}
          <Grid item xs={12} lg={9}>
            <BlogContent content={post.content} />

            {/* Tags */}
            <Tags />


          </Grid>


        </Grid>

        {/* Related Posts Section (Full Width) */}
        <RelatedPosts currentPostId={post.slug} posts={posts} />
    </Box>
  );
}