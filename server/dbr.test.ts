import { describe, it, expect } from "vitest";

// ===== DBR Calculation Logic (mirrors client/src/pages/Calculator.tsx) =====

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
  creditCards: { id: string; name: string; limit: number }[];
  otherObligations: number;
}

function calculateDBR(input: DBRInput) {
  const netIncome =
    input.salaryMode === "net"
      ? input.netSalary
      : input.grossSalary * (1 - 0.0975);

  const additionalIncome =
    input.additionalIncome24 > 0
      ? (input.additionalIncome24 / 24) * 0.5
      : 0;
  const totalIncome = netIncome + additionalIncome;

  const creditCardObligation = input.creditCards.reduce(
    (sum, c) => sum + c.limit * 0.05,
    0
  );

  const nonRealEstateObligations =
    input.personalLoan +
    input.carLoan +
    input.stockFinancing +
    creditCardObligation +
    input.otherObligations;
  const totalObligations = input.realEstateLoan + nonRealEstateObligations;

  let maxTotalDBR = 45;

  if (input.realEstateLoan > 0) {
    if (input.isRealEstateSupported) {
      maxTotalDBR = 65;
    } else if (totalIncome >= 25000) {
      maxTotalDBR = 70;
    } else if (totalIncome >= 15000) {
      maxTotalDBR = 65;
    } else {
      maxTotalDBR = 55;
    }
  } else {
    if (totalIncome >= 25000) {
      maxTotalDBR = 70;
    }
  }

  const maxPersonalDBR = 33;
  const maxNonRealEstateDBR = totalIncome >= 25000 ? maxTotalDBR : 45;

  const maxTotalAmount = totalIncome * (maxTotalDBR / 100);
  const maxPersonalAmount = totalIncome * (maxPersonalDBR / 100);
  const maxNonRealEstateAmount = totalIncome * (maxNonRealEstateDBR / 100);

  const remainingPersonal = maxPersonalAmount - input.personalLoan;
  const remainingTotal = maxTotalAmount - totalObligations;
  const remainingNonRealEstate = maxNonRealEstateAmount - nonRealEstateObligations;

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
  };
}

const baseInput = (overrides: Partial<DBRInput> = {}): DBRInput => ({
  salaryMode: "gross",
  grossSalary: 12000,
  netSalary: 0,
  additionalIncome24: 0,
  personalLoan: 0,
  realEstateLoan: 0,
  isRealEstateSupported: false,
  carLoan: 0,
  stockFinancing: 0,
  creditCards: [],
  otherObligations: 0,
  ...overrides,
});

