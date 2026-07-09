import { useState } from "react";
import { BookOpen, Search, ChevronDown, ChevronUp } from "lucide-react";

const terms = [
  {
    term: "DBR",
    fullName: "نسبة الدين للدخل",
    category: "أساسي",
    definition:
      "هي النسبة المئوية من دخلك الشهري الصافي التي تذهب لسداد الديون والالتزامات. تُحسب بقسمة إجمالي الأقساط الشهرية على الدخل الصافي. ساما تحدد حدودًا قصوى لهذه النسبة.",
    example: "إذا راتبك الصافي 10,000 وأقساطك 4,000 — نسبة DBR هي 40%.",
    color: "#c9a227",
  },
  {
    term: "ساما",
    fullName: "البنك المركزي السعودي",
    category: "جهة رقابية",
    definition:
      "Saudi Central Bank — الجهة الرقابية الرسمية على القطاع المصرفي والمالي في المملكة العربية السعودية. تُصدر ساما اللوائح والتعليمات التي تلتزم بها جميع البنوك والمؤسسات المالية.",
    example: "ساما هي من تحدد الحد الأقصى لنسبة DBR وشروط التمويل.",
    color: "#22c55e",
  },
  {
    term: "المرابحة",
    fullName: "تمويل المرابحة",
    category: "منتج تمويلي",
    definition:
      "أسلوب تمويل إسلامي يقوم على أساس البيع بالتكلفة مضافًا إليها ربح معلوم. البنك يشتري السلعة أو العقار ثم يبيعه للعميل بسعر أعلى يُسدَّد على أقساط. الربح محدد مسبقًا ولا يتغير.",
    example: "تريد سيارة بـ 100,000 ريال — البنك يشتريها ويبيعك إياها بـ 120,000 على 60 شهرًا.",
    color: "#3b82f6",
  },
  {
    term: "الإجارة",
    fullName: "تمويل الإجارة المنتهية بالتمليك",
    category: "منتج تمويلي",
    definition:
      "أسلوب تمويل إسلامي يقوم على التأجير مع خيار التملك في النهاية. البنك يشتري الأصل (سيارة أو عقار) ويؤجره للعميل بأقساط شهرية، وفي نهاية العقد ينتقل الملكية للعميل.",
    example: "تستأجر سيارة لمدة 5 سنوات بقسط شهري، وفي النهاية تصبح ملكك.",
    color: "#a855f7",
  },
  {
    term: "التمويل الشخصي",
    fullName: "القرض الشخصي",
    category: "منتج تمويلي",
    definition:
      "تمويل نقدي يُمنح للأفراد لأغراض شخصية متنوعة. يُحسب ضمن الالتزامات الشخصية في DBR بحد أقصى 33% من الدخل الصافي. المدة القصوى عادةً 60 شهرًا.",
    example: "تحتاج 50,000 ريال لتجديد منزلك — البنك يمولك وتسدد على 48 شهرًا.",
    color: "#f97316",
  },
  {
    term: "التمويل العقاري",
    fullName: "تمويل شراء العقار",
    category: "منتج تمويلي",
    definition:
      "تمويل مخصص لشراء أو بناء أو تطوير العقارات السكنية. يرفع الحد الأقصى لـ DBR من 45% إلى 55% أو أكثر حسب الحالة. إذا كان مدعومًا من صندوق التنمية العقارية يرتفع الحد إلى 65%.",
    example: "تشتري شقة بـ 500,000 ريال بتمويل عقاري على 20 سنة.",
    color: "#22c55e",
  },
  {
    term: "صندوق التنمية العقارية",
    fullName: "Real Estate Development Fund",
    category: "جهة داعمة",
    definition:
      "صندوق حكومي سعودي يدعم المواطنين في تملك المساكن. الحصول على دعم الصندوق يرفع حد DBR الإجمالي إلى 65% بدلًا من 55% للتمويل العقاري غير المدعوم.",
    example: "إذا حصلت على دعم الصندوق، يرتفع حدك من 55% إلى 65%.",
    color: "#c9a227",
  },
  {
    term: "الحد الائتماني",
    fullName: "Credit Limit",
    category: "بطاقات ائتمانية",
    definition:
      "الحد الأقصى للمبلغ المسموح باستخدامه في البطاقة الائتمانية. ساما تُلزم البنوك باحتساب 5% من الحد الائتماني ضمن التزامات DBR — وليس الرصيد المستخدم فعليًا.",
    example: "بطاقة بحد 20,000 ريال تُضاف 1,000 ريال (5%) لالتزاماتك حتى لو لم تستخدمها.",
    color: "#ef4444",
  },
  {
    term: "الراتب الإجمالي",
    fullName: "Gross Salary",
    category: "دخل",
    definition:
      "الراتب الكامل قبل خصم أي اشتراكات أو تأمينات. في حسابات DBR، يُخصم منه 9.75% كاشتراكات التأمينات الاجتماعية للحصول على الراتب الصافي المحتسب.",
    example: "راتب إجمالي 12,000 ريال → صافي محتسب = 12,000 × (1 - 9.75%) = 10,830 ريال.",
    color: "#3b82f6",
  },
  {
    term: "الراتب الصافي",
    fullName: "Net Salary",
    category: "دخل",
    definition:
      "الراتب بعد خصم جميع الاشتراكات والتأمينات. هذا هو الأساس المستخدم في حسابات DBR مباشرةً دون أي خصومات إضافية.",
    example: "إذا أدخلت الراتب الصافي مباشرةً، يُستخدم كما هو في الحساب.",
    color: "#22c55e",
  },
  {
    term: "التمويل التأجيري للسيارات",
    fullName: "Auto Lease Financing",
    category: "منتج تمويلي",
    definition:
      "تمويل إجاري لشراء السيارات. يُحتسب ضمن الالتزامات غير العقارية في حسابات DBR. الحد الأقصى لهذه الالتزامات مجتمعةً 45% من الدخل (أو أكثر للرواتب المرتفعة).",
    example: "قسط سيارتك الشهري يُضاف لالتزاماتك غير العقارية.",
    color: "#f97316",
  },
  {
    term: "تمويل الأسهم بالمرابحة",
    fullName: "Stock Murabaha Financing",
    category: "منتج تمويلي",
    definition:
      "تمويل لشراء الأسهم والأوراق المالية عبر عقد المرابحة الإسلامي. يُحتسب ضمن الالتزامات غير العقارية في حسابات DBR.",
    example: "تمول شراء أسهم بـ 100,000 ريال وتسدد القسط الشهري.",
    color: "#a855f7",
  },
];

