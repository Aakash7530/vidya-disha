import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import { INDIAN_STATES, JOBS_CATEGORIES } from "@/lib/states";

type Blog = Database["public"]["Tables"]["blogs"]["Row"] & { state?: string | null };

const AdminBlogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewState, setShowNewState] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newStateName, setNewStateName] = useState("");
  const DRAFT_KEY = "vidya_admin_blog_draft_v1";
  const emptyForm = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    state: "",
    tags: "",
    featured_image: "",
    read_time: "5 min read",
    published: false,
  };
  const [form, setForm] = useState(emptyForm);

  const fetchBlogs = async () => {
    const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    setBlogs(data || []);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name, slug").order("name");
    setCategories(data || []);
  };

  useEffect(() => { fetchBlogs(); fetchCategories(); }, []);

  // Restore unsaved draft on mount (only when not editing an existing blog)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && typeof saved === "object" && (saved.title || saved.content || saved.excerpt)) {
        setForm({ ...emptyForm, ...saved, published: false });
        setShowForm(true);
        toast.message("Recovered unsaved draft", { description: "Your previous draft was restored." });
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save form to localStorage while creating a new blog (not when editing existing)
  useEffect(() => {
    if (editingBlog) return;
    if (!showForm) return;
    const hasContent = form.title || form.content || form.excerpt;
    if (!hasContent) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)); } catch { /* ignore */ }
  }, [form, editingBlog, showForm]);

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("categories").insert({ name, slug, icon: "📁" });
    if (error) { toast.error(error.message); return; }
    toast.success("Category added!");
    setNewCategoryName("");
    setShowNewCategory(false);
    await fetchCategories();
    setForm((f) => ({ ...f, category: name }));
  };

  const handleAddState = () => {
    const name = newStateName.trim();
    if (!name) return;
    setForm((f) => ({ ...f, state: name }));
    setNewStateName("");
    setShowNewState(false);
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const resetForm = () => {
    setForm(emptyForm);
    setEditingBlog(null);
    setShowForm(false);
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  };

  const handleEdit = (blog: Blog) => {
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      state: (blog as any).state || "",
      tags: (blog.tags || []).join(", "),
      featured_image: blog.featured_image || "",
      read_time: blog.read_time || "5 min read",
      published: blog.published || false,
    });
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || generateSlug(form.title);
    const payload: any = {
      title: form.title,
      slug,
      excerpt: form.excerpt,
      content: form.content,
      author: form.author,
      category: form.category,
      state: form.state || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      featured_image: form.featured_image || null,
      read_time: form.read_time,
      published: form.published,
      created_by: user?.id,
    };

    if (editingBlog) {
      const { error } = await supabase.from("blogs").update(payload).eq("id", editingBlog.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Blog updated!");
    } else {
      const { error } = await supabase.from("blogs").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Blog created!");
    }
    resetForm();
    fetchBlogs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Blog deleted!");
    fetchBlogs();
  };

  const togglePublish = async (blog: Blog) => {
    await supabase.from("blogs").update({ published: !blog.published }).eq("id", blog.id);
    fetchBlogs();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user?.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("blog-images").upload(path, file, { cacheControl: "3600", upsert: false });
    if (upErr) { toast.error(upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    setForm((f) => ({ ...f, featured_image: data.publicUrl }));
    setUploading(false);
    toast.success("Image uploaded!");
    e.target.value = "";
  };

  const categoryOptions = Array.from(
    new Set([...JOBS_CATEGORIES, ...categories.map((category) => category.name), form.category].filter(Boolean))
  );

  const stateOptions = Array.from(new Set([...INDIAN_STATES, form.state].filter(Boolean)));

  return (
    <>
      <Helmet><title>Manage Blogs – Admin</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-serif">Manage Blogs</h1>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="gradient-btn px-4 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Blog
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 mb-8 space-y-4">
            <h2 className="text-lg font-bold font-serif">{editingBlog ? "Edit Blog" : "Create Blog"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title*</label>
                <input
                  type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Blog title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text" value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="auto-generated-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author*</label>
                <input
                  type="text" required value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category*</label>
                <div className="flex gap-2">
                  <select
                    required value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory((v) => !v)}
                    className="px-3 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-sm font-medium"
                    title="Add new category"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {showNewCategory && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text" value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCategory(); } }}
                      placeholder="New category name"
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                    />
                    <button type="button" onClick={handleAddCategory} className="px-3 py-2 rounded-lg gradient-btn text-sm">Add</button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text" value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="react, javascript, web"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State (for Jobs & Exams)</label>
                <div className="flex gap-2">
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">— None —</option>
                    {stateOptions.map((state) => <option key={state} value={state}>{state}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewState((v) => !v)}
                    className="px-3 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-sm font-medium"
                    title="Add custom state or region"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {showNewState && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text" value={newStateName}
                      onChange={(e) => setNewStateName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddState(); } }}
                      placeholder="Custom state, UT, or region"
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                    />
                    <button type="button" onClick={handleAddState} className="px-3 py-2 rounded-lg gradient-btn text-sm">Add</button>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Featured Image</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url" value={form.featured_image}
                    onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Paste URL or upload below"
                  />
                  <label className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 cursor-pointer text-sm font-medium transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
                {form.featured_image && (
                  <div className="relative mt-3 inline-block">
                    <img src={form.featured_image} alt="Preview" className="h-32 rounded-lg border border-border object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, featured_image: "" })}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground shadow"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Read Time</label>
                <input
                  type="text" value={form.read_time}
                  onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="5 min read"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox" checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm font-medium">Published</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt*</label>
              <textarea
                required value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder="Short description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content* (Markdown supported)</label>
              <textarea
                required value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none font-mono text-sm"
                placeholder="Write your blog content here..."
              />
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <button type="submit" className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-medium">
                {editingBlog ? "Update Blog" : form.published ? "Publish Blog" : "Create Blog"}
              </button>
              {!editingBlog && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, published: false }))}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-secondary transition-colors"
                  title="Mark as draft (won't be visible publicly)"
                >
                  Mark as Draft
                </button>
              )}
              <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-secondary transition-colors">
                Cancel
              </button>
              {!editingBlog && (form.title || form.content) && (
                <span className="text-xs text-muted-foreground ml-auto">
                  Auto-saved locally · won't be lost on refresh
                </span>
              )}
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No blogs yet. Create your first blog!</div>
        ) : (
          <div className="space-y-3">
            {blogs.map((blog) => (
              <div key={blog.id} className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm break-words sm:truncate">{blog.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mt-1">
                    <span>{blog.category}</span>
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${blog.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => togglePublish(blog)} className="p-2 rounded-lg hover:bg-secondary transition-colors" title={blog.published ? "Unpublish" : "Publish"}>
                    {blog.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleEdit(blog)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBlogs;
