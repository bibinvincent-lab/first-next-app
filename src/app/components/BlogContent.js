"use client";
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { sanitizeHTML } from '@/lib/sanitizer';

export default function BlogContent({ content }) {
  const [sanitizedContent, setSanitizedContent] = useState('');
  const [DOMPurify, setDOMPurify] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const loadDOMPurify = async () => {
      try {
        const module = await import('dompurify');
        if (module.default && typeof module.default.sanitize === 'function') {
          setDOMPurify(module.default);
        } else {
          throw new Error('DOMPurify sanitize function not available');
        }
      } catch (err) {
        console.error('Failed to load DOMPurify:', err);
        // Don't set error - we'll use fallback sanitizer
        console.log('Using fallback HTML sanitizer');
      } finally {
        setIsLoading(false);
      }
    };

    loadDOMPurify();
  }, []);

  useEffect(() => {
    if (content) {
      if (DOMPurify && typeof DOMPurify.sanitize === 'function') {
        try {
          // Use DOMPurify for comprehensive sanitization
          const sanitized = DOMPurify.sanitize(content, {
            ALLOWED_TAGS: [
              'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
              'p', 'br', 'strong', 'em', 'u', 'i', 'b',
              'ul', 'ol', 'li',
              'blockquote',
              'code', 'pre',
              'a',
              'img',
              'table', 'thead', 'tbody', 'tr', 'th', 'td'
            ],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
            ALLOW_DATA_ATTR: false
          });
          setSanitizedContent(sanitized);
        } catch (err) {
          console.error('DOMPurify failed, using fallback:', err);
          // Fallback to our custom sanitizer
          setSanitizedContent(sanitizeHTML(content));
        }
      } else {
        // Use our custom fallback sanitizer
        setSanitizedContent(sanitizeHTML(content));
      }
    }
  }, [DOMPurify, content]);

  // Show loading state while DOMPurify is loading
  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        Loading content...
      </Box>
    );
  }

  
  return (
    <Box
      component="article"
      sx={{
        '& .blog-content': {
          lineHeight: 1.8,
        },
        '& .blog-content h1': {
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: 'grey.900',
          mt: 12,
          mb: 6,
        },
        '& .blog-content h2': {
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'grey.900',
          mt: 10,
          mb: 4,
        },
        '& .blog-content h3': {
          fontSize: '1.25rem',
          fontWeight: 'semibold',
          color: 'grey.900',
          mt: 8,
          mb: 3,
        },
        '& .blog-content p': {
          color: 'grey.700',
          mb: 6,
          lineHeight: 1.625,
        },
        '& .blog-content ul, & .blog-content ol': {
          mb: 6,
          pl: 6,
        },
        '& .blog-content li': {
          color: 'grey.700',
          mb: 2,
        },
        '& .blog-content ul li': {
          listStyleType: 'disc',
        },
        '& .blog-content ol li': {
          listStyleType: 'decimal',
        },
        '& .blog-content blockquote': {
          borderLeft: 4,
          borderColor: 'primary.main',
          pl: 6,
          py: 2,
          my: 8,
          bgcolor: 'primary.50',
          fontStyle: 'italic',
          color: 'grey.800',
        },
        '& .blog-content code': {
          bgcolor: 'grey.100',
          px: 2,
          py: 1,
          borderRadius: 1,
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          color: 'grey.800',
        },
        '& .blog-content pre': {
          bgcolor: 'grey.900',
          color: 'grey.100',
          p: 6,
          borderRadius: 2,
          overflowX: 'auto',
          my: 8,
        },
        '& .blog-content pre code': {
          bgcolor: 'transparent',
          px: 0,
          py: 0,
          color: 'grey.100',
        },
        '& .blog-content a': {
          color: 'primary.main',
          '&:hover': {
            color: 'primary.dark',
          },
          transition: 'color 0.2s',
        },
        '& .blog-content img': {
          borderRadius: 2,
          boxShadow: 3,
          my: 8,
          maxWidth: '100%',
          height: 'auto',
        },
        '& .blog-content table': {
          width: '100%',
          borderCollapse: 'collapse',
          border: 1,
          borderColor: 'grey.300',
          my: 8,
        },
        '& .blog-content th, & .blog-content td': {
          border: 1,
          borderColor: 'grey.300',
          px: 4,
          py: 2,
          textAlign: 'left',
        },
        '& .blog-content th': {
          bgcolor: 'grey.100',
          fontWeight: 'semibold',
        },
      }}
    >
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </Box>
  );
}