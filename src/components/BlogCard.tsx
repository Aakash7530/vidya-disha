import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { Blog } from "@/data/blogs";

interface BlogCardProps {
  blog: Blog;
  index?: number;
  featured?: boolean;
}

const BlogCard = ({ blog, index = 0, featured = false }: BlogCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`group glass-card rounded-2xl overflow-hidden hover-lift ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""
      }`}
    >
      <Link to={`/blog/${blog.slug}`} className="block overflow-hidden">
        <img
          src={blog.featuredImage}
          alt={blog.title}
          loading="lazy"
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            featured ? "h-48 md:h-full" : "h-48"
          }`}
        />
      </Link>
      <div className="p-4 md:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
              {blog.category}
            </span>
          </div>
          <Link to={`/blog/${blog.slug}`}>
            <h3 className={`font-serif font-bold leading-snug mb-2 group-hover:text-primary transition-colors ${
              featured ? "text-xl md:text-2xl" : "text-base md:text-lg"
            }`}>
              {blog.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{blog.excerpt}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(blog.publishDate).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readTime}
            </span>
          </div>
          <Link
            to={`/blog/${blog.slug}`}
            className="text-primary text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Read <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
