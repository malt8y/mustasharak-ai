import { useState, useRef, useEffect } from "react";
import { Bot, Send, RefreshCw, Trash2 } from "lucide-react";
import { Streamdown } from "streamdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  "كم أقدر أستلف بناءً على راتبي؟",
  "ما هو الفرق بين المرابحة والإجارة؟",
  "كيف أحسن أهليتي الائتمانية؟",
  "ما هي شروط التمويل العقاري؟",
  "كيف تُحتسب نسبة DBR؟",
  "ما هي منتجات التمويل الشخصي؟",
];

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "هلا وغلا! أنا مساعدك الذكي في معك AI 👋\n\nأنا هنا أساعدك في كل اللي يخص منتجات وخدمات البنك — من حساب الأهلية، إلى شرح المنتجات، إلى توصيات مالية مخصصة لوضعك.\n\nاسألني أي شي تبغاه! 😊",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history,
        }),
      });

      if (!response.ok) throw new Error("فشل الاتصال");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content || "";
                fullContent += delta;
                setStreamingContent(fullContent);
              } catch {}
            }
          }
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fullContent || "عذرًا، حدث خطأ. حاول مرة أخرى.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setStreamingContent("");
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "عذرًا، حدث خطأ في الاتصال. حاول مرة أخرى.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setStreamingContent("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "هلا وغلا! أنا مساعدك الذكي في معك AI 👋\n\nأنا هنا أساعدك في كل اللي يخص منتجات وخدمات البنك — من حساب الأهلية، إلى شرح المنتجات، إلى توصيات مالية مخصصة لوضعك.\n\nاسألني أي شي تبغاه! 😊",
        timestamp: new Date(),
      },
    ]);
    setStreamingContent("");
  };

  return (
    <div dir="rtl" className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 flex items-center justify-between"
        style={{
          background: "rgba(5, 13, 10, 0.95)",
          borderBottom: "1px solid var(--bank-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #a07d1a, #c9a227)" }}
          >
            <Bot size={20} style={{ color: "#050d0a" }} />
          </div>
          <div>
            <div className="font-bold" style={{ color: "var(--bank-text-primary)" }}>
              معك AI — مدير حسابك الذكي
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#22c55e" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              متاح الآن 24/7
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--bank-border)",
            color: "var(--bank-text-muted)",
          }}
        >
          <Trash2 size={12} />
          محادثة جديدة
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ml-2 mt-1"
                style={{ background: "linear-gradient(135deg, #a07d1a, #c9a227)" }}
              >
                <Bot size={14} style={{ color: "#050d0a" }} />
              </div>
            )}
            <div
              className="max-w-[80%] md:max-w-[65%] px-4 py-3 text-sm leading-relaxed"
              style={
                msg.role === "user"
                  ? {
                      background: "rgba(201, 162, 39, 0.12)",
                      border: "1px solid rgba(201, 162, 39, 0.25)",
                      borderRadius: "16px 16px 16px 4px",
                      color: "var(--bank-text-primary)",
                    }
                  : {
                      background: "var(--bank-surface)",
                      border: "1px solid var(--bank-border)",
                      borderRadius: "16px 16px 4px 16px",
                      color: "var(--bank-text-primary)",
                    }
              }
            >
              {msg.role === "assistant" ? (
                <Streamdown>{msg.content}</Streamdown>
              ) : (
                <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
              )}
              <div
                className="text-xs mt-1.5"
                style={{ color: "var(--bank-text-muted)" }}
              >
                {msg.timestamp.toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {isLoading && (
          <div className="flex justify-end">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ml-2 mt-1"
              style={{ background: "linear-gradient(135deg, #a07d1a, #c9a227)" }}
            >
              <Bot size={14} style={{ color: "#050d0a" }} />
            </div>
            <div
              className="max-w-[80%] md:max-w-[65%] px-4 py-3 text-sm leading-relaxed"
              style={{
                background: "var(--bank-surface)",
                border: "1px solid var(--bank-border)",
                borderRadius: "16px 16px 4px 16px",
                color: "var(--bank-text-primary)",
              }}
            >
              {streamingContent ? (
                <Streamdown>{streamingContent}</Streamdown>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "var(--bank-gold)", animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "var(--bank-gold)", animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "var(--bank-gold)", animationDelay: "300ms" }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div
          className="flex-shrink-0 px-4 py-3"
          style={{ borderTop: "1px solid var(--bank-border)" }}
        >
          <p className="text-xs mb-2" style={{ color: "var(--bank-text-muted)" }}>
            أسئلة شائعة:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: "rgba(201, 162, 39, 0.08)",
                  border: "1px solid rgba(201, 162, 39, 0.2)",
                  color: "var(--bank-text-secondary)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(201, 162, 39, 0.15)";
                  (e.currentTarget as HTMLElement).style.color = "var(--bank-gold)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(201, 162, 39, 0.08)";
                  (e.currentTarget as HTMLElement).style.color = "var(--bank-text-secondary)";
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{
          background: "rgba(5, 13, 10, 0.95)",
          borderTop: "1px solid var(--bank-border)",
        }}
      >
        <div
          className="flex items-end gap-3 p-3 rounded-2xl"
          style={{
            background: "var(--bank-surface-2)",
            border: "1.5px solid var(--bank-border)",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اسألني عن أي منتج أو خدمة مصرفية..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm outline-none"
            style={{
              color: "var(--bank-text-primary)",
              maxHeight: "120px",
              lineHeight: "1.5",
            }}
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              background:
                input.trim() && !isLoading
                  ? "linear-gradient(135deg, #a07d1a, #c9a227)"
                  : "rgba(255,255,255,0.05)",
              color: input.trim() && !isLoading ? "#050d0a" : "var(--bank-text-muted)",
            }}
          >
            {isLoading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Send size={16} style={{ transform: "rotate(180deg)" }} />
            )}
          </button>
        </div>
        <p className="text-xs text-center mt-2" style={{ color: "var(--bank-text-muted)" }}>
          المعلومات استرشادية فقط — تواصل مع البنك للتأكيد
        </p>
      </div>
    </div>
  );
}
