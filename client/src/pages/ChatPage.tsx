import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, RefreshCw, Trash2, Sparkles, FileText, User, ChevronDown } from "lucide-react";
import { Streamdown } from "streamdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// بيانات العميل المحفوظة في الذاكرة
interface ClientProfile {
  employer?: string;       // جهة العمل
  employerType?: string;   // حكومي / خاص / عسكري
  salary?: number;         // الراتب
  salaryType?: "gross" | "net"; // إجمالي أو صافي
  salaryTransferred?: boolean;  // هل محول للبنك
  obligations?: number;    // الالتزامات الشهرية
  hasRealEstate?: boolean; // هل عنده عقاري
  isRealEstateSupported?: boolean; // مدعوم من صندوق التنمية
}

const QUICK_QUESTIONS = [
  "كم أقدر أستلف؟",
  "احسب لي قسط سيارة",
  "أبغى تمويل شخصي",
  "وش أنواع البطاقات؟",
  "أبغى أعرف أهليتي",
  "ما هو برنامج 50/50؟",
];

const WELCOME_MSG = `هلا وغلا! 👋 أنا مستشارك الائتماني الذكي في **معك AI**

أقدر أساعدك في:
- 🔢 حساب أهليتك الائتمانية بدقة
- 💰 احتساب الأقساط مع الأرباح والتأمين
- 📋 شرح منتجات البنك وشروطها
- 🎯 توصيات مخصصة تجمع بين المنتجات لمصلحتك

اسألني أي شي تبغاه! 😊`;

// استخراج بيانات العميل من المحادثة
function extractClientData(messages: Message[]): ClientProfile {
  const profile: ClientProfile = {};
  const allText = messages.map(m => m.content).join(" ").toLowerCase();

  // استخراج الراتب
  const salaryMatch = allText.match(/راتب[يه]?\s*[هو\s]*(\d[\d,]+)/);
  if (salaryMatch) {
    profile.salary = parseInt(salaryMatch[1].replace(/,/g, ""));
  }

  // استخراج جهة العمل
  if (allText.includes("حكومي") || allText.includes("وزارة") || allText.includes("حكوم")) {
    profile.employerType = "حكومي";
  } else if (allText.includes("عسكري") || allText.includes("جيش") || allText.includes("حرس")) {
    profile.employerType = "عسكري";
  } else if (allText.includes("خاص") || allText.includes("شركة")) {
    profile.employerType = "خاص";
  }

  // تحويل الراتب
  if (allText.includes("محول") || allText.includes("راتبي عندكم") || allText.includes("راتبي في البنك")) {
    profile.salaryTransferred = true;
  } else if (allText.includes("غير محول") || allText.includes("راتبي في بنك ثاني") || allText.includes("ما محول")) {
    profile.salaryTransferred = false;
  }

  return profile;
}

