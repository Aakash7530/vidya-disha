import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Briefcase, Search, MapPin, X } from "lucide-react";
import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { INDIAN_STATES, JOBS_CATEGORIES } from "@/lib/states";
import type { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"] & { state?: string | null };

const Jobs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeState, setActiveState] = useState("All India");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setBlogs((data as Blog[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchState =
        activeState === "All India" || b.state === activeState || b.state === "All India";
      const matchCat = activeCategories.length === 0 || activeCategories.includes(b.category);
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q);
      return matchState && matchCat && matchSearch;
    });
  }, [blogs, activeState, activeCategories, search]);

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const hasFilters =
    activeState !== "All India" || activeCategories.length > 0 || search.trim() !== "";

  const stateOptions = useMemo(
    () => Array.from(new Set([...INDIAN_STATES, ...blogs.map((blog) => blog.state).filter(Boolean)])) as string[],
    [blogs]
  );

  const categoryOptions = useMemo(
    () => Array.from(new Set([...JOBS_CATEGORIES, ...blogs.map((blog) => blog.category).filter(Boolean)])),
    [blogs]
  );

  const clearFilters = () => {
    setActiveState("All India");
    setActiveCategories([]);
    setSearch("");
  };

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
    featuredImage:
      b.featured_image ||
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    readTime: b.read_time || "5 min read",
  });

  return (
    <>
      <Helmet>
        <title>Jobs & Exams – State-wise Govt Jobs | Vidya Disha</title>
        <meta
          name="description"
          content="Latest Government Jobs, Sarkari Naukri, Competitive Exams, Admit Cards, Results and Syllabus updates for all Indian states. Updated daily on Vidya Disha."
        />
        <meta
          name="keywords"
          content="government jobs, sarkari naukri, state jobs, UPSC, SSC, banking exams, railway jobs, admit card, result"
        />
      </Helmet>

      <Layout>
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                <Briefcase className="w-4 h-4" /> Jobs & Exams Hub
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3">
                Government Jobs & Exam Updates
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                State-wise Sarkari Naukri, competitive exams, admit cards, results &
                syllabus — all in one place.
              </p>
            </motion.div>

            {/* Search */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search jobs, exams, results..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
              {/* States sidebar */}
              <aside className="glass-card rounded-2xl p-4 h-fit lg:sticky lg:top-24">
                <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <MapPin className="w-4 h-4" /> Select State
                </h3>
                <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1 max-h-[60vh] lg:overflow-y-auto">
                  {stateOptions.map((state) => (
                    <button
                      key={state}
                      onClick={() => setActiveState(state)}
                      className={`whitespace-nowrap lg:whitespace-normal text-left px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                        activeState === state
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </aside>

              <div>
                {/* Filter bar */}
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                  <div className="text-xs text-muted-foreground">
                    {activeCategories.length === 0
                      ? "Showing all categories"
                      : `${activeCategories.length} categor${activeCategories.length === 1 ? "y" : "ies"} selected`}
                    {" · "}
                    {filtered.length} result{filtered.length === 1 ? "" : "s"}
                  </div>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Clear filters
                    </button>
                  )}
                </div>

                {/* Category chips (multi-select) */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categoryOptions.map((cat) => {
                    const selected = activeCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        aria-pressed={selected}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                          selected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                        }`}
                      >
                        {cat}
                        {selected && <X className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>

                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  </div>
                ) : filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((b, i) => (
                      <BlogCard key={b.id} blog={blogCardData(b)} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl text-center py-16">
                    <p className="text-muted-foreground">
                      No posts found for {activeState}
                      {activeCategories.length > 0 ? ` in ${activeCategories.join(", ")}` : ""}.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" /> Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Jobs;
