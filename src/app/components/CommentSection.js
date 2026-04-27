"use client"
import { useState } from 'react';
import { Box, Typography, Avatar, TextField, Button, IconButton, Card, CardContent } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplyIcon from '@mui/icons-material/Reply';

export default function CommentSection() {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      content: 'Great article! Really helped me understand the concepts better. Thanks for sharing!',
      date: '2024-01-15',
      likes: 12
    },
    {
      id: 2,
      author: 'Mike Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      content: 'I\'ve been looking for a comprehensive guide like this. The examples are really clear and practical.',
      date: '2024-01-16',
      likes: 8
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const comment = {
        id: comments.length + 1,
        author: 'You',
        avatar: 'https://i.pravatar.cc/150?img=3',
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };

      setComments([comment, ...comments]);
      setNewComment('');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleLike = (commentId) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 4,
        boxShadow: 2,
        p: 4,
        border: 1,
        borderColor: 'grey.100',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 4 }}>
        Comments ({comments.length})
      </Typography>

      {/* Comment Form */}
      <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar
            src="https://i.pravatar.cc/150?img=3"
            alt="Your avatar"
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ flex: 1 }}>
            <TextField
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              multiline
              rows={3}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                variant="contained"
                sx={{
                  px: 3,
                  py: 1,
                  bgcolor: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  '&:hover': {
                    boxShadow: 3,
                  },
                  transition: 'all 0.2s',
                }}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Comments List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {comments.map((comment) => (
          <Box key={comment.id} sx={{ display: 'flex', gap: 2 }}>
            <Avatar
              src={comment.avatar}
              alt={comment.author}
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ flex: 1 }}>
              <Card
                sx={{
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'semibold', color: 'grey.900' }}>
                      {comment.author}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.500' }}>
                      {comment.date}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.6 }}>
                    {comment.content}
                  </Typography>
                </CardContent>
              </Card>

              {/* Comment Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, ml: 2 }}>
                <IconButton
                  onClick={() => handleLike(comment.id)}
                  size="small"
                  sx={{
                    color: 'grey.500',
                    '&:hover': { color: 'primary.main' },
                    transition: 'color 0.2s',
                  }}
                >
                  <FavoriteIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" sx={{ color: 'grey.500', mr: 1 }}>
                  {comment.likes}
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    color: 'grey.500',
                    '&:hover': { color: 'primary.main' },
                    transition: 'color 0.2s',
                  }}
                >
                  <ReplyIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" sx={{ color: 'grey.500' }}>
                  Reply
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Load More Comments */}
      {comments.length > 2 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            sx={{
              px: 3,
              py: 1,
              bgcolor: 'grey.100',
              color: 'grey.700',
              borderColor: 'grey.200',
              '&:hover': { bgcolor: 'grey.200' },
            }}
          >
            Load More Comments
          </Button>
        </Box>
      )}
    </Box>
  );
}