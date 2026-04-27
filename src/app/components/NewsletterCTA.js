"use client"
import { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  return (
    <Box
      sx={{
        bgcolor: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        borderRadius: 4,
        p: { xs: 4, md: 6 },
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Box sx={{ maxWidth: 512, mx: 'auto' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1.875rem', md: '2.25rem' } }}>
          Stay Updated with Latest Articles
        </Typography>
        <Typography variant="body1" sx={{ color: 'primary.100', mb: 4, fontSize: '1.125rem', lineHeight: 1.6 }}>
          Get the latest insights, tutorials, and industry news delivered straight to your inbox.
          Join thousands of developers who stay ahead of the curve.
        </Typography>

        {!isSubscribed ? (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                    borderWidth: 2,
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: 'grey.900',
                  '&::placeholder': {
                    color: 'grey.500',
                  },
                },
              }}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              sx={{
                px: 3,
                py: 1.5,
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 'semibold',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'grey.50',
                },
                whiteSpace: 'nowrap',
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              p: 3,
              backdropFilter: 'blur(4px)',
            }}
          >
            <Typography variant="h1" sx={{ mb: 2, fontSize: '2.5rem' }}>
              🎉
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'semibold', mb: 1 }}>
              Welcome to the community!
            </Typography>
            <Typography variant="body1" sx={{ color: 'primary.100' }}>
              Thank you for subscribing. Check your email for a confirmation link.
            </Typography>
          </Box>
        )}

        <Typography variant="body2" sx={{ mt: 3, color: 'primary.100' }}>
          No spam, unsubscribe at any time. We respect your privacy.
        </Typography>
      </Box>
    </Box>
  );
}