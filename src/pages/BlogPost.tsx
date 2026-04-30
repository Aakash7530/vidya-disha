import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, User, Share2 } from "lucide-react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import ReadingProgress from "@/components/ReadingProgress";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setBlog(data);
      if (data) {
        const { data: related } = await supabase
          .from("blogs")
          .select("*")
          .eq("published", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);
        setRelatedBlogs(related || []);
      }
      setLoading(false);
    };
    fetchBlog();
  }, [slug]);

  const blogCardData = (b: Blog) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    content: b.content,
    author: b.author,
    publishDate: b.created_at,
    category: b.category,
    tags: b.tags || [],
    featuredImage: b.featured_image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    readTime: b.read_time || "5 min read",
  });

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold font-serif mb-4">Blog not found</h1>
          <Link to="/blogs" className="text-primary hover:underline">← Back to blogs</Link>
        </div>
      </Layout>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <ReadingProgress />
      <Helmet>
        <title>{blog.title.slice(0, 58)} | Vidya Disha</title>
        <meta name="description" content={blog.excerpt.slice(0, 158)} />
        <meta name="keywords" content={(blog.tags || []).concat([blog.category, "Vidya Disha"]).join(", ")} />
        <meta name="author" content={blog.author} />
        <link rel="canonical" href={shareUrl} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.featured_image || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="article:published_time" content={blog.created_at} />
        <meta property="article:modified_time" content={blog.updated_at} />
        <meta property="article:author" content={blog.author} />
        <meta property="article:section" content={blog.category} />
        {(blog.tags || []).map((t) => <meta key={t} property="article:tag" content={t} />)}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={blog.featured_image || ""} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: blog.title,
          description: blog.excerpt,
          image: blog.featured_image ? [blog.featured_image] : undefined,
          datePublished: blog.created_at,
          dateModified: blog.updated_at,
          author: { "@type": "Person", name: blog.author },
          publisher: { "@type": "Organization", name: "Vidya Disha", logo: { "@type": "ImageObject", url: typeof window !== "undefined" ? window.location.origin + "/placeholder.svg" : "" } },
          mainEntityOfPage: { "@type": "WebPage", "@id": shareUrl },
          keywords: (blog.tags || []).join(", "),
          articleSection: blog.category,
        })}</script>
      </Helmet>

      <Layout>
        <article className="py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link to="/blogs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to blogs
              </Link>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {blog.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-6">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {blog.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(blog.created_at).toLocaleDateString("en-IN", {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {blog.read_time}
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {blog.featured_image && (
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8"
                />
              )}

              <div className="prose prose-lg max-w-none mb-8">
                {blog.content.split("\n\n").map((paragraph, i) => {
                  if (paragraph.startsWith("## ")) {
                    return (
                      <h2 key={i} className="text-xl md:text-2xl font-bold font-serif mt-8 mb-4">
                        {paragraph.replace("## ", "")}
                      </h2>
                    );
                  }
                  return (
                    <p key={i} className="text-foreground/80 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="glass-card rounded-xl p-4 flex items-center justify-between mb-12">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Share this article
                </span>
                <div className="flex gap-2">
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-medium transition-colors">
                    Twitter
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-medium transition-colors">
                    LinkedIn
                  </a>
                  <a href={`https://wa.me/?text=${encodeURIComponent(blog.title + " " + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-medium transition-colors">
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {relatedBlogs.length > 0 && (
            <div className="container mx-auto px-4 py-12 border-t border-border/50">
              <h2 className="text-2xl font-bold font-serif mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((b, i) => (
                  <BlogCard key={b.id} blog={blogCardData(b)} index={i} />
                ))}
              </div>
            </div>
          )}
        </article>
      </Layout>
    </>
  );
};

export default BlogPost;
