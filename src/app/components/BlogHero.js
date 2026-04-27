import { Box, Typography, Breadcrumbs, Link, Avatar } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function BlogHero({ post }) {
  // Calculate reading time (rough estimate: 200 words per minute)
  const getReadingTime = (content) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 384, md: 500 },
        overflow: 'hidden',
        borderRadius: 4,
        mb: 4,
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${post.cover})`,
        }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Box sx={{ maxWidth: '4xl', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, pb: 6, width: '100%' }}>
          {/* Breadcrumb */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{
              mb: 3,
              '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.8)' },
            }}
          >
            <Link
              href="/"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                '&:hover': { color: 'white' },
                fontSize: '0.875rem',
              }}
            >
              Home
            </Link>
            <Link
              href="/blog"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                '&:hover': { color: 'white' },
                fontSize: '0.875rem',
              }}
            >
              Blog
            </Link>
            <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
              {post.title}
            </Typography>
          </Breadcrumbs>

          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              mb: 2,
              fontSize: { xs: '1.875rem', md: '3rem', lg: '3.75rem' },
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </Typography>

          {/* Meta Information */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, color: 'rgba(255,255,255,0.9)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '0.875rem',
                  fontWeight: 'semibold',
                }}
              >
                {post.author.name.charAt(0)}
              </Avatar>
              <Typography sx={{ fontWeight: 'medium' }}>
                {post.author.name}
              </Typography>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>•</Typography>
            <Typography>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>•</Typography>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                px: 1.5,
                py: 0.5,
                borderRadius: '9999px',
                fontSize: '0.875rem',
              }}
            >
              {getReadingTime(post.content)}
            </Box>
          </Box>

          {/* Description */}
          <Typography
            sx={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.9)',
              mt: 3,
              maxWidth: '2xl',
              lineHeight: 1.6,
            }}
          >
            {post.description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}