// بناء سياق العميل لإرساله مع كل رسالة
function buildClientContext(profile: ClientProfile): string {
  const parts: string[] = [];
  if (profile.employerType) parts.push(`جهة العمل: ${profile.employerType}`);
  if (profile.employer) parts.push(`اسم الجهة: ${profile.employer}`);
  if (profile.salary) parts.push(`الراتب: ${profile.salary.toLocaleString("ar-SA")} ريال (${profile.salaryType === "net" ? "صافي" : "إجمالي"})`);
  if (profile.salaryTransferred !== undefined) parts.push(`تحويل الراتب: ${profile.salaryTransferred ? "نعم، محول للبنك" : "لا، في بنك آخر"}`);
  if (profile.obligations) parts.push(`الالتزامات الشهرية: ${profile.obligations.toLocaleString("ar-SA")} ريال`);
  if (parts.length === 0) return "";
  return `\n\n[بيانات العميل المحفوظة: ${parts.join(" | ")}]`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_MSG,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [clientProfile, setClientProfile] = useState<ClientProfile>({});
  const [showProfile, setShowProfile] = useState(false);
  const [showSummaryBtn, setShowSummaryBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // تحديث بيانات العميل من المحادثة
  useEffect(() => {
    if (messages.length > 2) {
      const extracted = extractClientData(messages);
      setClientProfile(prev => ({ ...prev, ...extracted }));
      // إظهار زر الملخص بعد 4 رسائل على الأقل
      if (messages.length >= 5) setShowSummaryBtn(true);
    }
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const messageText = (text || input).trim();
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

    abortRef.current = new AbortController();

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .slice(-14)
        .map((m) => ({ role: m.role, content: m.content }));

      // إضافة سياق العميل المحفوظ للرسالة
      const clientCtx = buildClientContext(clientProfile);
      const enrichedMessage = clientCtx
        ? `${messageText}${clientCtx}`
        : messageText;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: enrichedMessage, history }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "فشل الاتصال");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.ping) continue;
                const delta = parsed.choices?.[0]?.delta?.content || "";
                if (delta) {
                  fullContent += delta;
                  setStreamingContent(fullContent);
                }
              } catch {}
            }
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fullContent || "عذرًا، حدث خطأ. حاول مرة أخرى.",
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `عذرًا، ${err?.message || "حدث خطأ في الاتصال"}. حاول مرة أخرى.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
      abortRef.current = null;
    }
  }, [input, isLoading, messages, clientProfile]);

  // طلب تقرير ملخص
  const requestSummary = useCallback(() => {
    sendMessage("أعطني تقرير ملخص بكل ما تحدثنا عنه، يشمل وضعي المالي والتوصيات والأرقام التي حسبناها، بشكل منظم وواضح.");
  }, [sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: WELCOME_MSG,
        timestamp: new Date(),
      },
    ]);
    setStreamingContent("");
    setIsLoading(false);
    setClientProfile({});
    setShowProfile(false);
    setShowSummaryBtn(false);
  };

  const isFirstMessage = messages.length <= 1;
  const hasProfile = Object.keys(clientProfile).some(k => (clientProfile as any)[k] !== undefined);

  return (
    <div
      dir="rtl"
      className="flex flex-col"
      style={{
        height: "100dvh",
        background: "var(--bank-green-darkest)",
        overflow: "hidden",
      }}
    >
      {/* ===== Header ===== */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(5, 13, 10, 0.98)",
          borderBottom: "1px solid var(--bank-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #a07d1a, #c9a227)",
              boxShadow: "0 0 16px rgba(201,162,39,0.35)",
            }}
          >
            <Bot size={20} style={{ color: "#050d0a" }} />
          </div>
          <div>
            <div
              className="font-black text-base leading-tight"
              style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                background: "linear-gradient(135deg, #a07d1a, #e8c547)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              معك AI
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#22c55e" }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
              مستشارك الائتماني — متاح ٢٤/٧
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* زر بيانات العميل */}
          {hasProfile && (
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: showProfile ? "rgba(201,162,39,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${showProfile ? "rgba(201,162,39,0.4)" : "var(--bank-border)"}`,
                color: showProfile ? "var(--bank-gold)" : "var(--bank-text-muted)",
              }}
            >
              <User size={12} />
              ملفك
              <ChevronDown size={10} style={{ transform: showProfile ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
          )}

          {/* زر تقرير الملخص */}
          {showSummaryBtn && (
            <button
              onClick={requestSummary}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#22c55e",
              }}
            >
              <FileText size={12} />
              ملخص
            </button>
          )}

          {/* زر محادثة جديدة */}
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--bank-border)",
              color: "var(--bank-text-muted)",
            }}
          >
            <Trash2 size={12} />
            جديدة
          </button>
        </div>
      </header>

      {/* ===== بيانات العميل المحفوظة ===== */}
      {showProfile && hasProfile && (
        <div
          className="flex-shrink-0 px-4 py-3 animate-fade-in-up"
          style={{
            background: "rgba(201,162,39,0.05)",
            borderBottom: "1px solid rgba(201,162,39,0.15)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <User size={13} style={{ color: "var(--bank-gold)" }} />
            <span className="text-xs font-bold" style={{ color: "var(--bank-gold)" }}>
              بياناتك المحفوظة في المحادثة
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {clientProfile.employerType && (
              <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                جهة العمل: {clientProfile.employerType}
              </span>
            )}
            {clientProfile.salary && (
              <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: "rgba(201,162,39,0.1)", color: "var(--bank-gold)", border: "1px solid rgba(201,162,39,0.2)" }}>
                الراتب: {clientProfile.salary.toLocaleString("ar-SA")} ريال
              </span>
            )}
            {clientProfile.salaryTransferred !== undefined && (
              <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>
                {clientProfile.salaryTransferred ? "✓ راتب محول" : "✗ راتب غير محول"}
              </span>
            )}
            {clientProfile.obligations && (
              <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                التزامات: {clientProfile.obligations.toLocaleString("ar-SA")} ريال
              </span>
            )}
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--bank-text-muted)" }}>
            هذي البيانات تُستخدم تلقائياً في كل حساب خلال المحادثة
          </p>
        </div>
      )}

      {/* ===== Messages Area ===== */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "16px 16px 8px" }}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-1"
                  style={{ background: "linear-gradient(135deg, #a07d1a, #c9a227)" }}
                >
                  <Bot size={14} style={{ color: "#050d0a" }} />
                </div>
              )}

              <div
                className="max-w-[80%] md:max-w-[70%] px-4 py-3 text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? {
                        background: "linear-gradient(135deg, rgba(160,125,26,0.25), rgba(201,162,39,0.15))",
                        border: "1px solid rgba(201,162,39,0.3)",
                        borderRadius: "16px 16px 16px 4px",
                        color: "var(--bank-text-primary)",
                      }
                    : {
                        background: "rgba(14, 31, 21, 0.9)",
                        border: "1px solid var(--bank-border)",
                        borderRadius: "16px 16px 4px 16px",
                        color: "var(--bank-text-primary)",
                      }
                }
              >
                {msg.role === "assistant" ? (
                  <div className="prose-sm">
                    <Streamdown>{msg.content}</Streamdown>
                  </div>
                ) : (
                  <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
                )}
                <div className="text-xs mt-2 opacity-50" style={{ color: "var(--bank-text-muted)" }}>
                  {msg.timestamp.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {/* Streaming bubble */}
          {isLoading && (
            <div className="flex items-end gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-1"
                style={{ background: "linear-gradient(135deg, #a07d1a, #c9a227)" }}
              >
                <Bot size={14} style={{ color: "#050d0a" }} />
              </div>
              <div
                className="max-w-[80%] md:max-w-[70%] px-4 py-3 text-sm leading-relaxed"
                style={{
                  background: "rgba(14, 31, 21, 0.9)",
                  border: "1px solid var(--bank-border)",
                  borderRadius: "16px 16px 4px 16px",
                  color: "var(--bank-text-primary)",
                }}
              >
                {streamingContent ? (
                  <div className="prose-sm">
                    <Streamdown>{streamingContent}</Streamdown>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 py-1">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: "var(--bank-gold)", animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ===== Quick Questions ===== */}
      {isFirstMessage && !isLoading && (
        <div
          className="flex-shrink-0 px-4 py-3"
          style={{ borderTop: "1px solid rgba(26,61,37,0.4)" }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-medium" style={{ color: "var(--bank-text-muted)" }}>
              <Sparkles size={12} style={{ color: "var(--bank-gold)" }} />
              ابدأ من هنا
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                  style={{
                    background: "rgba(201,162,39,0.07)",
                    border: "1px solid rgba(201,162,39,0.2)",
                    color: "var(--bank-text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,162,39,0.15)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,162,39,0.4)";
                    (e.currentTarget as HTMLElement).style.color = "var(--bank-gold)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,162,39,0.07)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,162,39,0.2)";
                    (e.currentTarget as HTMLElement).style.color = "var(--bank-text-secondary)";
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== Input Area ===== */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{
          background: "rgba(5, 13, 10, 0.98)",
          borderTop: "1px solid var(--bank-border)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="flex items-end gap-3 p-3 rounded-2xl transition-all duration-200"
            style={{
              background: "rgba(14, 31, 21, 0.8)",
              border: "1.5px solid var(--bank-border)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="اسألني عن أي منتج أو خدمة مصرفية..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm outline-none"
              style={{
                color: "var(--bank-text-primary)",
                lineHeight: "1.6",
                maxHeight: "140px",
                minHeight: "24px",
              }}
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
              style={{
                background: input.trim() && !isLoading
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

          <p className="text-center text-xs mt-2" style={{ color: "var(--bank-text-muted)" }}>
            المعلومات استرشادية فقط — تواصل مع البنك للتأكيد
          </p>
        </div>
      </div>
    </div>
  );
}
