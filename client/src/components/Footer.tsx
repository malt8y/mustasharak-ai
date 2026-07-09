import { Link } from "wouter";
import { Bot, Shield, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bank-green-darkest)",
        borderTop: "1px solid var(--bank-border)",
      }}
    >
      {/* Legal Warning Banner */}
      <div
        className="py-3 px-4 text-center text-sm"
        style={{
          background: "rgba(201, 162, 39, 0.06)",
          borderBottom: "1px solid rgba(201, 162, 39, 0.15)",
          color: "var(--bank-text-secondary)",
        }}
      >
        <Shield size={14} className="inline ml-1.5 mb-0.5" style={{ color: "var(--bank-gold)" }} />
        <span>
          المعلومات الواردة في هذه المنصة استرشادية فقط ولا تُعدّ استشارة مالية رسمية.
          تواصل مع البنك للتأكيد من الشروط والأسعار الفعلية.
        </span>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #a07d1a, #c9a227)",
                }}
              >
                <Bot size={20} style={{ color: "#050d0a" }} />
              </div>
              <div>
                <div
                  className="text-xl font-bold"
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
                <div className="text-xs" style={{ color: "var(--bank-text-muted)" }}>
                  مساعدك المالي الذكي
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--bank-text-secondary)" }}>
              مدير حسابك الرقمي الذكي — متاح 24/7 ليجاوب على كل أسئلتك المالية
              ويساعدك تتخذ قرارات واثقة.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4
              className="font-bold mb-4 text-sm"
              style={{ color: "var(--bank-gold)" }}
            >
              الخدمات
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/calculator", label: "حاسبة الأهلية" },
                { href: "/assistant", label: "المساعد الذكي" },
                { href: "/employers", label: "جهات العمل" },
                { href: "/glossary", label: "المفاهيم المالية" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--bank-text-secondary)" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--bank-gold)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--bank-text-secondary)")
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4
              className="font-bold mb-4 text-sm"
              style={{ color: "var(--bank-gold)" }}
            >
              معلومات
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/b2b", label: "للبنوك والمؤسسات" },
                { href: "/privacy", label: "سياسة الخصوصية" },
                { href: "/terms", label: "الشروط والأحكام" },
                { href: "/contact", label: "تواصل معنا" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--bank-text-secondary)" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--bank-gold)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--bank-text-secondary)")
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-bold mb-4 text-sm"
              style={{ color: "var(--bank-gold)" }}
            >
              تواصل معنا
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(201, 162, 39, 0.1)" }}
                >
                  <Phone size={14} style={{ color: "var(--bank-gold)" }} />
                </div>
                <span className="text-sm" style={{ color: "var(--bank-text-secondary)" }}>
                  920000000
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(201, 162, 39, 0.1)" }}
                >
                  <Mail size={14} style={{ color: "var(--bank-gold)" }} />
                </div>
                <span className="text-sm" style={{ color: "var(--bank-text-secondary)" }}>
                  info@maaka-ai.sa
                </span>
              </li>
            </ul>

            {/* SAMA Badge */}
            <div
              className="mt-5 p-3 rounded-xl text-xs text-center"
              style={{
                background: "rgba(13, 61, 34, 0.4)",
                border: "1px solid var(--bank-border)",
                color: "var(--bank-text-muted)",
              }}
            >
              مبني على معايير ساما<br />
              <span style={{ color: "var(--bank-gold-muted)" }}>البنك المركزي السعودي</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="py-4 px-4 text-center text-xs"
        style={{
          borderTop: "1px solid var(--bank-border)",
          color: "var(--bank-text-muted)",
        }}
      >
        © {new Date().getFullYear()} معك AI — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
