import { useState } from "react";
import { MessageCircle, X } from "lucide-react"; // using Lucide icons

interface Message {
  id: number;
  text: string;
  user: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, user: "You" },
    ]);
    setInput("");
  };

  return (
    <div
      className={`flex flex-col bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
        collapsed ? "w-fit h-fit" : "h-[500px] w-fit"
      }`}
    >
      <div className="p-2 border-b border-gray-200 font-semibold flex justify-between items-center">
        {!collapsed && <span>Game Chat</span>}

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center"
        >
          {collapsed ? <MessageCircle size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Messages */}
      {!collapsed && (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">
                No messages yet...
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg max-w-[80%] break-words ${
                    msg.user === "You"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <span className="block text-xs font-medium">{msg.user}</span>
                  <span>{msg.text}</span>
                </div>
              ))
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-gray-200 flex gap-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
