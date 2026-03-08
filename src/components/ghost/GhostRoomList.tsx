import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LogIn, Copy, Check, Hash, Users, Trash2, LogOut, Terminal, ChevronRight } from "lucide-react";
import { useGhostRooms, type GhostRoom } from "@/hooks/useGhostChat";

interface GhostRoomListProps {
  userId: string;
  selectedRoomId: string | null;
  onSelectRoom: (room: GhostRoom) => void;
  onSignOut: () => void;
  myCodename: string;
}

const HACKER_CODENAMES = [
  "SHADOW", "CIPHER", "PHANTOM", "RECON", "ZERO_DAY", "EXPLOIT", "VIPER",
  "GHOST", "ORACLE", "WRAITH", "SPECTER", "NEXUS", "VOID", "APEX", "VECTOR"
];

export function GhostRoomList({ userId, selectedRoomId, onSelectRoom, onSignOut, myCodename }: GhostRoomListProps) {
  const { rooms, myMemberships, createRoom, joinRoom } = useGhostRooms(userId);
  const [mode, setMode] = useState<null | "create" | "join">(null);
  const [roomName, setRoomName] = useState("");
  const [roomDesc, setRoomDesc] = useState("");
  const [codename, setCodename] = useState(HACKER_CODENAMES[Math.floor(Math.random() * HACKER_CODENAMES.length)]);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !codename.trim()) return;
    setLoading(true);
    setError("");
    const room = await createRoom(roomName.trim(), roomDesc.trim(), codename.trim());
    if (room) {
      onSelectRoom(room);
      setMode(null);
      setRoomName("");
      setRoomDesc("");
    } else {
      setError("FAILED TO CREATE CHANNEL");
    }
    setLoading(false);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || !codename.trim()) return;
    setLoading(true);
    setError("");
    const room = await joinRoom(inviteCode.trim(), codename.trim());
    if (room) {
      onSelectRoom(room);
      setMode(null);
      setInviteCode("");
    } else {
      setError("INVALID CODE OR CHANNEL OFFLINE");
    }
    setLoading(false);
  };

  const copyInvite = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex flex-col h-full font-mono">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-black tracking-widest gradient-text text-sm">GHOST NET</span>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="text-secondary">{myCodename}</span> · {rooms.length} CHANNELS
        </div>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto py-2">
        {rooms.length === 0 && !mode && (
          <div className="text-center py-8 px-4">
            <div className="text-3xl mb-3">👻</div>
            <p className="text-xs text-muted-foreground">NO ACTIVE CHANNELS</p>
            <p className="text-xs text-muted-foreground mt-1">CREATE OR JOIN ONE BELOW</p>
          </div>
        )}
        {rooms.map((room) => {
          const membership = myMemberships[room.id];
          return (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all group hover:bg-white/5 ${
                selectedRoomId === room.id ? "bg-primary/10 border-r-2 border-primary" : ""
              }`}
            >
              <Hash className={`w-4 h-4 flex-shrink-0 ${selectedRoomId === room.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm truncate ${selectedRoomId === room.id ? "text-primary font-bold" : "text-foreground"}`}>
                  {room.name}
                </div>
                {membership && (
                  <div className="text-xs text-muted-foreground truncate" style={{ color: myMemberships[room.id]?.avatar_color + "99" }}>
                    {membership.codename} · {membership.role}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); copyInvite(room.invite_code); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                  title="Copy invite code"
                >
                  {copiedCode === room.invite_code ? (
                    <Check className="w-3 h-3 text-secondary" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                {selectedRoomId === room.id && <ChevronRight className="w-3 h-3 text-primary" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="p-3 border-t border-border/30 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => setMode(mode === "create" ? null : "create")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${
              mode === "create"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 border border-border/30"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            NEW
          </button>
          <button
            onClick={() => setMode(mode === "join" ? null : "join")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${
              mode === "join"
                ? "bg-secondary/20 text-secondary border border-secondary/30"
                : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 border border-border/30"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            JOIN
          </button>
        </div>

        {/* Create / Join form */}
        <AnimatePresence>
          {mode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={mode === "create" ? handleCreate : handleJoin} className="space-y-2 pt-1">
                {error && (
                  <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}
                {mode === "create" && (
                  <>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="CHANNEL NAME"
                      required
                      maxLength={30}
                      className="w-full bg-white/5 border border-border/30 rounded-xl px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                    />
                    <input
                      type="text"
                      value={roomDesc}
                      onChange={(e) => setRoomDesc(e.target.value)}
                      placeholder="MISSION BRIEF (optional)"
                      maxLength={80}
                      className="w-full bg-white/5 border border-border/30 rounded-xl px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                    />
                  </>
                )}
                {mode === "join" && (
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="INVITE CODE"
                    required
                    className="w-full bg-white/5 border border-border/30 rounded-xl px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                  />
                )}
                <input
                  type="text"
                  value={codename}
                  onChange={(e) => setCodename(e.target.value.toUpperCase())}
                  placeholder="YOUR CODENAME"
                  required
                  maxLength={16}
                  className="w-full bg-white/5 border border-border/30 rounded-xl px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary/40"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-xl text-xs font-black tracking-wider text-white transition-all disabled:opacity-50 ${
                    mode === "create" ? "btn-glow" : "btn-teal"
                  }`}
                >
                  {loading ? "PROCESSING..." : mode === "create" ? "ESTABLISH CHANNEL" : "INFILTRATE"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-border/20 hover:border-destructive/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          DISCONNECT
        </button>
      </div>
    </div>
  );
}
