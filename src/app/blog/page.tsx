import { blogPosts } from "@/data/blog-posts";
import { format } from "date-fns";
import Link from "next/link";

export const metadata = {
  title: "Blog | BUIDL - Memecoin Website Generator",
  description: "Latest insights, guides, and updates about memecoins and cryptocurrency trends.",
};

export default function BlogPage() {
  // Sort blog posts by publishedAt date, newest first
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  // Get the most recent post
  const mostRecentPost = sortedPosts[0];

  return (
    <div className="mx-auto transition-[max-width] duration-200  max-w-7xl px-4 sm:px-8 lg:px-8 py-20">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full border-2 border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30"
          >
            {post.image && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {post.slug === mostRecentPost.slug && (
                  <div className="absolute top-0 left-0 text-white text-xs font-bold px-3 py-1 rounded-br-md" 
                       style={{ background: 'linear-gradient(90deg, #9945FF, #14F195)' }}>
                    NEW
                  </div>
                )}
              </div>
            )}
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                    {post.author.charAt(0)}
                  </div>
                  <span className="font-medium text-sm">{post.author}</span>
                </div>
                <div className="flex items-center text-xs font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {format(new Date(post.publishedAt), "MMM d, yyyy")}
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
