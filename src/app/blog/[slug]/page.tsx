import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import Partners from "@/components/Partners";

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

  // Construct the absolute URL for the image
  const imageUrl = post.image ? `https://buidl.co.in${post.image}` : '';

  return {
    title: `${post.title} | BUIDL Blog`,
    description: post.excerpt,
    keywords: "memecoin website template, memecoin website template free, best memecoin website, meme coin website template github, how to make a meme coin website, memecoin designer, memecoin trading, create meme coin on base, create memecoin website, build memecoin website, launch memecoin site, memecoin generator",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://buidl.co.in/blog/${post.slug}`,
      images: post.image ? [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: post.title
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : [],
    }
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const renderContent = (content: string) => {
    // Process content by grouping list items together
    const lines = content.split("\n");
    const processedLines = [];
    let currentListType = null; // 'ul' for unordered, 'ol' for ordered
    let currentListItems = [];

    // Process lines to group list items
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Check if this is a list item
      const isUnorderedListItem = trimmedLine.startsWith('- ');
      const isOrderedListItem = /^\d+\.\s/.test(trimmedLine);

      if (isUnorderedListItem || isOrderedListItem) {
        const newListType = isUnorderedListItem ? 'ul' : 'ol';
        
        // If we're starting a new list or switching list types
        if (currentListType !== newListType) {
          // If we have a previous list, add it to processed lines
          if (currentListItems.length > 0) {
            processedLines.push({ type: currentListType, items: [...currentListItems] });
            currentListItems = [];
          }
          currentListType = newListType;
        }
        
        // Add the item to the current list
        const content = isUnorderedListItem 
          ? trimmedLine.slice(2) // Remove '- '
          : trimmedLine.replace(/^\d+\.\s/, ''); // Remove the number and dot
        currentListItems.push(content);
      } else {
        // If we have a list in progress, add it to processed lines
        if (currentListItems.length > 0) {
          processedLines.push({ type: currentListType, items: [...currentListItems] });
          currentListItems = [];
          currentListType = null;
        }
        
        // Add the regular line
        processedLines.push(line);
      }
    }

    // Add any remaining list
    if (currentListItems.length > 0) {
      processedLines.push({ type: currentListType, items: [...currentListItems] });
    }

    // Render the processed content
    return processedLines.map((item, index) => {
      // If this is a list
      if (typeof item !== 'string') {
        const ListTag = item.type === 'ul' ? 'ul' : 'ol';
        return (
          <ListTag key={index} className={`ml-6 mb-6 ${item.type === 'ul' ? 'list-disc' : 'list-decimal'}`}>
            {item.items.map((listItem, itemIndex) => {
              // Process markdown within list items (bold, links, etc.)
              return <li key={itemIndex} className="mb-2">{renderMarkdownText(listItem, `${index}-${itemIndex}`)}</li>;
            })}
          </ListTag>
        );
      }

      const paragraph = item;

      // Skip empty lines but preserve spacing
      if (!paragraph.trim()) {
        return <div key={index} className="h-4"></div>;
      }

      // Check if paragraph contains HTML tags
      if (paragraph.includes("<u>") || paragraph.includes("<strong>") || paragraph.includes("<em>")) {
        return <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: paragraph }} />;
      }
      
      // Handle headings
      if (paragraph.trim().startsWith("#")) {
        const headingMatch = paragraph.trim().match(/^#+/);
        if (headingMatch) {
          const level = Math.min(headingMatch[0].length, 6);
          const text = paragraph.trim().replace(/^#+\s/, "");
          const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
          return <HeadingTag key={index} className="mt-6 mb-4 font-bold">{renderMarkdownText(text, `heading-${index}`)}</HeadingTag>;
        }
      }

      // Handle markdown links and bold/italic text
      if (paragraph.includes("[") || paragraph.includes("*") || paragraph.includes("_")) {
        return <p key={index} className="mb-4">{renderMarkdownText(paragraph, index)}</p>;
      }

      // Regular paragraph
      return paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>;
    });
  };

  // Helper function to render markdown text elements (bold, italic, links)
  const renderMarkdownText = (text: string, keyPrefix: string | number) => {
    const segments = [];
    let lastIndex = 0;

    // Process links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let linkMatch;

    while ((linkMatch = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (linkMatch.index > lastIndex) {
        segments.push(processTextSegment(text.slice(lastIndex, linkMatch.index), `${keyPrefix}-t${segments.length}`));
      }

      // Add the link
      const [, linkText, url] = linkMatch;
      segments.push(
        url.startsWith("/") ? (
          <Link key={`${keyPrefix}-l${segments.length}`} href={url} className="blog-link text-primary hover:underline">
            {processTextSegment(linkText, `${keyPrefix}-lt${segments.length}`)}
          </Link>
        ) : (
          <a key={`${keyPrefix}-a${segments.length}`} href={url} target="_blank" rel="noopener noreferrer" className="blog-link text-primary hover:underline">
            {processTextSegment(linkText, `${keyPrefix}-at${segments.length}`)}
          </a>
        )
      );

      lastIndex = linkMatch.index + linkMatch[0].length;
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      segments.push(processTextSegment(text.slice(lastIndex), `${keyPrefix}-t${segments.length}`));
    }

    return segments.length > 0 ? segments : text;
  };

  // Process bold and italic text
  const processTextSegment = (text: string, key: string | number) => {
    // Process bold text (both ** and __ syntax)
    let processedText = text;
    const boldRegex = /\*\*([^*]+?)\*\*|__([^_]+?)__/g;
    
    // Replace bold markers with JSX
    processedText = processedText.replace(boldRegex, (match, p1, p2) => {
      const content = p1 || p2;
      return `<strong>${content}</strong>`;
    });

    // Process italic text (both * and _ syntax)
    const italicRegex = /\*([^*]+?)\*|_([^_]+?)_/g;
    processedText = processedText.replace(italicRegex, (match, p1, p2) => {
      const content = p1 || p2;
      return `<em>${content}</em>`;
    });

    // If we made any replacements, use dangerouslySetInnerHTML
    if (processedText !== text) {
      return <span key={key} dangerouslySetInnerHTML={{ __html: processedText }} />;
    }

    return processedText;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
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
      
      {/* Hero section with featured image */}
      {post.image && (
        <div className="relative w-full h-[50vh] min-h-[400px] mb-0">
          <div className="absolute inset-0">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/30"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full ">
            <div className="container mx-auto px-4 sm:px-8 lg:px-8 pb-12 max-w-4xl">
              <div className="max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm">
                      <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{post.author.charAt(0)}</p>
                    </div>
                    <span className="font-medium text-white">{post.author}</span>
                  </div>
                  <span className="text-white">•</span>
                  <time dateTime={post.publishedAt} className="text-white">
                    {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <article className="container mx-auto px-4 sm:px-8 lg:px-8 py-12 relative">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 -mt-16 relative z-10">
          {/* Reading time indicator */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <Link href="/blog" className="flex items-center text-sm font-medium text-primary hover:text-primary/80">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog
              </Link>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {Math.ceil(post.content.length / 1000)} min read
            </div>
          </div>
          
          {/* Hidden SEO text - visible to search engines */}
          <div className="hidden">
            Looking for memecoin website template, best memecoin website templates, memecoin website template free, meme coin website template github, how to make a meme coin website, memecoin designer tools, memecoin trading platform, create meme coin on base chain. BUIDL offers professional memecoin website builder and templates.
          </div>
          
          {/* Article content */}
          <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-primary prose-a:text-primary prose-img:rounded-xl prose-img:shadow-md">
            {/* Title above the post image */}
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-black">
              {post.title}
            </h1>
            
            {/* Featured image within content */}
            {post.image && (
              <div className="my-6 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            {renderContent(post.content)}
          </div>
          
          {/* Article footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold mb-2">Share this article</h3>
              <div className="flex space-x-4 mb-6">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://buidl.co.in/blog/${post.slug}`)}`} target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://buidl.co.in/blog/${post.slug}`)}`} target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://buidl.co.in/blog/${post.slug}`)}`} target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
      
      {/* Related posts section */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-8 mt-12 max-w-7xl">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Get related posts based on topic similarity */}
            {(() => {
              // Check if current post is Telegram-related
              const isTelegramPost = post.slug.includes('telegram') || post.title.toLowerCase().includes('telegram');
              
              // Filter posts that aren't the current one
              const otherPosts = blogPosts.filter(relatedPost => relatedPost.slug !== post.slug);
              
              // Prepare the related posts array
              let relatedPosts: typeof blogPosts = [];
              
              if (isTelegramPost) {
                // Get Telegram-related posts first
                const telegramPosts = otherPosts.filter(p => 
                  p.slug.includes('telegram') || 
                  p.title.toLowerCase().includes('telegram') ||
                  p.excerpt.toLowerCase().includes('telegram')
                );
                
                // Get non-Telegram posts
                const nonTelegramPosts = otherPosts.filter(p => 
                  !p.slug.includes('telegram') && 
                  !p.title.toLowerCase().includes('telegram') &&
                  !p.excerpt.toLowerCase().includes('telegram')
                );
                
                // Combine them, prioritizing Telegram posts
                relatedPosts = [...telegramPosts, ...nonTelegramPosts].slice(0, 3);
              } else {
                // For non-Telegram posts, just take the first 3
                relatedPosts = otherPosts.slice(0, 3);
              }
              
              return relatedPosts;
            })().map(relatedPost => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group flex bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30"
              >
                {relatedPost.image && (
                  <div className="relative w-1/3 overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow w-2/3">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Partners section */}
      <div className="pt-12 space-y-5">
        <Partners />
      </div>

    
    </div>
  );
}
