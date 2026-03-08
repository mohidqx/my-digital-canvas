import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, X, Minimize2, Maximize2, Terminal, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GhostAuth } from "./GhostAuth";
import { GhostRoomList } from "./GhostRoomList";
import { GhostChatWindow } from "./GhostChatWindow";
import type { GhostRoom } from "@/hooks/useGhostChat";
import type { User } from "@supabase/supabase-js";

export function GhostChatPortal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<GhostRoom | null>(null);
  const [myCodename, setMyCodename] = useState("GHOST");
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Pulse animation every 8s when closed
  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => setPulseCount((c) => c + 1), 8000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleAuthenticated = (userId: string) => {
    setUser({ id: userId } as User);
  };

  const handleSelectRoom = async (room: GhostRoom) => {
    setSelectedRoom(room);
    if (user) {
      const { data } = await supabase
        .from("ghost_members")
        .select("codename")
        .eq("room_id", room.id)
        .eq("user_id", user.id)
        .single();
      if (data) setMyCodename(data.codename);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSelectedRoom(null);
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl group"
            style={{
              background: "linear-gradient(135deg, hsl(261 87% 50%), hsl(261 87% 35%))",
              boxShadow: "0 0 30px hsl(261 87% 50% / 0.4), 0 10px 40px rgba(0,0,0,0.5)",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Ghost Chat — TeamCyberØps"
          >
            <Ghost className="w-6 h-6 text-white" />
            {/* Pulse ring */}
            <motion.div
              key={pulseCount}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 rounded-2xl"
              style={{ background: "hsl(261 87% 50% / 0.4)" }}
            />
            {/* Online dot */}
            {user && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed z-50 flex flex-col overflow-hidden
              ${isMaximized
                ? "inset-4 rounded-2xl"
                : "bottom-8 right-8 w-[820px] h-[580px] rounded-2xl"
              }`}
            style={{
              background: "hsl(0 0% 4%)",
              border: "1px solid hsl(261 87% 50% / 0.2)",
              boxShadow: "0 0 60px hsl(261 87% 50% / 0.15), 0 30px 80px rgba(0,0,0,0.8)",
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0 border-b border-border/30"
              style={{ background: "hsl(0 0% 5%)" }}
            >
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-3.5 h-3.5 rounded-full bg-destructive/70 hover:bg-destructive transition-colors flex items-center justify-center group"
                >
                  <X className="w-2 h-2 text-destructive-foreground opacity-0 group-hover:opacity-100" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-3.5 h-3.5 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors"
                />
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="w-3.5 h-3.5 rounded-full bg-secondary/70 hover:bg-secondary transition-colors"
                />
              </div>

              {/* Title */}
              <div className="flex items-center gap-2 flex-1 justify-center">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-sm font-black font-mono tracking-widest gradient-text">GHOST PROTOCOL</span>
                <Shield className="w-3.5 h-3.5 text-secondary" />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Body */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center font-mono">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground">INITIALIZING SECURE TUNNEL...</p>
                </div>
              </div>
            ) : !user ? (
              <div className="flex-1 overflow-hidden">
                <GhostAuth onAuthenticated={handleAuthenticated} />
              </div>
            ) : (
              <div className="flex flex-1 min-h-0">
                {/* Sidebar */}
                <div
                  className="w-56 flex-shrink-0 border-r border-border/30 flex flex-col"
                  style={{ background: "hsl(0 0% 5%)" }}
                >
                  <GhostRoomList
                    userId={user.id}
                    selectedRoomId={selectedRoom?.id || null}
                    onSelectRoom={handleSelectRoom}
                    onSignOut={handleSignOut}
                    myCodename={myCodename}
                  />
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col min-w-0 relative">
                  {selectedRoom ? (
                    <GhostChatWindow
                      roomId={selectedRoom.id}
                      roomName={selectedRoom.name}
                      userId={user.id}
                    />
                  ) : (
                    <div className="flex-1 flex items-center justify-center font-mono">
                      <div className="text-center px-8">
                        <Ghost className="w-16 h-16 text-primary/20 mx-auto mb-4" />
                        <h3 className="gradient-text font-black text-xl mb-2 tracking-widest">NO CHANNEL SELECTED</h3>
                        <p className="text-sm text-muted-foreground mb-1">Create or join a channel to begin</p>
                        <p className="text-xs text-muted-foreground">All communications are encrypted</p>
                        <div className="mt-6 flex flex-col gap-2 text-xs text-muted-foreground">
                          {[
                            "↳ Real-time encrypted messaging",
                            "↳ File & image sharing",
                            "↳ Self-destruct timers",
                            "↳ Typing indicators",
                            "↳ Emoji reactions",
                            "↳ Reply threads",
                            "↳ Ghost presence",
                          ].map((f) => (
                            <div key={f} className="flex items-center gap-2 justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status bar */}
            <div
              className="px-4 py-1.5 flex items-center gap-4 text-xs font-mono text-muted-foreground border-t border-border/20 flex-shrink-0"
              style={{ background: "hsl(0 0% 3.5%)" }}
            >
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                SECURE
              </span>
              <span>TeamCyberØps Ghost Net v2.1</span>
              <span className="ml-auto">
                {user ? `● ${user.email?.split("@")[0].toUpperCase()}` : "○ OFFLINE"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
