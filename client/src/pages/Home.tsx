import { Link } from "wouter";
import {
  Bot,
  Calculator,
  TrendingUp,
  ChevronLeft,
  CheckCircle,
  Building2,
  Zap,
  Shield,
  Clock,
  Star,
  ArrowLeft,
  Users,
  BarChart3,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "حاسبة الأهلية الذكية",
    desc: "احسب نسبة الدين للدخل (DBR) بدقة تامة وفق معايير ساما السعودية، مع تحليل فوري لجميع سيناريوهات التمويل.",
    color: "#c9a227",
    href: "/calculator",
  },
  {
    icon: Bot,
    title: "مدير حسابك الذكي",
    desc: "مساعد AI سعودي متخصص يعرف كل منتجات البنك، يتكلم بلهجتك، ويعطيك توصيات مخصصة 24/7 بدون أخطاء.",
    color: "#22c55e",
    href: "/assistant",
  },
  {
    icon: TrendingUp,
    title: "تحليل وضعك المالي",
    desc: "أدخل بياناتك واحصل على خارطة طريق مالية كاملة مع توصيات مخصصة لتحسين أهليتك الائتمانية.",
    color: "#3b82f6",
    href: "/calculator",
  },
];

const steps = [
  {
    num: "01",
    title: "أدخل راتبك والتزاماتك",
    desc: "أدخل راتبك الشهري وجميع التزاماتك الحالية من تمويلات وبطاقات ائتمانية.",
  },
  {
    num: "02",
    title: "احصل على تحليل DBR فوري",
    desc: "يحسب النظام نسبة الدين للدخل فورًا مع جميع الحدود المسموحة وفق ساما.",
  },
  {
    num: "03",
    title: "تحدث مع مدير حسابك",
    desc: "اسأل المساعد الذكي عن أي منتج أو قرار مالي واحصل على توصية مخصصة لوضعك.",
  },
];

const liveExamples = [
  {
    title: "موظف يريد سيارة",
    query: "راتبي 12,000 وعندي قرض شخصي 3,000 شهريًا، أبغى سيارة بـ 80,000",
    response:
      "الصافي بعد التأمينات ~11,400. الحد الأقصى للشخصي 33% = 3,762. المتبقي 762 ريال فقط. بـ 80,000 على 60 شهرًا القسط ~1,500 — يتجاوز المتاح. الحل: سيارة بـ 45,000-50,000 أو سداد جزء من القرض أولًا.",
    badge: "تمويل سيارة",
    badgeColor: "#c9a227",
  },
  {
    title: "عقاري مدعوم من صندوق التنمية",
    query: "راتبي 12,000 وعندي عقاري من صندوق التنمية قسطه 2,500 وقرض شخصي 1,500. أبغى أزيد قرض",
    response:
      "الصافي ~11,400. العقاري مدعوم → حد إجمالي 65% = 7,410. الشخصي الحالي 1,500 → متبقي للشخصي 2,262. بـ 2,262 على 60 شهرًا → تمويل شخصي ~120,000 ريال.",
    badge: "تمويل عقاري مدعوم",
    badgeColor: "#22c55e",
  },
  {
    title: "راتب مرتفع فوق 25,000",
    query: "راتبي 30,000 وعندي عقاري غير مدعوم قسطه 8,000، أبغى قرض شخصي",
    response:
      "راتب فوق 25,000 → حد إجمالي 70%. الصافي ~28,500. المتبقي للشخصي = 9,405 شهريًا. بـ 9,000 على 60 شهرًا → تمويل شخصي ~480,000 ريال.",
    badge: "راتب مرتفع",
    badgeColor: "#3b82f6",
  },
];

const stats = [
  { value: "99.9%", label: "دقة الحسابات" },
  { value: "24/7", label: "متاح دائمًا" },
  { value: "+50", label: "منتج مصرفي" },
  { value: "0", label: "أخطاء مالية" },
];

