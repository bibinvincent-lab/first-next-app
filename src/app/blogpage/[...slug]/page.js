"use client"; 

import { useParams } from "next/navigation";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const params = useParams(); // { slug: [...] }
  const slug = params.slug || [];

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth !== "true") {
      router.push("/signup");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl rounded-[32px] bg-white border border-slate-200 p-10 shadow-xl">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">Catch-All Route</h1>
        <p className="text-slate-600">Slug: {slug.length > 0 ? slug.join("/") : "home"}</p>
      </div>
    </div>
  );
}
// "use client"; // must be the very first line

// import { useRouter } from "next/navigation";

// export default function BlogPage() {
//   const router = useRouter();
  
//   // In the new App Router, router.query is replaced by params from the function props
//   // So better approach:
  
//   return (
//     <div>
//       <h1>Catch-All Route</h1>
//       <p>Slug: (slug from params or route)</p>
//     </div>
//   );
// }
