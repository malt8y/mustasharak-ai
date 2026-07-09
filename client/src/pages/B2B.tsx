import { useState } from "react";
import { Link } from "wouter";
import {
  Building2,
  Bot,
  Zap,
  Shield,
  BarChart3,
  CheckCircle,
  ArrowLeft,
  Phone,
  Mail,
  Send,
} from "lucide-react";

const benefits = [
  {
    icon: Bot,
    title: "مساعد AI مخصص لمنتجاتك",
    desc: "يتم تدريب المساعد على منتجات وخدمات بنكك تحديدًا، ويرفض الإجابة خارج نطاقها.",
    color: "#c9a227",
  },
  {
    icon: Zap,
    title: "تكامل سريع وسهل",
    desc: "API جاهز للتكامل مع أي منصة رقمية خلال أيام، مع دعم فني متكامل.",
    color: "#22c55e",
  },
  {
    icon: Shield,
    title: "أمان وموثوقية عالية",
    desc: "بنية تحتية آمنة مع تشفير كامل وامتثال لمعايير ساما والجهات الرقابية.",
    color: "#3b82f6",
  },
  {
    icon: BarChart3,
    title: "تحليلات وتقارير متقدمة",
    desc: "لوحة تحكم شاملة لمتابعة تفاعلات العملاء وتحسين الخدمة باستمرار.",
    color: "#a855f7",
  },
];

const features = [
  "تخصيص كامل لهوية البنك واسمه ولغته",
  "قاعدة معرفة مبنية من وثائق البنك",
  "حاسبة DBR مخصصة بمنتجات البنك",
  "دعم RTL عربي كامل",
  "تكامل مع أنظمة CRM الحالية",
  "تقارير يومية وأسبوعية",
  "دعم فني 24/7",
  "تحديثات مستمرة للمحتوى",
];

export default function B2B() {
  const [form, setForm] = useState({
    name: "",
    bank: "",
    phone: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div dir="rtl" className="py-8">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              background: "rgba(201, 162, 39, 0.1)",
              border: "1px solid rgba(201, 162, 39, 0.3)",
            }}
          >
            <Building2 size={16} style={{ color: "var(--bank-gold)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--bank-gold)" }}>
              حلول للبنوك والمؤسسات المالية
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black mb-4"
            style={{
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              color: "var(--bank-text-primary)",
            }}
          >
            دمّج معك AI في منصتك الرقمية
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--bank-text-secondary)" }}
          >
            امنح عملاءك تجربة مدير حساب ذكي متخصص بمنتجاتك وخدماتك — متاح 24/7
            ولا يخطئ أبدًا.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="bank-card bank-card-hover p-5 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `${b.color}15`,
                  border: `1px solid ${b.color}30`,
                }}
              >
                <b.icon size={22} style={{ color: b.color }} />
              </div>
              <h3
                className="font-bold mb-2"
                style={{
                  color: "var(--bank-text-primary)",
                  fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                }}
              >
                {b.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--bank-text-secondary)" }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Features + Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Features List */}
          <div>
            <h2
              className="text-2xl font-black mb-6"
              style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                color: "var(--bank-text-primary)",
              }}
            >
              ما يشمله الحل
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {features.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: "rgba(13, 61, 34, 0.2)",
                    border: "1px solid var(--bank-border)",
                  }}
                >
                  <CheckCircle size={18} style={{ color: "#22c55e", flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: "var(--bank-text-secondary)" }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>

            {/* Demo Preview */}
            <div
              className="mt-8 p-5 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(13,61,34,0.5), rgba(10,46,26,0.3))",
                border: "1px solid rgba(201, 162, 39, 0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #a07d1a, #c9a227)" }}
                >
                  <Bot size={18} style={{ color: "#050d0a" }} />
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: "var(--bank-text-primary)" }}>
                    معك AI
                  </div>
                  <div className="text-xs" style={{ color: "#22c55e" }}>
                    مخصص لبنكك
                  </div>
                </div>
              </div>
              <p className="text-sm" style={{ color: "var(--bank-text-secondary)" }}>
                "هلا! أنا مساعدك الذكي في [اسم بنكك]. أقدر أساعدك في حساب أهليتك،
                شرح منتجاتنا، والإجابة على أسئلتك المصرفية 24/7."
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2
              className="text-2xl font-black mb-6"
              style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                color: "var(--bank-text-primary)",
              }}
            >
              تواصل معنا
            </h2>

            {sent ? (
              <div
                className="p-8 rounded-2xl text-center"
                style={{
                  background: "rgba(34, 197, 94, 0.08)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                }}
              >
                <CheckCircle size={48} style={{ color: "#22c55e", margin: "0 auto 16px" }} />
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--bank-text-primary)" }}
                >
                  تم الإرسال بنجاح!
                </h3>
                <p style={{ color: "var(--bank-text-secondary)" }}>
                  سيتواصل معك فريقنا خلال 24 ساعة.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: "var(--bank-text-secondary)" }}>
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 text-sm bank-input"
                      placeholder="محمد العمري"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: "var(--bank-text-secondary)" }}>
                      اسم البنك / المؤسسة *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.bank}
                      onChange={(e) => setForm({ ...form, bank: e.target.value })}
                      className="w-full px-4 py-3 text-sm bank-input"
                      placeholder="بنك ..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: "var(--bank-text-secondary)" }}>
                      رقم الجوال *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 text-sm bank-input"
                      placeholder="05xxxxxxxx"
                      style={{ direction: "ltr" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: "var(--bank-text-secondary)" }}>
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 text-sm bank-input"
                      placeholder="name@bank.com"
                      style={{ direction: "ltr" }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: "var(--bank-text-secondary)" }}>
                    رسالتك
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 text-sm bank-input resize-none"
                    placeholder="أخبرنا عن احتياجاتك وعدد عملائك..."
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold btn-gold"
                >
                  <Send size={18} />
                  إرسال الطلب
                </button>
              </form>
            )}

            {/* Contact Info */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a
                href="tel:920000000"
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: "rgba(201, 162, 39, 0.08)",
                  border: "1px solid rgba(201, 162, 39, 0.2)",
                  color: "var(--bank-text-secondary)",
                }}
              >
                <Phone size={16} style={{ color: "var(--bank-gold)" }} />
                <span className="text-sm">920000000</span>
              </a>
              <a
                href="mailto:b2b@maaka-ai.sa"
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: "rgba(201, 162, 39, 0.08)",
                  border: "1px solid rgba(201, 162, 39, 0.2)",
                  color: "var(--bank-text-secondary)",
                }}
              >
                <Mail size={16} style={{ color: "var(--bank-gold)" }} />
                <span className="text-sm">b2b@maaka-ai.sa</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
