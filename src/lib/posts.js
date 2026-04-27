export const posts = [
  {
    slug: "nextjs-blog-guide",
    title: "The Ultimate Guide to Next.js Blog",
    description: "Learn how to build a fast blog using Next.js.",
    content: `
      <h2>Introduction</h2>
      <p>Next.js is a React framework for production apps.</p>

      <h2>Why use it?</h2>
      <ul>
        <li>SEO friendly</li>
        <li>Fast rendering</li>
        <li>File-based routing</li>
      </ul>

      <h2>Conclusion</h2>
      <p>You can now build a full blog easily.</p>
    `,
    author: {
      name: "Klein",
      bio: "Full-stack developer",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    date: "2026-04-10",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  },

  {
    slug: "react-tips",
    title: "Top React Tips for Beginners",
    description: "Improve your React skills quickly.",
    content: `
      <h2>React Tips</h2>
      <p>Always break components into small pieces.</p>
    `,
    author: {
      name: "Kevin",
      bio: "React Developer",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    date: "2026-04-12",
    cover:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  },

  // NEW POSTS 👇

  {
    slug: "javascript-es6-features",
    title: "Must-Know ES6 JavaScript Features",
    description: "Upgrade your JS skills with modern ES6 features.",
    content: `
      <h2>Arrow Functions</h2>
      <p>Simpler syntax and lexical this.</p>

      <h2>Destructuring</h2>
      <p>Extract values from arrays and objects easily.</p>

      <h2>Modules</h2>
      <p>Use import/export for cleaner code.</p>
    `,
    author: {
      name: "Sara",
      bio: "Frontend Engineer",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    date: "2026-04-14",
    cover:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
  },

  {
    slug: "css-grid-vs-flexbox",
    title: "CSS Grid vs Flexbox",
    description: "Understand when to use Grid and Flexbox.",
    content: `
      <h2>Flexbox</h2>
      <p>Best for one-dimensional layouts.</p>

      <h2>Grid</h2>
      <p>Best for two-dimensional layouts.</p>

      <h2>Conclusion</h2>
      <p>Use both together for powerful layouts.</p>
    `,
    author: {
      name: "Anita",
      bio: "UI Designer",
      avatar: "https://i.pravatar.cc/150?img=20",
    },
    date: "2026-04-15",
    cover:
      "https://images.unsplash.com/photo-1505685296765-3a2736de412f",
  },

  {
    slug: "nodejs-api-guide",
    title: "Building REST APIs with Node.js",
    description: "Step-by-step guide to building APIs.",
    content: `
      <h2>Setup</h2>
      <p>Install Express and initialize your app.</p>

      <h2>Routing</h2>
      <p>Create endpoints for your API.</p>

      <h2>Database</h2>
      <p>Connect MongoDB or PostgreSQL.</p>
    `,
    author: {
      name: "Rahul",
      bio: "Backend Developer",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    date: "2026-04-16",
    cover:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
  },

  {
    slug: "web-performance-tips",
    title: "Web Performance Optimization Tips",
    description: "Make your website blazing fast.",
    content: `
      <h2>Lazy Loading</h2>
      <p>Load images only when needed.</p>

      <h2>Code Splitting</h2>
      <p>Reduce bundle size.</p>

      <h2>Caching</h2>
      <p>Use browser caching effectively.</p>
    `,
    author: {
      name: "Maya",
      bio: "Performance Engineer",
      avatar: "https://i.pravatar.cc/150?img=25",
    },
    date: "2026-04-17",
    cover:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  },
];

export function getPost(slug) {
  return posts.find((p) => p.slug === slug);
}