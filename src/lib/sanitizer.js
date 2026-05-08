// src/lib/sanitizer.js - Simple HTML sanitizer fallback

// Basic HTML sanitizer for XSS protection
export function sanitizeHTML(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Remove dangerous tags and attributes
  let sanitized = content
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove object tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Remove embed tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Remove form tags
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    // Remove input tags
    .replace(/<input\b[^>]*>/gi, '')
    // Remove button tags
    .replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '')
    // Remove event handlers
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\bon\w+\s*=\s*[^"'\s>]+/gi, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    // Remove data: URLs that could execute scripts
    .replace(/data:(?!image\/)/gi, '')
    // Remove vbscript: protocols
    .replace(/vbscript:/gi, '')
    // Remove file: protocols
    .replace(/file:/gi, '')
    // Remove style tags with potentially dangerous content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove meta tags
    .replace(/<meta\b[^>]*>/gi, '')
    // Remove link tags
    .replace(/<link\b[^>]*>/gi, '');

  // Allow safe tags with their attributes
  const allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'u', 'i', 'b',
    'ul', 'ol', 'li',
    'blockquote',
    'code', 'pre',
    'a',
    'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span'
  ];

  const allowedAttributes = {
    'a': ['href', 'title', 'alt'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan'],
    '*': ['class', 'id'] // Generic attributes allowed on all tags
  };

  // Process remaining HTML to ensure only allowed tags and attributes remain
  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
  
  sanitized = sanitized.replace(tagPattern, (match, tagName, attributes) => {
    const lowerTagName = tagName.toLowerCase();
    
    // Check if tag is allowed
    if (!allowedTags.includes(lowerTagName)) {
      return ''; // Remove disallowed tags
    }

    // Process attributes
    let sanitizedAttributes = '';
    if (attributes) {
      const attrPattern = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*["']([^"']*)["']/g;
      const attrs = [];
      
      let attrMatch;
      while ((attrMatch = attrPattern.exec(attributes)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        const attrValue = attrMatch[2];
        
        // Check if attribute is allowed for this tag
        const allowedForTag = allowedAttributes[lowerTagName] || [];
        const allowedGeneric = allowedAttributes['*'] || [];
        
        if (allowedForTag.includes(attrName) || allowedGeneric.includes(attrName)) {
          // Additional validation for specific attributes
          if (attrName === 'href') {
            // Ensure href doesn't contain dangerous protocols
            if (!attrValue.match(/^(https?:\/\/|ftp:\/\/|mailto:|#|\/)/)) {
              continue; // Skip dangerous href
            }
          } else if (attrName === 'src') {
            // Ensure src doesn't contain dangerous protocols
            if (!attrValue.match(/^(https?:\/\/|\/|data:image\/)/)) {
              continue; // Skip dangerous src
            }
          }
          
          attrs.push(`${attrName}="${attrValue}"`);
        }
      }
      
      if (attrs.length > 0) {
        sanitizedAttributes = ' ' + attrs.join(' ');
      }
    }

    return `<${tagName}${sanitizedAttributes}>`;
  });

  return sanitized;
}

// Validate and sanitize user input
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
}

// Sanitize URLs
export function sanitizeURL(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }

  return url
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/file:/gi, '')
    .replace(/</g, '')
    .replace(/>/g, '')
    .trim();
}
