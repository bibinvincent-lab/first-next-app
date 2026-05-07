import { notFound, redirect } from "next/navigation";
import { cookies } from 'next/headers';
import { getPost, posts } from "@/lib/posts";
import BlogHero from "@/app/components/BlogHero";
import BlogContent from "@/app/components/BlogContent";
import Tags from "@/app/components/Tags";
import RelatedPosts from "@/app/components/RelatedPosts";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default async function BlogPage({ params }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");

  if (!sessionToken) {
    redirect("/login");
  }

  const { slug } = params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <Box sx={{ maxWidth: '1400', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
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