const categories = ["الكل", "أساسي", "منتج تمويلي", "جهة رقابية", "جهة داعمة", "بطاقات ائتمانية", "دخل"];

export default function Glossary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = terms.filter((t) => {
    const matchSearch =
      !search ||
      t.term.includes(search) ||
      t.fullName.includes(search) ||
      t.definition.includes(search);
    const matchCat = category === "الكل" || t.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div dir="rtl" className="py-8">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              background: "rgba(201, 162, 39, 0.1)",
              border: "1px solid rgba(201, 162, 39, 0.3)",
            }}
          >
            <BookOpen size={16} style={{ color: "var(--bank-gold)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--bank-gold)" }}>
              بأسلوب سعودي واضح
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black mb-3"
            style={{
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              color: "var(--bank-text-primary)",
            }}
          >
            المفاهيم المالية المصرفية
          </h1>
          <p className="text-lg" style={{ color: "var(--bank-text-secondary)" }}>
            شرح مبسط لكل المصطلحات اللي تحتاجها تفهمها قبل ما تاخذ أي قرار مالي
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ right: "14px", color: "var(--bank-text-muted)" }}
            />
            <input
              type="text"
              placeholder="ابحث عن مصطلح..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-3 text-sm bank-input"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: category === cat ? "rgba(201,162,39,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${category === cat ? "rgba(201,162,39,0.5)" : "var(--bank-border)"}`,
                  color: category === cat ? "var(--bank-gold)" : "var(--bank-text-muted)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <div
              key={t.term}
              className="bank-card overflow-hidden transition-all duration-200"
              style={{ borderColor: expanded === t.term ? `${t.color}40` : "var(--bank-border)" }}
            >
              <button
                className="w-full p-5 text-right flex items-start justify-between gap-3"
                onClick={() => setExpanded(expanded === t.term ? null : t.term)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black"
                    style={{
                      background: `${t.color}15`,
                      border: `1px solid ${t.color}30`,
                      color: t.color,
                      fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                    }}
                  >
                    {t.term.slice(0, 2)}
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color: "var(--bank-text-primary)" }}>
                      {t.term}
                    </div>
                    <div className="text-sm" style={{ color: "var(--bank-text-secondary)" }}>
                      {t.fullName}
                    </div>
                    <span
                      className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs"
                      style={{
                        background: `${t.color}10`,
                        color: t.color,
                        border: `1px solid ${t.color}20`,
                      }}
                    >
                      {t.category}
                    </span>
                  </div>
                </div>
                <div style={{ color: "var(--bank-text-muted)", flexShrink: 0, marginTop: "4px" }}>
                  {expanded === t.term ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {expanded === t.term && (
                <div
                  className="px-5 pb-5 animate-fade-in-up"
                  style={{ borderTop: "1px solid var(--bank-border)" }}
                >
                  <p className="text-sm leading-relaxed mt-4" style={{ color: "var(--bank-text-secondary)" }}>
                    {t.definition}
                  </p>
                  <div
                    className="mt-4 p-3 rounded-xl text-sm"
                    style={{
                      background: `${t.color}08`,
                      border: `1px solid ${t.color}20`,
                    }}
                  >
                    <span className="font-bold" style={{ color: t.color }}>مثال: </span>
                    <span style={{ color: "var(--bank-text-secondary)" }}>{t.example}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={40} style={{ color: "var(--bank-text-muted)", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--bank-text-secondary)" }}>لا توجد نتائج مطابقة</p>
          </div>
        )}
      </div>
    </div>
  );
}
