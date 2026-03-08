import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Terminal, Shield, AlertTriangle, Loader2 } from "lucide-react";

interface GhostAuthProps {
  onAuthenticated: (userId: string) => void;
}

export function GhostAuth({ onAuthenticated }: GhostAuthProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  const BOOT_TEXT = "GHOST PROTOCOL v2.1 — SECURE CHANNEL READY";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message);
      } else if (data.user) {
        if (data.user.email_confirmed_at) {
          onAuthenticated(data.user.id);
        } else {
          setSuccess("ACCOUNT CREATED. Check email to confirm, then log in.");
          setMode("login");
        }
      }
    } else {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError("ACCESS DENIED: " + err.message);
      } else if (data.user) {
        onAuthenticated(data.user.id);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 font-mono">
      {/* Boot animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-secondary mb-6 font-mono tracking-widest text-center"
      >
        {BOOT_TEXT}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="glass rounded-2xl p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(261 87% 50% / 0.3), hsl(162 72% 46% / 0.2))" }}>
              <Shield className="w-7 h-7 text-primary" />
            </div>
          </div>

          <h3 className="text-center font-black tracking-widest mb-1 gradient-text text-lg">
            {mode === "login" ? "AUTHENTICATE" : "ENLIST"}
          </h3>
          <p className="text-center text-xs text-muted-foreground mb-6">
            {mode === "login" ? "PROVIDE CREDENTIALS TO ACCESS GHOST NETWORK" : "CREATE SECURE IDENTITY"}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4"
              >
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-xs text-secondary bg-secondary/10 border border-secondary/20 rounded-lg px-3 py-2 mb-4"
              >
                <Terminal className="w-3 h-3 flex-shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block tracking-widest">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@cyber.ops"
                required
                className="w-full bg-white/5 border border-border/30 rounded-xl px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block tracking-widest">PASSPHRASE</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-border/30 rounded-xl px-4 py-2.5 pr-10 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glow py-2.5 rounded-xl font-black tracking-widest text-white text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> AUTHENTICATING...</>
              ) : (
                <>{mode === "login" ? "AUTHENTICATE" : "CREATE IDENTITY"}</>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-widest"
            >
              {mode === "login" ? "NO IDENTITY? ENLIST NOW →" : "HAVE CREDENTIALS? AUTHENTICATE →"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
