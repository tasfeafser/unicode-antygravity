import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

// Placeholder data - in a real app, this would come from Supabase or Markdown files
const POSTS = {
  "future-of-ai-cs-education": {
    title: "The Future of AI in Computer Science Education",
    date: "April 10, 2026",
    readTime: "5 min read",
    content: `
      <p>Artificial Intelligence is not just a tool; it's becoming the co-pilot for every Computer Science student. At Unicode, we believe the transition from "learning to code" to "learning to solve problems with AI" is the single most important shift in modern education.</p>
      <h3>The Hybrid IDE</h3>
      <p>Imagine an environment where your IDE doesn't just show syntax errors, but understands your logic. Our platform integrates Large Language Models directly into the terminal and code editor, providing context-aware guidance without doing the work for you.</p>
      <h3>Security and Sandboxing</h3>
      <p>Practice makes perfect, but only when practice is safe. Our Linux sandboxes allow students to experiment with destructive commands, network configurations, and security protocols in a completely isolated environment.</p>
    `,
    category: "AI & Future"
  },
  "mastering-linux-terminals": {
    title: "Mastering the Linux Terminal: A Beginner's Guide",
    date: "April 12, 2026",
    readTime: "8 min read",
    content: `
      <p>The terminal is the heart of professional software engineering. This guide covers the essential commands every Unicode student should master.</p>
      <h3>Navigation Basics</h3>
      <p>Start with <code>ls</code>, <code>cd</code>, and <code>pwd</code>. These are your eyes and feet in the Linux filesystem.</p>
      <h3>File Manipulation</h3>
      <p>Learn to create and edit files using <code>touch</code>, <code>mkdir</code>, and <code>nano</code> (or <code>vim</code> if you're feeling adventurous).</p>
    `,
    category: "Tutorials"
  }
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug as keyof typeof POSTS];

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <Link href="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-12 transition">
        <ArrowLeft size={16} /> Back to Blog
      </Link>

      <div className="space-y-6 mb-12">
        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {post.category}
        </span>
        <h1 className="text-5xl font-extrabold leading-tight">{post.title}</h1>
        <div className="flex items-center gap-6 text-muted-foreground text-sm">
          <span className="flex items-center gap-2"><Calendar size={14} /> {post.date}</span>
          <span className="flex items-center gap-2"><Clock size={14} /> {post.readTime}</span>
        </div>
      </div>

      <div 
        className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <div className="mt-20 pt-10 border-t border-border flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Written by</span>
          <span className="font-bold">Unicode Editorial Team</span>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition font-medium">
          Follow for Updates
        </button>
      </div>
    </div>
  );
}