export default function Home() {
  return (
    <div dir="rtl">
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(13,61,34,0.5) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(201,162,39,0.08) 0%, transparent 50%), var(--bank-green-darkest)",
        }}
      >
        {/* Dot Grid Background */}
        <div
          className="absolute inset-0 dot-grid-bg opacity-40"
          style={{ pointerEvents: "none" }}
        />

        {/* Glow Effects */}
        <div
          className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--bank-green-mid)" }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--bank-gold)" }}
        />

        <div className="container relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in-up"
              style={{
                background: "rgba(201, 162, 39, 0.1)",
                border: "1px solid rgba(201, 162, 39, 0.3)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--bank-gold)" }}
              />
              <span className="text-sm font-medium" style={{ color: "var(--bank-gold)" }}>
                مدير حسابك الذكي — متاح 24/7
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight animate-fade-in-up delay-100"
              style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                color: "var(--bank-text-primary)",
              }}
            >
              مستشارك المالي الذكي
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #a07d1a, #e8c547)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                معك في كل خطوة
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200"
              style={{ color: "var(--bank-text-secondary)" }}
            >
              احسب أهليتك الائتمانية ، اعرف خياراتك ، واتخذ قرارات مالية واثقة مع
              مدير حسابك الرقمي الذي يعرف كل منتجات البنك ولا يخطئ.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <Link
                href="/assistant"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold btn-gold"
                style={{ minWidth: "200px", justifyContent: "center" }}
              >
                <Bot size={20} />
                ابدأ مع المساعد الذكي
              </Link>
              <Link
                href="/calculator"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold btn-outline-gold"
                style={{ minWidth: "200px", justifyContent: "center" }}
              >
                <Calculator size={20} />
                احسب أهليتك الآن
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in-up delay-400">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-2xl"
                  style={{
                    background: "rgba(13, 61, 34, 0.3)",
                    border: "1px solid var(--bank-border)",
                  }}
                >
                  <div
                    className="text-2xl md:text-3xl font-black mb-1"
                    style={{
                      fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                      color: "var(--bank-gold)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm" style={{ color: "var(--bank-text-muted)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--bank-green-darkest))",
          }}
        />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-black mb-4"
              style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                color: "var(--bank-text-primary)",
              }}
            >
              كل اللي تحتاجه في مكان واحد
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--bank-text-secondary)" }}>
              منصة متكاملة تجمع بين دقة الأرقام وذكاء المستشار المالي المحترف
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="block bank-card bank-card-hover p-6 group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: `${feature.color}18`,
                    border: `1px solid ${feature.color}30`,
                  }}
                >
                  <feature.icon size={24} style={{ color: feature.color }} />
                </div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                    color: "var(--bank-text-primary)",
                  }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--bank-text-secondary)" }}>
                  {feature.desc}
                </p>
                <div
                  className="flex items-center gap-1.5 mt-4 text-sm font-medium transition-colors duration-200"
                  style={{ color: feature.color }}
                >
                  <span>اكتشف أكثر</span>
                  <ChevronLeft size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(180deg, var(--bank-green-darkest) 0%, rgba(10,46,26,0.3) 50%, var(--bank-green-darkest) 100%)",
        }}
      >
        <div className="container">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-black mb-4"
              style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                color: "var(--bank-text-primary)",
              }}
            >
              كيف يعمل معك AI ؟
            </h2>
            <p className="text-lg" style={{ color: "var(--bank-text-secondary)" }}>
              ثلاث خطوات بسيطة للحصول على توصية مالية مخصصة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-8 right-1/6 left-1/6 h-px"
              style={{ background: "linear-gradient(90deg, transparent, var(--bank-border), transparent)" }}
            />

            {steps.map((step, i) => (
              <div key={step.num} className="text-center relative animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl font-black"
                  style={{
                    background: "linear-gradient(135deg, rgba(201,162,39,0.15), rgba(201,162,39,0.05))",
                    border: "2px solid rgba(201,162,39,0.3)",
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                    color: "var(--bank-gold)",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                    color: "var(--bank-text-primary)",
                  }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--bank-text-secondary)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Examples */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-black mb-4"
              style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                color: "var(--bank-text-primary)",
              }}
            >
              أمثلة حية من الواقع
            </h2>
            <p className="text-lg" style={{ color: "var(--bank-text-secondary)" }}>
              شوف كيف يحلل معك AI وضعك ويعطيك الأرقام الصحيحة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {liveExamples.map((example, i) => (
              <div
                key={example.title}
                className="bank-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{
                    background: `${example.badgeColor}15`,
                    border: `1px solid ${example.badgeColor}30`,
                    color: example.badgeColor,
                  }}
                >
                  <Star size={10} />
                  {example.badge}
                </div>

                <h3
                  className="font-bold mb-4"
                  style={{
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                    color: "var(--bank-text-primary)",
                  }}
                >
                  {example.title}
                </h3>

                {/* Chat Preview */}
                <div className="space-y-3">
                  {/* User Message */}
                  <div className="flex justify-start">
                    <div
                      className="max-w-[85%] px-4 py-3 text-sm leading-relaxed"
                      style={{
                        background: "rgba(201, 162, 39, 0.12)",
                        border: "1px solid rgba(201, 162, 39, 0.2)",
                        borderRadius: "12px 12px 12px 4px",
                        color: "var(--bank-text-primary)",
                      }}
                    >
                      {example.query}
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-end">
                    <div
                      className="max-w-[90%] px-4 py-3 text-sm leading-relaxed"
                      style={{
                        background: "rgba(13, 61, 34, 0.5)",
                        border: "1px solid var(--bank-border)",
                        borderRadius: "12px 12px 4px 12px",
                        color: "var(--bank-text-secondary)",
                      }}
                    >
                      <div
                        className="flex items-center gap-1.5 mb-2 text-xs font-medium"
                        style={{ color: "var(--bank-gold)" }}
                      >
                        <Bot size={12} />
                        معك AI
                      </div>
                      {example.response}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold btn-gold"
            >
              <MessageSquare size={20} />
              جرب المساعد الذكي الآن
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        className="py-20"
        style={{
          background: "rgba(10, 46, 26, 0.15)",
          borderTop: "1px solid var(--bank-border)",
          borderBottom: "1px solid var(--bank-border)",
        }}
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl md:text-4xl font-black mb-6"
                style={{
                  fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                  color: "var(--bank-text-primary)",
                }}
              >
                ليش معك AI مختلف ؟
              </h2>
              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ color: "var(--bank-text-secondary)" }}
              >
                مو مجرد شات بوت — هو مدير حسابك الرقمي الذي يعرف كل منتجات البنك ،
                يتكلم بلهجتك السعودية ، ويعطيك معلومة صح في كل مرة.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Shield, text: "معلومات دقيقة 100% مبنية على معايير ساما الرسمية" },
                  { icon: Clock, text: "متاح 24/7 — حتى في العطل والإجازات" },
                  { icon: Zap, text: "ردود فورية بدون انتظار أو طوابير" },
                  { icon: CheckCircle, text: "يرفض الإجابة خارج نطاق منتجات البنك" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(201, 162, 39, 0.12)" }}
                    >
                      <item.icon size={16} style={{ color: "var(--bank-gold)" }} />
                    </div>
                    <span className="text-base" style={{ color: "var(--bank-text-secondary)" }}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Card */}
            <div className="relative">
              <div
                className="bank-card p-6 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(13,61,34,0.6), rgba(10,46,26,0.4))",
                }}
              >
                <div className="animate-shimmer absolute inset-0 rounded-xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #a07d1a, #c9a227)" }}
                    >
                      <Bot size={20} style={{ color: "#050d0a" }} />
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: "var(--bank-text-primary)" }}>
                        معك AI
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "#22c55e" }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        متاح الآن
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { q: "كم أقدر أستلف؟", a: "بناءً على راتبك وإلتزاماتك، أقدر أحسب لك الآن..." },
                      { q: "ما هو الفرق بين المرابحة والإجارة؟", a: "المرابحة: البنك يشتري ويبيعك بربح محدد. الإجارة: تأجير مع خيار التملك..." },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div
                          className="text-xs px-3 py-2 rounded-xl"
                          style={{
                            background: "rgba(201, 162, 39, 0.1)",
                            color: "var(--bank-text-primary)",
                            borderRadius: "12px 12px 12px 4px",
                          }}
                        >
                          {item.q}
                        </div>
                        <div
                          className="text-xs px-3 py-2 rounded-xl"
                          style={{
                            background: "rgba(13, 61, 34, 0.6)",
                            border: "1px solid var(--bank-border)",
                            color: "var(--bank-text-secondary)",
                            borderRadius: "12px 12px 4px 12px",
                          }}
                        >
                          <span style={{ color: "var(--bank-gold)" }} className="font-medium">معك AI: </span>
                          {item.a}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Section */}
      <section className="py-20">
        <div className="container">
          <div
            className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(13,61,34,0.6) 0%, rgba(10,46,26,0.4) 100%)",
              border: "1px solid rgba(201, 162, 39, 0.2)",
            }}
          >
            <div
              className="absolute inset-0 dot-grid-bg opacity-20"
              style={{ pointerEvents: "none" }}
            />
            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: "rgba(201, 162, 39, 0.1)",
                  border: "1px solid rgba(201, 162, 39, 0.3)",
                }}
              >
                <Building2 size={16} style={{ color: "var(--bank-gold)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--bank-gold)" }}>
                  للبنوك والمؤسسات المالية
                </span>
              </div>

              <h2
                className="text-3xl md:text-4xl font-black mb-4"
                style={{
                  fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                  color: "var(--bank-text-primary)",
                }}
              >
                هل أنت بنك أو مؤسسة مالية ؟
              </h2>
              <p
                className="text-lg mb-8 max-w-2xl mx-auto"
                style={{ color: "var(--bank-text-secondary)" }}
              >
                دمّج معك AI في منصتك الرقمية وامنح عملاءك تجربة مدير حساب ذكي
                متخصص بمنتجاتك وخدماتك.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/b2b"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold btn-gold"
                >
                  <Users size={20} />
                  تواصل معنا
                </Link>
                <Link
                  href="/b2b"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold btn-outline-gold"
                >
                  <BarChart3 size={20} />
                  اعرف أكثر
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
