import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { MessageSquare, CheckCircle, Clock, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];

const AdminContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const fetchContacts = async () => {
    const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const [sending, setSending] = useState(false);

  const handleReply = async (contactId: string) => {
    if (!reply.trim()) return;
    setSending(true);
    const { data, error } = await supabase.functions.invoke("send-contact-reply", {
      body: { contactId, reply },
    });
    setSending(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || "Failed to send reply");
      return;
    }
    toast.success("Reply sent to user's email!");
    setReply("");
    setReplyingTo(null);
    fetchContacts();
  };

  const markResolved = async (id: string) => {
    await supabase.from("contacts").update({ status: "resolved" }).eq("id", id);
    fetchContacts();
  };

  return (
    <>
      <Helmet><title>Contact Messages – Admin</title></Helmet>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif mb-8 flex items-center gap-3">
          <MessageSquare className="w-7 h-7 text-primary" /> Contact Messages
        </h1>

        {loading ? (
          <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No messages yet.</div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                      contact.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {contact.status === "resolved" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {contact.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 mb-3 bg-secondary/50 rounded-xl p-4">{contact.message}</p>

                {contact.admin_reply && (
                  <div className="bg-primary/5 rounded-xl p-4 mb-3">
                    <p className="text-xs font-medium text-primary mb-1">Admin Reply:</p>
                    <p className="text-sm">{contact.admin_reply}</p>
                    {contact.replied_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Replied on {new Date(contact.replied_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  {replyingTo === contact.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                      />
                      <button
                        onClick={() => handleReply(contact.id)}
                        disabled={sending}
                        className="gradient-btn px-4 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" /> {sending ? "Sending..." : "Send"}
                      </button>
                      <button
                        onClick={() => { setReplyingTo(null); setReply(""); }}
                        className="px-4 py-2 rounded-xl text-sm border border-border hover:bg-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setReplyingTo(contact.id)}
                        className="px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-secondary transition-colors inline-flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" /> Reply
                      </button>
                      {contact.status !== "resolved" && (
                        <button
                          onClick={() => markResolved(contact.id)}
                          className="px-4 py-2 rounded-xl text-sm font-medium text-green-600 border border-green-200 hover:bg-green-50 transition-colors inline-flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Mark Resolved
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminContacts;
