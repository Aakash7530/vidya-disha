import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Sparkles, TrendingUp, BookOpen, Layers } from "lucide-react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

const categoryList = [
  { name: "Technology", slug: "technology", icon: "💻" },
  { name: "Education", slug: "education", icon: "📚" },
  { name: "Career Guidance", slug: "career-guidance", icon: "🎯" },
  { name: "Programming", slug: "programming", icon: "⚡" },
  { name: "AI & Future Tech", slug: "ai-future-tech", icon: "🤖" },
  { name: "Motivation", slug: "motivation", icon: "🔥" },
];

const Index = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);
      setBlogs(data || []);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

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

  const featuredBlog = blogs[0];
  const latestBlogs = blogs.slice(1, 4);

  return (
    <>
      <Helmet>
        <title>Vidya Disha – ज्ञान की दिशा | Knowledge Blog Platform</title>
        <meta name="description" content="Vidya Disha is your destination for knowledge. Explore blogs on technology, education, career guidance, programming, AI, and motivation." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : ""} />
        <meta property="og:title" content="Vidya Disha – ज्ञान की दिशा | Knowledge Blog Platform" />
        <meta property="og:description" content="Explore blogs on technology, education, career guidance, programming, AI, and motivation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vidya Disha – ज्ञान की दिशा" />
        <meta name="twitter:description" content="Explore blogs on technology, education, career guidance, programming, AI, and motivation." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Vidya Disha",
          url: typeof window !== "undefined" ? window.location.origin : "",
          potentialAction: {
            "@type": "SearchAction",
            target: typeof window !== "undefined" ? window.location.origin + "/blogs?search={search_term_string}" : "",
            "query-input": "required name=search_term_string"
          }
        })}</script>
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

          <div className="container mx-auto px-4 py-20 md:py-32 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Welcome to Vidya Disha
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-4 leading-tight">
                <span className="gradient-text">ज्ञान की दिशा</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Your destination for knowledge and learning. Explore insightful blogs on technology, education, career guidance, and more.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/blogs" className="gradient-btn px-8 py-3 rounded-xl text-base font-medium inline-flex items-center gap-2">
                  Start Reading <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/blogs" className="px-8 py-3 rounded-xl text-base font-medium border border-border hover:bg-secondary transition-colors inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Explore Categories
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Layers className="w-4 h-4" />
                Browse by Topic
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif mb-2">Explore Categories</h2>
              <p className="text-muted-foreground">Find blogs that match your interests</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categoryList.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to="/blogs"
                    className="glass-card rounded-2xl p-6 text-center hover-lift block group"
                  >
                    <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <h3 className="text-sm font-semibold font-sans">{cat.name}</h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Blog */}
        {!loading && featuredBlog && (
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif mb-1 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" /> Featured
                  </h2>
                  <p className="text-muted-foreground text-sm">Our top pick for you</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BlogCard blog={blogCardData(featuredBlog)} featured />
              </div>
            </div>
          </section>
        )}

        {/* Latest Blogs */}
        {!loading && latestBlogs.length > 0 && (
          <section className="py-16 md:py-20 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif mb-1 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" /> Latest Blogs
                  </h2>
                  <p className="text-muted-foreground text-sm">Fresh content, just for you</p>
                </div>
                <Link to="/blogs" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestBlogs.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blogCardData(blog)} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
              <div className="relative">
                <h2 className="text-2xl md:text-4xl font-bold font-serif mb-4">
                  Ready to Explore Knowledge?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  Join thousands of readers on their journey of learning and discovery with Vidya Disha.
                </p>
                <Link to="/blogs" className="gradient-btn px-8 py-3 rounded-xl text-base font-medium inline-flex items-center gap-2">
                  Browse All Blogs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Index;
