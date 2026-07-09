import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Search, Building2, CheckCircle, XCircle, Star, Filter } from "lucide-react";

const EMPLOYER_DATA = [
  { id: "1110000", name: "وزارة الداخلية", nameEn: "Ministry of Interior", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1120000", name: "وزارة الدفاع", nameEn: "Ministry of Defense", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1130000", name: "وزارة المالية", nameEn: "Ministry of Finance", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1140000", name: "وزارة الصحة", nameEn: "Ministry of Health", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1150000", name: "وزارة التعليم", nameEn: "Ministry of Education", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1160000", name: "وزارة الموارد البشرية", nameEn: "Ministry of Human Resources", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "5161600", name: "الهيئة الملكية للجبيل وينبع", nameEn: "Royal Commission for Jubail and Yanbu", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1360030", name: "المؤسسة العامة للخطوط الحديدية", nameEn: "Saudi Railways Organization", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1360040", name: "أمانة الأحساء", nameEn: "Alahsa District Municipality", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "5160080", name: "الهيئة السعودية للمواصفات والمقاييس", nameEn: "Saudi Arabian Standards Organization", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1110015", name: "الإدارة العامة للدوريات الأمنية", nameEn: "Patrol Security", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1110025", name: "المديرية العامة لمكافحة المخدرات", nameEn: "General Directorate of Narcotics Control", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1110055", name: "قوة الأمن الخاصة", nameEn: "Special Forces Security", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1110060", name: "قيادة قوات الطوارئ الخاصة", nameEn: "Special Emergency Forces", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1110065", name: "المديرية العامة لحرس الحدود", nameEn: "Bordline Security Directorate", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1230300", name: "الحرس الوطني القطاع الغربي", nameEn: "National Guard Western Region", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1452450", name: "جامعة القصيم", nameEn: "University Al Qaseem", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1161700", name: "وزارة الرياضة", nameEn: "Ministry of Sport", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "5161700", name: "شركة المياه الوطنية", nameEn: "National Water Company", sector: "خاص", grade: "A", status: "Approved", hasOffer: false, offerRate: 0, notes: "لا يوجد قيود" },
  { id: "7163300", name: "الشركة الوطنية للصناعات الزجاجية", nameEn: "National Company for Glass Industries", sector: "خاص", grade: "C", status: "Approved", hasOffer: false, offerRate: 0, notes: "لا يوجد قيود" },
  { id: "1160600", name: "الهيئة العامة للجمارك", nameEn: "Unified National Platform - Customs", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "عمل استفسار مع جهة العمل للتأكد من صحة البيانات" },
  { id: "5160090", name: "هيئة تنظيم المياه والكهرباء", nameEn: "Water & Electricity Regulatory Authority", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "5160085", name: "جمعية الأطفال ذوي الإعاقة", nameEn: "Association for Children with Disabilities", sector: "شبه حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1360060", name: "ميناء الملك عبد العزيز", nameEn: "King Abdulaziz Port", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
  { id: "1360080", name: "هيئة الهلال الأحمر السعودي - المنطقة الشرقية", nameEn: "Saudi Red Crescent - Eastern Region", sector: "حكومي", grade: "A", status: "Approved", hasOffer: true, offerRate: 0.045, notes: "لا يوجد قيود" },
];

const SECTORS = ["الكل", "حكومي", "شبه حكومي", "خاص"];
const GRADES = ["الكل", "A", "B", "C"];

export default function Employers() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("الكل");
  const [grade, setGrade] = useState("الكل");
  const [showOfferOnly, setShowOfferOnly] = useState(false);

  const filtered = useMemo(() => {
    return EMPLOYER_DATA.filter((e) => {
      const matchSearch =
        !search ||
        e.name.includes(search) ||
        e.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        e.id.includes(search);
      const matchSector = sector === "الكل" || e.sector === sector;
      const matchGrade = grade === "الكل" || e.grade === grade;
      const matchOffer = !showOfferOnly || e.hasOffer;
      return matchSearch && matchSector && matchGrade && matchOffer;
    });
  }, [search, sector, grade, showOfferOnly]);

  const sectorColor = (s: string) => {
    if (s === "حكومي") return "#22c55e";
    if (s === "شبه حكومي") return "#3b82f6";
    return "#c9a227";
  };

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
            <Building2 size={16} style={{ color: "var(--bank-gold)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--bank-gold)" }}>
              جهات العمل المعتمدة
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black mb-3"
            style={{
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              color: "var(--bank-text-primary)",
            }}
          >
            ابحث عن جهة عملك
          </h1>
          <p className="text-lg" style={{ color: "var(--bank-text-secondary)" }}>
            اعرف هل جهة عملك معتمدة وما هي العروض المتاحة لك
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "إجمالي الجهات", value: EMPLOYER_DATA.length },
            { label: "جهات حكومية", value: EMPLOYER_DATA.filter((e) => e.sector === "حكومي").length },
            { label: "لديها عروض", value: EMPLOYER_DATA.filter((e) => e.hasOffer).length },
            { label: "تصنيف A", value: EMPLOYER_DATA.filter((e) => e.grade === "A").length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bank-card p-4 text-center"
            >
              <div
                className="text-2xl font-black mb-1"
                style={{ color: "var(--bank-gold)", fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
              >
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "var(--bank-text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bank-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ right: "14px", color: "var(--bank-text-muted)" }}
              />
              <input
                type="text"
                placeholder="ابحث باسم الجهة أو الرقم..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 text-sm bank-input"
              />
            </div>

            {/* Sector Filter */}
            <div className="flex gap-2 flex-wrap">
              {SECTORS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: sector === s ? "rgba(201,162,39,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${sector === s ? "rgba(201,162,39,0.5)" : "var(--bank-border)"}`,
                    color: sector === s ? "var(--bank-gold)" : "var(--bank-text-muted)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Offer Filter */}
            <button
              onClick={() => setShowOfferOnly(!showOfferOnly)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: showOfferOnly ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${showOfferOnly ? "rgba(34,197,94,0.4)" : "var(--bank-border)"}`,
                color: showOfferOnly ? "#22c55e" : "var(--bank-text-muted)",
              }}
            >
              <Star size={12} />
              لديها عروض فقط
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm" style={{ color: "var(--bank-text-muted)" }}>
          {filtered.length} جهة عمل
        </div>

        {/* Table */}
        <div className="bank-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--bank-border)", background: "rgba(13,61,34,0.3)" }}>
                  {["رقم الجهة", "اسم الجهة", "القطاع", "التصنيف", "الحالة", "العرض"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-right font-bold text-xs"
                      style={{ color: "var(--bank-gold)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, i) => (
                  <tr
                    key={emp.id}
                    style={{
                      borderBottom: "1px solid rgba(26,61,37,0.4)",
                      background: i % 2 === 0 ? "transparent" : "rgba(13,61,34,0.1)",
                    }}
                  >
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--bank-text-muted)" }}>
                      {emp.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: "var(--bank-text-primary)" }}>
                        {emp.name}
                      </div>
                      <div className="text-xs" style={{ color: "var(--bank-text-muted)" }}>
                        {emp.nameEn}
                      </div>
                      {emp.notes !== "لا يوجد قيود" && (
                        <div className="text-xs mt-0.5" style={{ color: "#eab308" }}>
                          ⚠️ {emp.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: `${sectorColor(emp.sector)}15`,
                          color: sectorColor(emp.sector),
                          border: `1px solid ${sectorColor(emp.sector)}30`,
                        }}
                      >
                        {emp.sector}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                        style={{
                          background: emp.grade === "A" ? "rgba(34,197,94,0.15)" : "rgba(201,162,39,0.15)",
                          color: emp.grade === "A" ? "#22c55e" : "var(--bank-gold)",
                          display: "inline-flex",
                        }}
                      >
                        {emp.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {emp.status === "Approved" ? (
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#22c55e" }}>
                          <CheckCircle size={14} />
                          معتمدة
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#ef4444" }}>
                          <XCircle size={14} />
                          موقوفة
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {emp.hasOffer ? (
                        <div>
                          <div className="text-xs font-bold" style={{ color: "var(--bank-gold)" }}>
                            {(emp.offerRate * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs" style={{ color: "var(--bank-text-muted)" }}>
                            معدل خاص
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--bank-text-muted)" }}>
                          لا يوجد عرض
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Building2 size={40} style={{ color: "var(--bank-text-muted)", margin: "0 auto 12px" }} />
              <p style={{ color: "var(--bank-text-secondary)" }}>لا توجد نتائج مطابقة</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div
          className="mt-6 p-4 rounded-xl text-sm text-center"
          style={{
            background: "rgba(201, 162, 39, 0.05)",
            border: "1px solid rgba(201, 162, 39, 0.15)",
            color: "var(--bank-text-muted)",
          }}
        >
          البيانات الواردة استرشادية فقط. تواصل مع البنك للتأكد من العروض والشروط الفعلية.
        </div>
      </div>
    </div>
  );
}