describe("DBR Calculator — SAMA Standards", () => {
  // ===== Salary Calculations =====
  describe("Salary Deductions", () => {
    it("deducts 9.75% insurance from gross salary", () => {
      const result = calculateDBR(baseInput({ grossSalary: 12000 }));
      expect(result.netIncome).toBeCloseTo(12000 * (1 - 0.0975), 2);
      expect(result.netIncome).toBeCloseTo(10830, 0);
    });

    it("uses net salary directly without deduction", () => {
      const result = calculateDBR(
        baseInput({ salaryMode: "net", netSalary: 10000, grossSalary: 0 })
      );
      expect(result.netIncome).toBe(10000);
    });

    it("calculates additional income as 50% of 24-month average", () => {
      const result = calculateDBR(
        baseInput({ grossSalary: 10000, additionalIncome24: 24000 })
      );
      // additionalIncome = (24000 / 24) * 0.5 = 500
      const expectedNet = 10000 * (1 - 0.0975);
      expect(result.totalIncome).toBeCloseTo(expectedNet + 500, 1);
    });
  });

  // ===== DBR Limits =====
  describe("DBR Limits by Scenario", () => {
    it("no real estate: limit is 45%", () => {
      const result = calculateDBR(baseInput({ grossSalary: 10000 }));
      expect(result.maxTotalDBR).toBe(45);
    });

    it("unsupported real estate: limit is 55%", () => {
      const result = calculateDBR(
        baseInput({ grossSalary: 10000, realEstateLoan: 2000, isRealEstateSupported: false })
      );
      expect(result.maxTotalDBR).toBe(55);
    });

    it("supported real estate (صندوق التنمية): limit is 65%", () => {
      const result = calculateDBR(
        baseInput({ grossSalary: 10000, realEstateLoan: 2000, isRealEstateSupported: true })
      );
      expect(result.maxTotalDBR).toBe(65);
    });

    it("unsupported real estate + salary >= 15000: limit is 65%", () => {
      const result = calculateDBR(
        baseInput({
          salaryMode: "net",
          netSalary: 16000,
          realEstateLoan: 3000,
          isRealEstateSupported: false,
        })
      );
      expect(result.maxTotalDBR).toBe(65);
    });

    it("salary >= 25000 (any case): limit is 70%", () => {
      const result = calculateDBR(
        baseInput({ salaryMode: "net", netSalary: 25000 })
      );
      expect(result.maxTotalDBR).toBe(70);
    });

    it("salary >= 25000 with real estate: limit is 70%", () => {
      const result = calculateDBR(
        baseInput({
          salaryMode: "net",
          netSalary: 30000,
          realEstateLoan: 8000,
          isRealEstateSupported: false,
        })
      );
      expect(result.maxTotalDBR).toBe(70);
    });

    it("personal DBR limit is always 33%", () => {
      const result = calculateDBR(baseInput({ grossSalary: 30000 }));
      expect(result.maxPersonalDBR).toBe(33);
    });
  });

  // ===== Credit Cards =====
  describe("Credit Card Obligations", () => {
    it("calculates 5% of credit limit (not balance)", () => {
      const result = calculateDBR(
        baseInput({
          creditCards: [
            { id: "1", name: "Visa", limit: 20000 },
            { id: "2", name: "MC", limit: 10000 },
          ],
        })
      );
      // 20000 * 0.05 + 10000 * 0.05 = 1000 + 500 = 1500
      expect(result.creditCardObligation).toBe(1500);
    });

    it("no cards = zero credit card obligation", () => {
      const result = calculateDBR(baseInput());
      expect(result.creditCardObligation).toBe(0);
    });
  });

  // ===== Live Examples from PDF =====
  describe("Live Examples from System Prompt", () => {
    it("Example 1: Employee wants car (salary 12000, personal loan 3000)", () => {
      const result = calculateDBR(
        baseInput({ grossSalary: 12000, personalLoan: 3000 })
      );
      // Net = 12000 * 0.9025 = 10830
      // Max personal = 10830 * 0.33 = 3573.9
      // Remaining personal = 3573.9 - 3000 = 573.9
      expect(result.netIncome).toBeCloseTo(10830, 0);
      expect(result.maxPersonalAmount).toBeCloseTo(3573.9, 0);
      expect(result.remainingPersonal).toBeCloseTo(573.9, 0);
      // Car loan 80000/60 ≈ 1333 > remaining → cannot borrow that much
      expect(result.maxAdditionalMonthly).toBeLessThan(1000);
    });

    it("Example 2: Supported real estate (salary 12000, RE 2500, personal 1500)", () => {
      const result = calculateDBR(
        baseInput({
          grossSalary: 12000,
          realEstateLoan: 2500,
          isRealEstateSupported: true,
          personalLoan: 1500,
        })
      );
      // Net ≈ 10830, limit 65%, max total = 10830 * 0.65 = 7039.5
      // Total obligations = 2500 + 1500 = 4000
      // Remaining total = 7039.5 - 4000 = 3039.5
      // Remaining personal = 10830 * 0.33 - 1500 = 3573.9 - 1500 = 2073.9
      // maxAdditional = min(2073.9, 3039.5, ...) ≈ 2073.9
      expect(result.maxTotalDBR).toBe(65);
      expect(result.maxAdditionalMonthly).toBeCloseTo(2073.9, 0);
      // Loan 60 months ≈ 2073.9 * 60 ≈ 124,434
      expect(result.maxAdditionalLoan60).toBeCloseTo(2073.9 * 60, 0);
    });

    it("Example 3: High salary (30000, unsupported RE 8000)", () => {
      const result = calculateDBR(
        baseInput({
          salaryMode: "net",
          netSalary: 28500,
          realEstateLoan: 8000,
          isRealEstateSupported: false,
        })
      );
      // Salary >= 25000 → limit 70%
      expect(result.maxTotalDBR).toBe(70);
      // Max total = 28500 * 0.70 = 19950
      // Remaining total = 19950 - 8000 = 11950
      // Max personal = 28500 * 0.33 = 9405
      // maxAdditional = min(9405, 11950) = 9405
      expect(result.maxAdditionalMonthly).toBeCloseTo(9405, 0);
      expect(result.maxAdditionalLoan60).toBeCloseTo(9405 * 60, 0);
    });
  });

  // ===== Edge Cases =====
  describe("Edge Cases", () => {
    it("returns canBorrow=false when obligations exceed limit", () => {
      const result = calculateDBR(
        baseInput({ grossSalary: 5000, personalLoan: 3000 })
      );
      // Net = 5000 * 0.9025 = 4512.5
      // Max personal = 4512.5 * 0.33 = 1489.1
      // personalLoan 3000 > 1489.1 → cannot borrow
      expect(result.canBorrow).toBe(false);
    });

    it("returns canBorrow=true when within limits", () => {
      const result = calculateDBR(baseInput({ grossSalary: 20000 }));
      expect(result.canBorrow).toBe(true);
    });

    it("zero salary returns zero DBR", () => {
      const result = calculateDBR(
        baseInput({ grossSalary: 0, salaryMode: "net", netSalary: 0 })
      );
      expect(result.currentDBR).toBe(0);
    });
  });
});
