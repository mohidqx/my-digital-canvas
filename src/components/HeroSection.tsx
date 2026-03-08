import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Download, ArrowDown, Sparkles } from "lucide-react";
import { mockProfile, mockStats } from "@/lib/mockData";

export function HeroSection() {
  const statIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    Layers: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l6-3 6 3M6 12l6-3 6 3M6 18l6-3 6 3" />
      </svg>
    ),
    Star: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    Calendar: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    GitMerge: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5v-3m0 3a3 3 0 100 6m0-6a3 3 0 110 6m0 0v3m9-9v3m0 0a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Radial glow background */}
      <div className="absolute inset-0 bg-hero-glow" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100% / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(261 87% 50% / 0.2), transparent)" }}
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(162 72% 46% / 0.2), transparent)" }}
      />

      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm"
        >
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="text-muted-foreground">
            Available for new opportunities •{" "}
          </span>
          <span className="text-secondary font-medium">{mockProfile.location}</span>
        </motion.div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 rounded-full glass flex items-center justify-center text-4xl font-bold relative overflow-hidden animate-pulse-glow">
            <div
              className="absolute inset-0 opacity-20"
              style={{ background: "var(--gradient-primary)" }}
            />
            <span className="relative z-10 gradient-text">
              {mockProfile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-full border border-primary/20 border-dashed"
          />
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-secondary shadow-teal-sm" />
        </motion.div>

        {/* Name & tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-black mb-4 tracking-tight"
        >
          <span className="gradient-text">{mockProfile.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-xl md:text-2xl text-muted-foreground mb-4 font-light"
        >
          {mockProfile.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-2xl text-muted-foreground leading-relaxed mb-10"
        >
          {mockProfile.bio}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <a href="#projects" className="btn-glow px-8 py-3 rounded-xl font-semibold text-white flex items-center gap-2">
            View Projects
            <ArrowDown className="w-4 h-4" />
          </a>
          <a
            href={mockProfile.resumeUrl}
            className="glass px-8 py-3 rounded-xl font-semibold text-foreground flex items-center gap-2 hover:border-primary/30 transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Download CV
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 mb-16"
        >
          {[
            { icon: Github, href: mockProfile.githubUrl, label: "GitHub" },
            { icon: Linkedin, href: mockProfile.linkedinUrl, label: "LinkedIn" },
            { icon: Twitter, href: mockProfile.twitterUrl, label: "Twitter" },
            { icon: Mail, href: `mailto:${mockProfile.email}`, label: "Email" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-11 h-11 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl"
        >
          {mockStats.map((stat, i) => {
            const Icon = statIcons[stat.icon];
            return (
              <div key={stat.label} className="glass p-4 rounded-2xl text-center">
                {Icon && <Icon className="w-5 h-5 text-secondary mx-auto mb-2" />}
                <div className="text-2xl font-black gradient-text">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  );
}
