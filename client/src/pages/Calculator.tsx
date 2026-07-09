import { useState, useCallback } from "react";
import { Link } from "wouter";
import {
  Calculator as CalcIcon,
  Plus,
  Trash2,
  Bot,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ===== DBR Calculation Logic (SAMA Standards) =====
interface CreditCard {
  id: string;
  name: string;
  limit: number;
}

interface DBRInput {
  salaryMode: "gross" | "net";
  grossSalary: number;
  netSalary: number;
  additionalIncome24: number;
  personalLoan: number;
  realEstateLoan: number;
  isRealEstateSupported: boolean;
  carLoan: number;
  stockFinancing: number;
  creditCards: CreditCard[];
  otherObligations: number;
}

interface DBRResult {
  netIncome: number;
  totalIncome: number;
  creditCardObligation: number;
  nonRealEstateObligations: number;
  totalObligations: number;
  currentDBR: number;
  maxTotalDBR: number;
  maxPersonalDBR: number;
  maxNonRealEstateDBR: number;
  maxTotalAmount: number;
  maxPersonalAmount: number;
  maxNonRealEstateAmount: number;
  remainingPersonal: number;
  remainingTotal: number;
  remainingNonRealEstate: number;
  maxAdditionalMonthly: number;
  maxAdditionalLoan60: number;
  canBorrow: boolean;
  scenario: string;
  scenarioColor: string;
}

function calculateDBR(input: DBRInput): DBRResult {
  // 1. Net salary
  const netIncome =
    input.salaryMode === "net"
      ? input.netSalary
      : input.grossSalary * (1 - 0.0975);

  // 2. Additional income (50% of monthly average over 24 months)
  const additionalIncome =
    input.additionalIncome24 > 0
      ? (input.additionalIncome24 / 24) * 0.5
      : 0;
  const totalIncome = netIncome + additionalIncome;

  // 3. Credit cards: 5% of limit
  const creditCardObligation = input.creditCards.reduce(
    (sum, c) => sum + c.limit * 0.05,
    0
  );

  // 4. Classify obligations
  const nonRealEstateObligations =
    input.personalLoan +
    input.carLoan +
    input.stockFinancing +
    creditCardObligation +
    input.otherObligations;
  const totalObligations = input.realEstateLoan + nonRealEstateObligations;

  // 5. Determine limits by scenario
  let maxTotalDBR = 45;
  let scenario = "بدون تمويل عقاري";
  let scenarioColor = "#22c55e";

  if (input.realEstateLoan > 0) {
    if (input.isRealEstateSupported) {
      maxTotalDBR = 65;
      scenario = "عقاري مدعوم من صندوق التنمية";
      scenarioColor = "#22c55e";
    } else if (totalIncome >= 25000) {
      maxTotalDBR = 70;
      scenario = "عقاري غير مدعوم + راتب فوق 25,000";
      scenarioColor = "#3b82f6";
    } else if (totalIncome >= 15000) {
      maxTotalDBR = 65;
      scenario = "عقاري غير مدعوم + راتب فوق 15,000";
      scenarioColor = "#a855f7";
    } else {
      maxTotalDBR = 55;
      scenario = "عقاري غير مدعوم";
      scenarioColor = "#f97316";
    }
  } else {
    if (totalIncome >= 25000) {
      maxTotalDBR = 70;
      scenario = "راتب فوق 25,000 (بدون عقاري)";
      scenarioColor = "#3b82f6";
    }
  }

  const maxPersonalDBR = 33;
  const maxNonRealEstateDBR = totalIncome >= 25000 ? maxTotalDBR : 45;

  // 6. Calculate available amounts
  const maxTotalAmount = totalIncome * (maxTotalDBR / 100);
  const maxPersonalAmount = totalIncome * (maxPersonalDBR / 100);
  const maxNonRealEstateAmount = totalIncome * (maxNonRealEstateDBR / 100);

  const remainingPersonal = maxPersonalAmount - input.personalLoan;
  const remainingTotal = maxTotalAmount - totalObligations;
  const remainingNonRealEstate =
    maxNonRealEstateAmount - nonRealEstateObligations;

  const maxAdditionalMonthly = Math.min(
    Math.max(remainingPersonal, 0),
    Math.max(remainingTotal, 0),
    Math.max(remainingNonRealEstate, 0)
  );
  const maxAdditionalLoan60 = maxAdditionalMonthly * 60;

  const currentDBR = totalIncome > 0 ? (totalObligations / totalIncome) * 100 : 0;
  const canBorrow = maxAdditionalMonthly > 0;

  return {
    netIncome,
    totalIncome,
    creditCardObligation,
    nonRealEstateObligations,
    totalObligations,
    currentDBR,
    maxTotalDBR,
    maxPersonalDBR,
    maxNonRealEstateDBR,
    maxTotalAmount,
    maxPersonalAmount,
    maxNonRealEstateAmount,
    remainingPersonal,
    remainingTotal,
    remainingNonRealEstate,
    maxAdditionalMonthly,
    maxAdditionalLoan60,
    canBorrow,
    scenario,
    scenarioColor,
  };
}

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("ar-SA");
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor =
    pct < 60 ? "var(--progress-green, #22c55e)"
    : pct < 85 ? "#eab308"
    : "#ef4444";

  return (
    <div className="relative">
      <div
        className="w-full h-3 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: barColor,
            boxShadow: `0 0 8px ${barColor}60`,
          }}
        />
      </div>
      <div
        className="absolute -top-1 transition-all duration-700"
        style={{
          left: `${pct}%`,
          transform: "translateX(-50%)",
        }}
      >
        <div
          className="w-5 h-5 rounded-full border-2 border-background"
          style={{ background: barColor }}
        />
      </div>
    </div>
  );
}

