import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("contacts").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });

    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us – Vidya Disha</title>
        <meta
          name="description"
          content="Get in touch with the Vidya Disha team. We'd love to hear from you."
        />
      </Helmet>

      <Layout>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3">
                Get in Touch
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Have a question, suggestion, or just want to say hello? We'd love to hear from you.
              </p>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 space-y-6"
              >
                <div className="glass-card rounded-xl p-6 space-y-6">

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm font-sans">Email</h3>
                      <p className="text-sm text-muted-foreground">
                        vidyadisha01@gmail.com
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm font-sans">Location</h3>
                      <p className="text-sm text-muted-foreground">
                        Bettiah, Bihar
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm font-sans">Phone</h3>
                      <p className="text-sm text-muted-foreground">
                        +91 7738101117
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="md:col-span-3 glass-card rounded-xl p-6 md:p-8 space-y-5"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    maxLength={100}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    maxLength={255}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    maxLength={1000}
                    rows={5}
                    placeholder="Write your message..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="gradient-btn px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>

            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;