import { describe, it, expect } from "vitest";

// ===== Installment Calculation Logic =====
// Mirrors the formulas in the System Prompt

interface InstallmentInput {
  amount: number;
  months: number;
  annualFlatRate: number; // e.g. 0.042 for 4.2%
  insuranceRate?: number; // e.g. 0.035 for 3.5% (cars only)
}

function calculateInstallment(input: InstallmentInput) {
  const years = input.months / 12;
  const totalProfit = input.amount * input.annualFlatRate * years;
  const totalAmount = input.amount + totalProfit;
  const monthlyPayment = totalAmount / input.months;

  let insuranceMonthly = 0;
  if (input.insuranceRate) {
    insuranceMonthly = (input.amount * input.insuranceRate) / 12;
  }

  const totalMonthly = monthlyPayment + insuranceMonthly;

  return {
    totalProfit: Math.round(totalProfit),
    totalAmount: Math.round(totalAmount),
    monthlyPayment: Math.round(monthlyPayment),
    insuranceMonthly: Math.round(insuranceMonthly),
    totalMonthly: Math.round(totalMonthly),
  };
}

// ===== Profit Rate Lookup =====
function getProfitRate(netSalary: number, grade: "A" | "B" | "C" | "D"): number {
  const table: Record<string, Record<string, number>> = {
    A: {
      "<5000": 0.05,
      "5000-9999": 0.042,
      "10000-14999": 0.0325,
      "15000-19999": 0.0315,
      "20000-24999": 0.031,
      ">=25000": 0.03,
    },
    B: {
      "<5000": 0.064,
      "5000-9999": 0.048,
      "10000-14999": 0.0325,
      "15000-19999": 0.0325,
      "20000-24999": 0.032,
      ">=25000": 0.031,
    },
    C: {
      "<5000": 0.066,
      "5000-9999": 0.05,
      "10000-14999": 0.0395,
      "15000-19999": 0.0395,
      "20000-24999": 0.0385,
      ">=25000": 0.0375,
    },
    D: {
      "<5000": 0.089,
      "5000-9999": 0.087,
      "10000-14999": 0.074,
      "15000-19999": 0.0725,
      "20000-24999": 0.071,
      ">=25000": 0.07,
    },
  };

  let bracket: string;
  if (netSalary < 5000) bracket = "<5000";
  else if (netSalary < 10000) bracket = "5000-9999";
  else if (netSalary < 15000) bracket = "10000-14999";
  else if (netSalary < 20000) bracket = "15000-19999";
  else if (netSalary < 25000) bracket = "20000-24999";
  else bracket = ">=25000";

  return table[grade][bracket];
}

describe("Installment Calculator", () => {
  describe("Car Financing (Ijara)", () => {
    it("calculates car installment: 80,000 SAR × 60 months × 4.2% + insurance 3.5%", () => {
      const result = calculateInstallment({
        amount: 80000,
        months: 60,
        annualFlatRate: 0.042,
        insuranceRate: 0.035,
      });

      // Profit = 80,000 × 4.2% × 5 = 16,800
      expect(result.totalProfit).toBe(16800);
      // Total = 80,000 + 16,800 = 96,800
      expect(result.totalAmount).toBe(96800);
      // Monthly payment = 96,800 / 60 ≈ 1,613
      expect(result.monthlyPayment).toBe(1613);
      // Insurance = 80,000 × 3.5% / 12 ≈ 233
      expect(result.insuranceMonthly).toBe(233);
      // Total monthly ≈ 1,847 (1613 + 233 = 1846 rounded)
      expect(result.totalMonthly).toBe(1847);
    });

    it("calculates car installment without insurance", () => {
      const result = calculateInstallment({
        amount: 50000,
        months: 48,
        annualFlatRate: 0.042,
      });
      // Profit = 50,000 × 4.2% × 4 = 8,400
      expect(result.totalProfit).toBe(8400);
      // Total = 58,400
      expect(result.totalAmount).toBe(58400);
      // Monthly = 58,400 / 48 ≈ 1,217
      expect(result.monthlyPayment).toBe(1217);
      expect(result.insuranceMonthly).toBe(0);
    });
  });

  describe("Personal Financing", () => {
    it("calculates personal loan: 100,000 SAR × 60 months × 3.1%", () => {
      const result = calculateInstallment({
        amount: 100000,
        months: 60,
        annualFlatRate: 0.031,
      });
      // Profit = 100,000 × 3.1% × 5 = 15,500
      expect(result.totalProfit).toBe(15500);
      // Total = 115,500
      expect(result.totalAmount).toBe(115500);
      // Monthly = 115,500 / 60 = 1,925
      expect(result.monthlyPayment).toBe(1925);
    });

    it("calculates personal loan: 50,000 SAR × 36 months × 3.25%", () => {
      const result = calculateInstallment({
        amount: 50000,
        months: 36,
        annualFlatRate: 0.0325,
      });
      // Profit = 50,000 × 3.25% × 3 = 4,875
      expect(result.totalProfit).toBe(4875);
      // Total = 54,875
      expect(result.totalAmount).toBe(54875);
      // Monthly = 54,875 / 36 ≈ 1,524
      expect(result.monthlyPayment).toBe(1524);
    });
  });

  describe("Profit Rate Lookup from Excel Data", () => {
    it("returns 4.2% for grade A, salary 5,000-9,999", () => {
      expect(getProfitRate(8000, "A")).toBe(0.042);
    });

    it("returns 3.1% for grade A, salary 20,000-24,999", () => {
      expect(getProfitRate(22000, "A")).toBe(0.031);
    });

    it("returns 3.0% for grade A, salary >=25,000", () => {
      expect(getProfitRate(30000, "A")).toBe(0.03);
    });

    it("returns 5.0% for grade A, salary <5,000", () => {
      expect(getProfitRate(4000, "A")).toBe(0.05);
    });

    it("returns 8.7% for grade D, salary 5,000-9,999", () => {
      expect(getProfitRate(7000, "D")).toBe(0.087);
    });

    it("returns 3.25% for grade B, salary 10,000-14,999", () => {
      expect(getProfitRate(12000, "B")).toBe(0.0325);
    });
  });

  describe("OpenRouter API Key Validation", () => {
    it("OPENROUTER_API_KEY is set in environment", () => {
      const key = process.env.OPENROUTER_API_KEY;
      expect(key).toBeTruthy();
      expect(typeof key).toBe("string");
      expect(key!.length).toBeGreaterThan(10);
    });
  });
});
