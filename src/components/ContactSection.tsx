import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Github, Linkedin, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { contactSchema, type ContactFormData } from "@/lib/schemas";
import { mockProfile } from "@/lib/mockData";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    // Simulate send (replace with real handler)
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 40% at 20% 60%, hsl(261 87% 50% / 0.05), transparent)" }}
      />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-secondary font-mono text-sm mb-3 tracking-widest uppercase">
            // Let's Connect
          </p>
          <h2 className="section-title text-5xl">Contact</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Got a project in mind, a role to fill, or just want to say hi? My inbox is always open.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Info panel */}
          <GlassCard className="md:col-span-2 p-6 flex flex-col gap-6" glow="secondary">
            <div>
              <h3 className="font-bold text-lg mb-4">Get in touch</h3>
              <div className="space-y-4">
                <a href={`mailto:${mockProfile.email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                  <div className="w-9 h-9 glass rounded-xl flex items-center justify-center group-hover:border-secondary/40 transition-colors">
                    <Mail className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="text-sm font-medium">{mockProfile.email}</div>
                  </div>
                </a>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-9 h-9 glass rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Location</div>
                    <div className="text-sm font-medium">{mockProfile.location}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">Also on</p>
              <div className="flex gap-3">
                <a href={mockProfile.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                  <Github className="w-4 h-4" />
                </a>
                <a href={mockProfile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="mt-auto glass p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-secondary text-sm font-medium">Available</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Open to full-time roles and select freelance projects.
              </p>
            </div>
          </GlassCard>

          {/* Contact form */}
          <GlassCard className="md:col-span-3 p-6" glow="primary">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center py-12 text-center"
              >
                <CheckCircle2 className="w-14 h-14 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">Message sent!</h3>
                <p className="text-muted-foreground">I'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      {...register("name")}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl glass text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors text-sm"
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl glass text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors text-sm"
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-3 rounded-xl glass text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors text-sm resize-none"
                  />
                  {errors.message && (
                    <p className="text-destructive text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-glow w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
