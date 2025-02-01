import { blogPosts } from "@/data/blog-posts";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = blogPosts.find((post) => post.slug === params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | BUIDL Blog`,
    description: post.excerpt,
    keywords: "memecoin website template, memecoin website template free, best memecoin website, meme coin website template github, how to make a meme coin website, memecoin designer, memecoin trading, create meme coin on base, create memecoin website, build memecoin website, launch memecoin site, memecoin generator",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    }
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const renderContent = (content: string) => {
    return content.split("\n").map((paragraph, index) => {
      // Handle headings
      if (paragraph.startsWith("#")) {
        const headingMatch = paragraph.match(/^#+/);
        if (headingMatch) {
          const level = Math.min(headingMatch[0].length, 6);
          const text = paragraph.replace(/^#+\s/, "");
          const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
          return <HeadingTag key={index} className="mt-6 mb-4">{text}</HeadingTag>;
        }
      }

      // Handle markdown links
      if (paragraph.includes("[") && paragraph.includes("]")) {
        const segments = [];
        let lastIndex = 0;
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;

        while ((match = linkRegex.exec(paragraph)) !== null) {
          // Add text before the link
          if (match.index > lastIndex) {
            segments.push(paragraph.slice(lastIndex, match.index));
          }

          // Add the link
          const [, text, url] = match;
          segments.push(
            url.startsWith("/") ? (
              <Link key={`${index}-${match.index}`} href={url} className="text-primary hover:text-primary/80 font-medium">
                {text}
              </Link>
            ) : (
              <a key={`${index}-${match.index}`} href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium">
                {text}
              </a>
            )
          );

          lastIndex = match.index + match[0].length;
        }

        // Add any remaining text
        if (lastIndex < paragraph.length) {
          segments.push(paragraph.slice(lastIndex));
        }

        return <p key={index} className="mb-4">{segments}</p>;
      }

      // Handle lists
      if (paragraph.trim().startsWith("- ")) {
        return <li key={index} className="ml-6 mb-2">{paragraph.trim().slice(2)}</li>;
      }

      // Regular paragraph
      return paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>;
    });
  };

  return (
    <article className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Schema.org markup for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.excerpt,
            "keywords": "memecoin website template, memecoin website template free, best memecoin website, meme coin website template github, how to make a meme coin website, memecoin designer, memecoin trading, create meme coin on base",
            "author": {
              "@type": "Organization",
              "name": post.author
            },
            "datePublished": post.publishedAt,
            "image": post.image,
            "publisher": {
              "@type": "Organization",
              "name": "BUIDL",
              "logo": {
                "@type": "ImageObject",
                "url": "/logo.png"
              }
            }
          })
        }}
      />
      {post.image && (
        <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <span>{post.author}</span>
          <span>•</span>
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), "MMMM d, yyyy")}
          </time>
        </div>
      </header>

      <div className="prose dark:prose-invert max-w-none">
        {/* Hidden SEO text - visible to search engines */}
        <div className="hidden">
          Looking for memecoin website template, best memecoin website templates, memecoin website template free, meme coin website template github, how to make a meme coin website, memecoin designer tools, memecoin trading platform, create meme coin on base chain. BUIDL offers professional memecoin website builder and templates.
        </div>
        {renderContent(post.content)}
      </div>
    </article>
  );
}
