import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FileText, MessageSquare, Users, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [stats, setStats] = useState({ blogs: 0, contacts: 0, pendingContacts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [blogsRes, contactsRes, pendingRes] = await Promise.all([
        supabase.from("blogs").select("id", { count: "exact", head: true }),
        supabase.from("contacts").select("id", { count: "exact", head: true }),
        supabase.from("contacts").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({
        blogs: blogsRes.count || 0,
        contacts: contactsRes.count || 0,
        pendingContacts: pendingRes.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Blogs", value: stats.blogs, icon: FileText, color: "text-primary" },
    { label: "Total Messages", value: stats.contacts, icon: MessageSquare, color: "text-accent" },
    { label: "Pending Messages", value: stats.pendingContacts, icon: Eye, color: "text-destructive" },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard – Vidya Disha</title></Helmet>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground font-medium">{card.label}</span>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
