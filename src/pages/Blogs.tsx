import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

const Blogs = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: blogData }, { data: catData }] = await Promise.all([
        supabase.from("blogs").select("*").eq("published", true).order("created_at", { ascending: false }),
        supabase.from("categories").select("name").order("name"),
      ]);
      setBlogs(blogData || []);
      setCategories((catData || []).map((c) => c.name));
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === "All" || blog.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [search, activeCategory, blogs]);

  const blogCardData = (blog: Blog) => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    author: blog.author,
    publishDate: blog.created_at,
    category: blog.category,
    tags: blog.tags || [],
    featuredImage: blog.featured_image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    readTime: blog.read_time || "5 min read",
  });

  return (
    <>
      <Helmet>
        <title>All Blogs & Articles | Vidya Disha</title>
        <meta name="description" content="Browse all blogs on technology, education, programming, career guidance, AI and motivation on Vidya Disha." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : ""} />
        <meta property="og:title" content="All Blogs & Articles | Vidya Disha" />
        <meta property="og:description" content="Browse all blogs on technology, education, programming, career guidance, AI and motivation on Vidya Disha." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
      </Helmet>

      <Layout>
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3">All Blogs</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Explore our collection of insightful articles across various topics.
              </p>
            </motion.div>

            {/* Search & Filter */}
            <div className="max-w-2xl mx-auto mb-10 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["All", ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blogCardData(blog)} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No blogs found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Blogs;