export default function Calculator() {
  const [salaryMode, setSalaryMode] = useState<"gross" | "net">("gross");
  const [grossSalary, setGrossSalary] = useState(0);
  const [netSalary, setNetSalary] = useState(0);
  const [additionalIncome24, setAdditionalIncome24] = useState(0);
  const [personalLoan, setPersonalLoan] = useState(0);
  const [realEstateLoan, setRealEstateLoan] = useState(0);
  const [isRealEstateSupported, setIsRealEstateSupported] = useState(false);
  const [carLoan, setCarLoan] = useState(0);
  const [stockFinancing, setStockFinancing] = useState(0);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [otherObligations, setOtherObligations] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const addCard = () => {
    setCreditCards((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", limit: 0 },
    ]);
  };

  const removeCard = (id: string) => {
    setCreditCards((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCard = (id: string, field: "name" | "limit", value: string | number) => {
    setCreditCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const input: DBRInput = {
    salaryMode,
    grossSalary,
    netSalary,
    additionalIncome24,
    personalLoan,
    realEstateLoan,
    isRealEstateSupported,
    carLoan,
    stockFinancing,
    creditCards,
    otherObligations,
  };

  const hasInput = grossSalary > 0 || netSalary > 0;
  const result = hasInput ? calculateDBR(input) : null;

  const dbrColor =
    !result ? "#6b7d65"
    : result.currentDBR < 60 ? "#22c55e"
    : result.currentDBR < 85 ? "#eab308"
    : "#ef4444";

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
            <CalcIcon size={16} style={{ color: "var(--bank-gold)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--bank-gold)" }}>
              وفق معايير ساما السعودية
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black mb-3"
            style={{
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              color: "var(--bank-text-primary)",
            }}
          >
            حاسبة الأهلية الائتمانية
          </h1>
          <p className="text-lg" style={{ color: "var(--bank-text-secondary)" }}>
            احسب نسبة الدين للدخل (DBR) بدقة تامة واعرف كم تقدر تستلف
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-5">
            {/* Salary Section */}
            <div className="bank-card p-5">
              <h3
                className="font-bold mb-4 flex items-center gap-2"
                style={{ color: "var(--bank-gold)", fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "rgba(201,162,39,0.2)", color: "var(--bank-gold)" }}>
                  1
                </span>
                الراتب الشهري
              </h3>

              {/* Toggle */}
              <div
                className="flex rounded-xl p-1 mb-4"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                {(["gross", "net"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSalaryMode(mode)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      background: salaryMode === mode ? "var(--bank-gold)" : "transparent",
                      color: salaryMode === mode ? "var(--bank-green-darkest)" : "var(--bank-text-secondary)",
                    }}
                  >
                    {mode === "gross" ? "راتب إجمالي" : "راتب صافي"}
                  </button>
                ))}
              </div>

              {salaryMode === "gross" ? (
                <div>
                  <label className="block text-sm mb-2" style={{ color: "var(--bank-text-secondary)" }}>
                    الراتب الإجمالي (ريال)
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 12000"
                    value={grossSalary || ""}
                    onChange={(e) => setGrossSalary(Number(e.target.value))}
                    className="w-full px-4 py-3 text-base bank-input"
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                  {grossSalary > 0 && (
                    <div
                      className="mt-2 px-3 py-2 rounded-lg text-sm"
                      style={{
                        background: "rgba(34, 197, 94, 0.08)",
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                        color: "#22c55e",
                      }}
                    >
                      الصافي بعد التأمينات (9.75%) :{" "}
                      <strong>{formatNumber(grossSalary * (1 - 0.0975))} ريال</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm mb-2" style={{ color: "var(--bank-text-secondary)" }}>
                    الراتب الصافي (ريال)
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 10830"
                    value={netSalary || ""}
                    onChange={(e) => setNetSalary(Number(e.target.value))}
                    className="w-full px-4 py-3 text-base bank-input"
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                </div>
              )}

              {/* Additional Income */}
              <div className="mt-4">
                <label className="block text-sm mb-2" style={{ color: "var(--bank-text-secondary)" }}>
                  دخل إضافي يمكن إثباته (إجمالي 24 شهر) — اختياري
                </label>
                <input
                  type="number"
                  placeholder="مثال: 60000"
                  value={additionalIncome24 || ""}
                  onChange={(e) => setAdditionalIncome24(Number(e.target.value))}
                  className="w-full px-4 py-3 text-sm bank-input"
                  style={{ direction: "ltr", textAlign: "right" }}
                />
                <p className="text-xs mt-1.5" style={{ color: "var(--bank-text-muted)" }}>
                  يُحتسب 50% من المتوسط الشهري لآخر 24 شهر
                </p>
              </div>
            </div>

            {/* Obligations Section */}
            <div className="bank-card p-5">
              <h3
                className="font-bold mb-4 flex items-center gap-2"
                style={{ color: "var(--bank-gold)", fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "rgba(201,162,39,0.2)", color: "var(--bank-gold)" }}>
                  2
                </span>
                الالتزامات الحالية
              </h3>

              <div className="space-y-4">
                {/* Personal Loan */}
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: "var(--bank-text-secondary)" }}>
                    تمويل شخصي (القسط الشهري)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={personalLoan || ""}
                    onChange={(e) => setPersonalLoan(Number(e.target.value))}
                    className="w-full px-4 py-3 text-sm bank-input"
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                </div>

                {/* Real Estate Loan */}
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: "var(--bank-text-secondary)" }}>
                    تمويل عقاري (القسط الشهري)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={realEstateLoan || ""}
                    onChange={(e) => setRealEstateLoan(Number(e.target.value))}
                    className="w-full px-4 py-3 text-sm bank-input"
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                  {realEstateLoan > 0 && (
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-sm" style={{ color: "var(--bank-text-secondary)" }}>
                        هل هو مدعوم من صندوق التنمية العقارية؟
                      </span>
                      <div className="flex gap-2">
                        {[true, false].map((val) => (
                          <button
                            key={String(val)}
                            onClick={() => setIsRealEstateSupported(val)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{
                              background: isRealEstateSupported === val
                                ? "rgba(201,162,39,0.2)"
                                : "rgba(255,255,255,0.05)",
                              border: `1px solid ${isRealEstateSupported === val ? "rgba(201,162,39,0.5)" : "var(--bank-border)"}`,
                              color: isRealEstateSupported === val ? "var(--bank-gold)" : "var(--bank-text-muted)",
                            }}
                          >
                            {val ? "نعم" : "لا"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Car Loan */}
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: "var(--bank-text-secondary)" }}>
                    تمويل تأجيري للسيارة (القسط الشهري)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={carLoan || ""}
                    onChange={(e) => setCarLoan(Number(e.target.value))}
                    className="w-full px-4 py-3 text-sm bank-input"
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                </div>

                {/* Stock Financing */}
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: "var(--bank-text-secondary)" }}>
                    تمويل أسهم بالمرابحة (القسط الشهري)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={stockFinancing || ""}
                    onChange={(e) => setStockFinancing(Number(e.target.value))}
                    className="w-full px-4 py-3 text-sm bank-input"
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                </div>

                {/* Credit Cards */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm" style={{ color: "var(--bank-text-secondary)" }}>
                      البطاقات الائتمانية
                    </label>
                    <button
                      onClick={addCard}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: "rgba(201,162,39,0.1)",
                        border: "1px solid rgba(201,162,39,0.3)",
                        color: "var(--bank-gold)",
                      }}
                    >
                      <Plus size={12} />
                      إضافة بطاقة
                    </button>
                  </div>

                  {creditCards.length > 0 && (
                    <div className="space-y-2">
                      {creditCards.map((card) => (
                        <div key={card.id} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="اسم البطاقة"
                            value={card.name}
                            onChange={(e) => updateCard(card.id, "name", e.target.value)}
                            className="flex-1 px-3 py-2 text-sm bank-input"
                          />
                          <input
                            type="number"
                            placeholder="الحد الائتماني"
                            value={card.limit || ""}
                            onChange={(e) => updateCard(card.id, "limit", Number(e.target.value))}
                            className="w-32 px-3 py-2 text-sm bank-input"
                            style={{ direction: "ltr", textAlign: "right" }}
                          />
                          <button
                            onClick={() => removeCard(card.id)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "#ef4444" }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <p className="text-xs" style={{ color: "var(--bank-text-muted)" }}>
                        يُحتسب 5% من الحد الائتماني (وليس الرصيد المستخدم)
                      </p>
                    </div>
                  )}
                </div>

                {/* Other */}
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: "var(--bank-text-secondary)" }}>
                    التزامات أخرى (القسط الشهري)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={otherObligations || ""}
                    onChange={(e) => setOtherObligations(Number(e.target.value))}
                    className="w-full px-4 py-3 text-sm bank-input"
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-5">
            {!hasInput ? (
              <div
                className="bank-card p-10 text-center"
                style={{ minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
              >
                <CalcIcon size={48} style={{ color: "var(--bank-text-muted)", marginBottom: "16px" }} />
                <p className="text-lg font-medium mb-2" style={{ color: "var(--bank-text-secondary)" }}>
                  أدخل راتبك لتبدأ الحساب
                </p>
                <p className="text-sm" style={{ color: "var(--bank-text-muted)" }}>
                  ستظهر النتائج هنا فور إدخال البيانات
                </p>
              </div>
            ) : result ? (
              <>
                {/* Scenario Card */}
                <div
                  className="bank-card p-5"
                  style={{ borderColor: `${result.scenarioColor}40` }}
                >
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3"
                    style={{
                      background: `${result.scenarioColor}15`,
                      border: `1px solid ${result.scenarioColor}30`,
                      color: result.scenarioColor,
                    }}
                  >
                    {result.scenario}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span style={{ color: "var(--bank-text-muted)" }}>الدخل الصافي</span>
                      <div className="font-bold number-display" style={{ color: "var(--bank-text-primary)" }}>
                        {formatNumber(result.netIncome)} ريال
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "var(--bank-text-muted)" }}>الدخل المحتسب</span>
                      <div className="font-bold number-display" style={{ color: "var(--bank-text-primary)" }}>
                        {formatNumber(result.totalIncome)} ريال
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "var(--bank-text-muted)" }}>إجمالي الالتزامات</span>
                      <div className="font-bold number-display" style={{ color: "#ef4444" }}>
                        {formatNumber(result.totalObligations)} ريال
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "var(--bank-text-muted)" }}>الحد الأقصى المسموح</span>
                      <div className="font-bold number-display" style={{ color: result.scenarioColor }}>
                        {result.maxTotalDBR}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* DBR Progress */}
                <div className="bank-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold" style={{ color: "var(--bank-text-primary)" }}>
                      نسبة الدين للدخل (DBR)
                    </h3>
                    <span
                      className="text-2xl font-black number-display"
                      style={{ color: dbrColor }}
                    >
                      {result.currentDBR.toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={result.currentDBR}
                    max={result.maxTotalDBR}
                    color={dbrColor}
                  />
                  <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--bank-text-muted)" }}>
                    <span>0%</span>
                    <span>الحد الأقصى: {result.maxTotalDBR}%</span>
                  </div>
                </div>

                {/* Limits Table */}
                <div className="bank-card p-5">
                  <h3 className="font-bold mb-4" style={{ color: "var(--bank-text-primary)" }}>
                    جدول الحدود الثلاثة
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--bank-border)" }}>
                          <th className="pb-2 text-right font-medium" style={{ color: "var(--bank-text-muted)" }}>الحد</th>
                          <th className="pb-2 text-center font-medium" style={{ color: "var(--bank-text-muted)" }}>النسبة</th>
                          <th className="pb-2 text-left font-medium" style={{ color: "var(--bank-text-muted)" }}>المبلغ الشهري</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: "الإجمالي", pct: result.maxTotalDBR, amount: result.maxTotalAmount },
                          { label: "الشخصي", pct: result.maxPersonalDBR, amount: result.maxPersonalAmount },
                          { label: "غير العقاري", pct: result.maxNonRealEstateDBR, amount: result.maxNonRealEstateAmount },
                        ].map((row) => (
                          <tr key={row.label} style={{ borderBottom: "1px solid rgba(26,61,37,0.5)" }}>
                            <td className="py-2.5 font-medium" style={{ color: "var(--bank-text-primary)" }}>{row.label}</td>
                            <td className="py-2.5 text-center font-bold number-display" style={{ color: "var(--bank-gold)" }}>{row.pct}%</td>
                            <td className="py-2.5 text-left number-display" style={{ color: "var(--bank-text-secondary)" }}>{formatNumber(row.amount)} ريال</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Available Amount */}
                <div
                  className="bank-card p-5"
                  style={{
                    borderColor: result.canBorrow ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)",
                    background: result.canBorrow
                      ? "rgba(34,197,94,0.05)"
                      : "rgba(239,68,68,0.05)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {result.canBorrow ? (
                      <CheckCircle size={24} style={{ color: "#22c55e" }} />
                    ) : (
                      <XCircle size={24} style={{ color: "#ef4444" }} />
                    )}
                    <h3
                      className="text-lg font-bold"
                      style={{ color: result.canBorrow ? "#22c55e" : "#ef4444" }}
                    >
                      {result.canBorrow ? "يمكنك الاقتراض" : "تجاوزت الحد المسموح"}
                    </h3>
                  </div>

                  {result.canBorrow ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: "var(--bank-text-secondary)" }}>
                          أقصى قسط شخصي إضافي
                        </span>
                        <span className="font-bold text-lg number-display" style={{ color: "#22c55e" }}>
                          {formatNumber(result.maxAdditionalMonthly)} ريال/شهر
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: "var(--bank-text-secondary)" }}>
                          أقصى تمويل شخصي (60 شهر)
                        </span>
                        <span className="font-bold text-xl number-display" style={{ color: "var(--bank-gold)" }}>
                          ~{formatNumber(result.maxAdditionalLoan60)} ريال
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: "var(--bank-text-secondary)" }}>
                      الالتزامات تتجاوز الحد المسموح. يُنصح بسداد جزء منها أو توحيدها أولًا.
                    </p>
                  )}
                </div>

                {/* CTA to Assistant */}
                <Link
                  href="/assistant"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold btn-gold"
                >
                  <Bot size={20} />
                  اسأل المساعد الذكي للمزيد من التفاصيل
                </Link>
              </>
            ) : null}
          </div>
        </div>

        {/* DBR Reference Table */}
        <div className="mt-10">
          <button
            onClick={() => setShowTable(!showTable)}
            className="flex items-center gap-2 mb-4 text-sm font-medium transition-colors"
            style={{ color: "var(--bank-gold)" }}
          >
            {showTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            جدول حدود DBR المرجعي (ساما)
          </button>

          {showTable && (
            <div className="bank-card p-5 overflow-x-auto animate-fade-in-up">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--bank-border)" }}>
                    {["الحالة", "الإجمالي", "الشخصي", "غير العقاري"].map((h) => (
                      <th key={h} className="pb-3 text-right font-bold" style={{ color: "var(--bank-gold)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["بدون عقاري (أي راتب)", "45%", "33%", "45%"],
                    ["عقاري غير مدعوم", "55%", "33%", "45%"],
                    ["عقاري مدعوم (صندوق التنمية)", "65%", "33%", "45%"],
                    ["عقاري غير مدعوم + راتب >15,000", "65%", "33%", "45%"],
                    ["راتب >25,000 (أي وضع)", "70%", "33%", "70%"],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(26,61,37,0.4)" }}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className="py-3"
                          style={{
                            color: j === 0 ? "var(--bank-text-primary)" : "var(--bank-gold)",
                            fontWeight: j > 0 ? "700" : "400",
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 space-y-1.5">
                {[
                  "التأمينات: 9.75% من الراتب الإجمالي",
                  "الدخل الإضافي: 50% من المتوسط الشهري لآخر 24 شهر (يُشترط إثباته)",
                  "البطاقات الائتمانية: يُحتسب 5% من الحد الائتماني لكل بطاقة (وليس الرصيد المستخدم)",
                  "التمويل التأجيري للسيارات وتمويل الأسهم يُحتسبان ضمن الالتزامات غير العقارية",
                ].map((note, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--bank-text-muted)" }}>
                    <Info size={12} className="mt-0.5 flex-shrink-0" style={{ color: "var(--bank-gold-muted)" }} />
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
