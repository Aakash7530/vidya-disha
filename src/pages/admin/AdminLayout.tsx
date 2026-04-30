import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, MessageSquare, LogOut, BookOpen, Home, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Blogs", path: "/admin/blogs", icon: FileText },
  { name: "Contacts", path: "/admin/contacts", icon: MessageSquare },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-border">
        <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-btn flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold font-serif gradient-text">Admin Panel</span>
            <p className="text-[10px] text-muted-foreground">Vidya Disha</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Home className="w-4 h-4" />
          View Website
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col md:hidden animate-in slide-in-from-left">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b border-border bg-card/95 backdrop-blur">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif font-bold gradient-text">Admin Panel</span>
          <Link to="/" className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Home className="w-5 h-5" />
          </Link>
        </div>
        <div className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
