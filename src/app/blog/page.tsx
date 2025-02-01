import { blogPosts } from "@/data/blog-posts";
import { format } from "date-fns";
import Link from "next/link";

export const metadata = {
  title: "Blog | BUIDL - Memecoin Website Generator",
  description: "Latest insights, guides, and updates about memecoins and cryptocurrency trends.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto transition-[max-width] duration-200  max-w-7xl px-4 sm:px-8 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {post.image && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{post.author}</span>
                <span>
                  {format(new Date(post.publishedAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
