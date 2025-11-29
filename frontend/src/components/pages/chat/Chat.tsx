import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, ChevronUp, ChevronDown } from "lucide-react";

interface Message {
  id: number;
  text: string;
  user: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, user: "You" },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 font-medium"
      >
        <MessageCircle size={20} />
        <span>Chat</span>
        <div className="bg-white/20 px-1.5 rounded text-xs font-bold">
          {messages.length}
        </div>
      </button>
    );
  }

  return (
    <div className="w-[350px] h-[500px] flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div
        className="p-4 border-b border-border/50 bg-primary text-primary-foreground flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(false)}
      >
        <div className="flex items-center gap-2 font-semibold">
          <MessageCircle size={18} />
          <span>Game Chat</span>
        </div>
        <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <MessageCircle size={40} className="mb-2" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Say hello to your opponent!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.user === "You" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-xl max-w-[85%] text-sm break-words shadow-sm ${
                  msg.user === "You"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card border border-border text-foreground rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1">
                {msg.user}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-border/50 bg-card">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            autoFocus
            className="flex-1 px-4 py-2 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
