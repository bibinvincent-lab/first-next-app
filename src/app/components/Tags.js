import { Box, Typography, Chip } from '@mui/material';

export default function Tags({ tags = [] }) {
  // Default tags if none provided
  const defaultTags = ['React', 'Next.js', 'JavaScript', 'Web Development'];

  const displayTags = tags.length > 0 ? tags : defaultTags;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Tags
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {displayTags.map((tag, index) => (
          <Chip
            key={index}
            label={`#${tag}`}
            variant="outlined"
            color="primary"
            sx={{
              background: 'linear-gradient(45deg, #eff6ff 30%, #faf5ff 90%)',
              borderColor: '#bfdbfe',
              color: '#1d4ed8',
              '&:hover': {
                boxShadow: 2,
              },
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}