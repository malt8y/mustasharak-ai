import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Bot, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/calculator", label: "حاسبة الأهلية" },
  { href: "/assistant", label: "المساعد الذكي" },
  { href: "/employers", label: "جهات العمل" },
  { href: "/glossary", label: "المفاهيم المالية" },
  { href: "/b2b", label: "للبنوك" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
        style={{
          background: isScrolled
            ? "rgba(5, 13, 10, 0.95)"
            : "rgba(5, 13, 10, 0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: isScrolled
            ? "1px solid rgba(26, 61, 37, 0.8)"
            : "1px solid rgba(26, 61, 37, 0.3)",
          boxShadow: isScrolled
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "none",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #a07d1a, #c9a227)",
                  boxShadow: "0 0 16px rgba(201, 162, 39, 0.3)",
                }}
              >
                <Bot size={18} style={{ color: "#050d0a" }} />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-lg font-bold"
                  style={{
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                    background: "linear-gradient(135deg, #a07d1a, #e8c547)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  معك AI
                </span>
                <span className="text-[10px]" style={{ color: "#6b7d65" }}>
                  بنكك الذكي
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color:
                      location === link.href
                        ? "var(--bank-gold)"
                        : "var(--bank-text-secondary)",
                    background:
                      location === link.href
                        ? "rgba(201, 162, 39, 0.1)"
                        : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (location !== link.href) {
                      (e.target as HTMLElement).style.color = "var(--bank-text-primary)";
                      (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location !== link.href) {
                      (e.target as HTMLElement).style.color = "var(--bank-text-secondary)";
                      (e.target as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/assistant"
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 btn-gold"
              >
                ابدأ الآن
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: "var(--bank-text-secondary)" }}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="القائمة"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className="fixed inset-0 z-40 lg:hidden transition-all duration-300"
        style={{
          opacity: isMobileOpen ? 1 : 0,
          pointerEvents: isMobileOpen ? "all" : "none",
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(5, 13, 10, 0.8)", backdropFilter: "blur(8px)" }}
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className="absolute top-16 right-0 left-0 p-4 transition-all duration-300"
          style={{
            background: "rgba(10, 20, 14, 0.98)",
            borderBottom: "1px solid var(--bank-border)",
            transform: isMobileOpen ? "translateY(0)" : "translateY(-10px)",
          }}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                style={{
                  color:
                    location === link.href
                      ? "var(--bank-gold)"
                      : "var(--bank-text-primary)",
                  background:
                    location === link.href
                      ? "rgba(201, 162, 39, 0.1)"
                      : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--bank-border)" }}>
              <Link
                href="/assistant"
                className="block w-full text-center px-5 py-3 rounded-xl text-base font-bold btn-gold"
              >
                ابدأ مع المساعد الذكي
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
