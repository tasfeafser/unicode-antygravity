"use client";

import { useEffect, useState } from "react";

export function ProductHuntBadge() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center gap-4 py-12 px-6 bg-muted/20 border border-dashed border-border rounded-3xl mt-20">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Support us on Product Hunt</h3>
        <p className="text-muted-foreground">We're launching soon! Stay tuned and help us spread the word.</p>
      </div>
      
      <a 
        href="https://www.producthunt.com/posts/unicode-platform" 
        target="_blank" 
        rel="noreferrer"
        className="hover:scale-105 transition-transform"
      >
        <img 
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=unicode-platform&theme=dark" 
          alt="Unicode Platform - AI-powered Computer Science Education | Product Hunt" 
          width="250" 
          height="54" 
        />
      </a>
    </div>
  );
}
