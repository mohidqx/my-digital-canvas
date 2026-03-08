import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Paperclip, Smile, Trash2, Reply, Copy, ShieldAlert,
  Clock, CheckCheck, Check, X, Hash, ImageIcon, FileText,
  Terminal, Wifi, WifiOff, Users, ChevronDown
} from "lucide-react";
import { useGhostChat, type GhostMessage, type GhostMember } from "@/hooks/useGhostChat";

const EMOJI_REACTIONS = ["👍", "🔥", "💀", "🕵️", "⚡", "✅", "❌", "🚨"];

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "TODAY";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "YESTERDAY";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

interface GhostMessageBubbleProps {
  msg: GhostMessage;
  isOwn: boolean;
  onDelete: (id: string) => void;
  onReact: (id: string, emoji: string) => void;
  onReply: (msg: GhostMessage) => void;
  replyTarget?: GhostMessage | null;
  userId: string;
}

function GhostMessageBubble({
  msg, isOwn, onDelete, onReact, onReply, replyTarget, userId
}: GhostMessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selfDestructRemaining, setSelfDestructRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!msg.self_destruct_at) return;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((new Date(msg.self_destruct_at!).getTime() - Date.now()) / 1000));
      setSelfDestructRemaining(remaining);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [msg.self_destruct_at]);

  if (msg.is_deleted) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-xs italic py-1 px-3">
        <Trash2 className="w-3 h-3" />
        <span>[MESSAGE DESTROYED]</span>
      </div>
    );
  }

  if (msg.message_type === "system") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 my-2"
      >
        <div className="flex-1 h-px bg-border/30" />
        <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
          <Terminal className="w-3 h-3 text-secondary" />
          {msg.content}
        </span>
        <div className="flex-1 h-px bg-border/30" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex gap-3 mb-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowEmojis(false); }}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 font-mono border border-white/10"
        style={{ backgroundColor: msg.sender_color + "33", color: msg.sender_color, borderColor: msg.sender_color + "44" }}
      >
        {msg.sender_codename?.[0]}
      </div>

      <div className={`flex flex-col max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
        {/* Sender name */}
        <span className="text-xs font-mono mb-1 px-1" style={{ color: msg.sender_color }}>
          {msg.sender_codename}
          {selfDestructRemaining !== null && (
            <span className="ml-2 text-destructive animate-pulse">
              <Clock className="w-3 h-3 inline mr-1" />
              {selfDestructRemaining}s
            </span>
          )}
        </span>

        {/* Reply reference */}
        {replyTarget && (
          <div className="text-xs font-mono text-muted-foreground border-l-2 border-primary/40 pl-2 mb-1 max-w-full truncate">
            ↩ {replyTarget.sender_codename}: {replyTarget.content?.slice(0, 40)}
          </div>
        )}

        {/* Message content */}
        <div
          className={`relative rounded-2xl px-4 py-2 max-w-full font-mono text-sm
            ${isOwn
              ? "rounded-tr-sm text-foreground"
              : "rounded-tl-sm text-foreground"
            }`}
          style={{
            background: isOwn
              ? `linear-gradient(135deg, hsl(261 87% 50% / 0.3), hsl(261 87% 40% / 0.2))`
              : `rgba(255,255,255,0.06)`,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: isOwn ? "hsl(261 87% 50% / 0.4)" : "rgba(255,255,255,0.08)",
          }}
        >
          {/* Image */}
          {msg.message_type === "image" && msg.file_url && (
            <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
              <img
                src={msg.file_url}
                alt={msg.file_name || "image"}
                className="max-w-full rounded-lg mb-2 max-h-64 object-cover"
              />
            </a>
          )}
          {/* File */}
          {msg.message_type === "file" && msg.file_url && (
            <a
              href={msg.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg border border-border/30 hover:border-primary/30 transition-colors mb-2"
            >
              <FileText className="w-6 h-6 text-secondary flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs truncate">{msg.file_name}</div>
                <div className="text-xs text-muted-foreground">{formatFileSize(msg.file_size)}</div>
              </div>
            </a>
          )}
          {/* Text */}
          {msg.content && <p className="break-words whitespace-pre-wrap">{msg.content}</p>}
          {/* Time */}
          <div className={`text-xs text-muted-foreground mt-1 flex items-center gap-1 ${isOwn ? "justify-end" : "justify-start"}`}>
            {formatTime(msg.created_at)}
            {isOwn && <CheckCheck className="w-3 h-3 text-secondary" />}
          </div>
        </div>

        {/* Reactions */}
        {Object.keys(msg.reactions || {}).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(msg.reactions).map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => onReact(msg.id, emoji)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-all font-mono
                  ${(users as string[]).includes(userId)
                    ? "border-primary/50 bg-primary/10"
                    : "border-border/30 bg-white/5 hover:border-primary/30"
                  }`}
              >
                {emoji} {(users as string[]).length}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`flex items-center gap-1 self-center ${isOwn ? "flex-row-reverse" : "flex-row"}`}
          >
            <button
              onClick={() => onReply(msg)}
              className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              title="Reply"
            >
              <Reply className="w-3.5 h-3.5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowEmojis(!showEmojis)}
                className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                title="React"
              >
                <Smile className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {showEmojis && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute bottom-8 left-0 flex gap-1 p-2 rounded-xl glass z-50 shadow-lg"
                  >
                    {EMOJI_REACTIONS.map((e) => (
                      <button
                        key={e}
                        onClick={() => { onReact(msg.id, e); setShowEmojis(false); }}
                        className="text-lg hover:scale-125 transition-transform"
                      >
                        {e}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(msg.content || "")}
              className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              title="Copy"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            {isOwn && (
              <button
                onClick={() => onDelete(msg.id)}
                className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Destroy"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface GhostChatWindowProps {
  roomId: string;
  roomName: string;
  userId: string;
  onClose?: () => void;
}

export function GhostChatWindow({ roomId, roomName, userId, onClose }: GhostChatWindowProps) {
  const {
    messages, members, typingUsers, loading,
    sendMessage, sendFile, deleteMessage, addReaction, setTyping, markOnline
  } = useGhostChat(roomId, userId);

  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<GhostMessage | null>(null);
  const [selfDestructSeconds, setSelfDestructSeconds] = useState<number | null>(null);
  const [showDestructMenu, setShowDestructMenu] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const myMember = members.find((m) => m.user_id === userId);

  useEffect(() => {
    markOnline(true);
    return () => { markOnline(false); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (!showScrollDown) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showScrollDown]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input, {
      selfDestruct: selfDestructSeconds || undefined,
      replyTo: replyTo?.id,
    });
    setInput("");
    setReplyTo(null);
    setSelfDestructSeconds(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    setTyping(val.length > 0);
  };

  const onlineCount = members.filter((m) => m.is_online).length;

  // Group messages by date
  const groupedMessages: { date: string; msgs: GhostMessage[] }[] = [];
  messages.forEach((msg) => {
    const d = formatDate(msg.created_at);
    const last = groupedMessages[groupedMessages.length - 1];
    if (!last || last.date !== d) {
      groupedMessages.push({ date: d, msgs: [msg] });
    } else {
      last.msgs.push(msg);
    }
  });

  const DESTRUCT_OPTIONS = [
    { label: "10s", value: 10 },
    { label: "30s", value: 30 },
    { label: "1m", value: 60 },
    { label: "5m", value: 300 },
    { label: "OFF", value: null },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-background/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative">
            <Hash className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-black font-mono text-sm truncate gradient-text">{roomName}</div>
            <div className="text-xs text-muted-foreground font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse" />
              {onlineCount} ONLINE · {members.length} AGENTS
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className={`p-2 rounded-lg transition-colors ${showMembers ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
          >
            <Users className="w-4 h-4" />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Messages */}
        <div className="flex flex-col flex-1 min-w-0">
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-1 font-mono"
            style={{ scrollbarWidth: "thin" }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs font-mono text-muted-foreground">ESTABLISHING SECURE CHANNEL...</p>
                </div>
              </div>
            ) : (
              <>
                {groupedMessages.map(({ date, msgs }) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-border/20" />
                      <span className="text-xs font-mono text-muted-foreground/60 px-2 py-0.5 rounded border border-border/20 bg-white/2">{date}</span>
                      <div className="flex-1 h-px bg-border/20" />
                    </div>
                    {msgs.map((msg) => {
                      const replyTarget = msg.reply_to
                        ? messages.find((m) => m.id === msg.reply_to) || null
                        : null;
                      return (
                        <GhostMessageBubble
                          key={msg.id}
                          msg={msg}
                          isOwn={msg.sender_id === userId}
                          onDelete={deleteMessage}
                          onReact={addReaction}
                          onReply={setReplyTo}
                          replyTarget={replyTarget}
                          userId={userId}
                        />
                      );
                    })}
                  </div>
                ))}
                {/* Typing indicator */}
                <AnimatePresence>
                  {typingUsers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="flex items-center gap-2 text-xs font-mono text-muted-foreground py-1"
                    >
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                      <span>{typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} transmitting...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Scroll to bottom btn */}
          <AnimatePresence>
            {showScrollDown && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="absolute bottom-24 right-8 p-2 rounded-full bg-primary/80 backdrop-blur-sm text-white shadow-glow-sm hover:bg-primary transition-colors z-10"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Reply banner */}
          <AnimatePresence>
            {replyTo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex items-center gap-3 font-mono text-xs"
              >
                <Reply className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-primary">{replyTo.sender_codename}</span>
                  <span className="text-muted-foreground ml-2 truncate">{replyTo.content?.slice(0, 60)}</span>
                </div>
                <button onClick={() => setReplyTo(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border/30 bg-background/80 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-end gap-2">
              {/* Self-destruct */}
              <div className="relative">
                <button
                  onClick={() => setShowDestructMenu(!showDestructMenu)}
                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                    selfDestructSeconds
                      ? "text-destructive bg-destructive/10 border border-destructive/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                  title="Self-destruct timer"
                >
                  <Clock className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {showDestructMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-12 left-0 glass rounded-xl p-2 flex flex-col gap-1 z-50 font-mono text-xs w-20"
                    >
                      <div className="text-muted-foreground text-center mb-1 text-xs">BURN</div>
                      {DESTRUCT_OPTIONS.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => {
                            setSelfDestructSeconds(opt.value);
                            setShowDestructMenu(false);
                          }}
                          className={`px-2 py-1 rounded text-center transition-colors ${
                            selfDestructSeconds === opt.value
                              ? "bg-destructive/20 text-destructive"
                              : "hover:bg-white/10 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* File upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors flex-shrink-0"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) sendFile(file);
                  e.target.value = "";
                }}
              />

              {/* Text input */}
              <textarea
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Transmit as ${myMember?.codename || "GHOST"}...`}
                rows={1}
                className="flex-1 bg-white/5 border border-border/30 rounded-xl px-4 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
                style={{ scrollbarWidth: "thin" }}
                onInput={(e) => {
                  const el = e.target as HTMLTextAreaElement;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 120) + "px";
                }}
              />

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl btn-glow text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-4 mt-2 text-xs font-mono text-muted-foreground">
              {selfDestructSeconds && (
                <span className="text-destructive flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  BURN: {selfDestructSeconds}s
                </span>
              )}
              {replyTo && (
                <span className="text-primary flex items-center gap-1">
                  <Reply className="w-3 h-3" />
                  REPLYING
                </span>
              )}
              <span className="ml-auto flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-secondary" />
                E2E ENCRYPTED
              </span>
            </div>
          </div>
        </div>

        {/* Members sidebar */}
        <AnimatePresence>
          {showMembers && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-border/30 bg-background/50 backdrop-blur-sm overflow-hidden flex-shrink-0"
            >
              <div className="p-3">
                <div className="text-xs font-mono text-muted-foreground mb-3 font-bold tracking-wider">
                  AGENTS — {members.length}
                </div>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <div className="relative">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black font-mono border border-white/10"
                          style={{ backgroundColor: member.avatar_color + "33", color: member.avatar_color }}
                        >
                          {member.codename[0]}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-background ${
                            member.is_online ? "bg-secondary" : "bg-muted"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-mono truncate" style={{ color: member.avatar_color }}>
                          {member.codename}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
                          {member.role}
                        </div>
                      </div>
                      {member.is_online ? (
                        <Wifi className="w-3 h-3 text-secondary flex-shrink-0" />
                      ) : (
                        <WifiOff className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
