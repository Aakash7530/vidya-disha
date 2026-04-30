import { Link } from "react-router-dom";
import { BookOpen, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-btn flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold font-serif gradient-text">Vidya Disha</span>
                <p className="text-xs text-muted-foreground">ज्ञान की दिशा</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your destination for knowledge and learning. Explore blogs on technology, education, programming, and more.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 font-sans">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Blogs", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 font-sans">Categories</h4>
            <ul className="space-y-2">
              {["Technology", "Education", "Programming", "AI & Future Tech"].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/blogs"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Vidya Disha. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive fill-destructive" /> for learners everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
