import * as Validator from "../../src/utils/Validator";

jest.mock("../../src/constants/messages", () => ({
  MESSAGES: {
    INVALID_INPUT_TRANSACTION: {
      DATE: "Invalid date",
      ACCOUNT: "Invalid account",
      TYPE: "Invalid type",
    },
    INVALID_RULE: {
      DATE: "Invalid rule date",
      RULE_ID: "Invalid rule id",
      RATE: "Invalid rule rate",
    },
  },
}));

describe("isValidDate", () => {
  it("should return true for a valid date", () => {
    expect(Validator.isValidDate("20240522")).toBe(true);
  });

  it("should return false for invalid date formats", () => {
    expect(Validator.isValidDate("2024-05-22")).toBe(false);
    expect(Validator.isValidDate("20241301")).toBe(false); // invalid month
    expect(Validator.isValidDate("20240230")).toBe(false); // invalid day
    expect(Validator.isValidDate("abcd")).toBe(false);
  });
});

describe("isValidAmount", () => {
  it("should return true for valid amounts", () => {
    expect(Validator.isValidAmount("100")).toBe(true);
    expect(Validator.isValidAmount("100.50")).toBe(true);
    expect(Validator.isValidAmount("0.01")).toBe(true);
  });

  it("should return false for invalid amounts", () => {
    expect(Validator.isValidAmount("0")).toBe(false);
    expect(Validator.isValidAmount("-10")).toBe(false);
    expect(Validator.isValidAmount("abc")).toBe(false);
    expect(Validator.isValidAmount("10.123")).toBe(false);
  });
});

describe("validateTransactionRules", () => {
  it("should return no errors for valid input", () => {
    const input = "20240522 ACC1 D 100.00";
    expect(Validator.validateTransactionRules(input)).toEqual([]);
  });

  it("should return no errors for lowercase type input", () => {
    const input = "20240522 ACC1 d 20.00";
    expect(Validator.validateTransactionRules(input)).toEqual([]);
  });

  it("should return an error for invalid date", () => {
    const input = "2024-05-22 ACC1 D 100.00";
    expect(Validator.validateTransactionRules(input)).toContain("Invalid date");
  });

  it("should return an error for missing account", () => {
    const input = "20240522   D 100.00";
    expect(Validator.validateTransactionRules(input)).toContain(
      "Invalid account"
    );
  });

  it("should return an error for invalid type", () => {
    const input = "20240522 ACC1 X 100.00";
    expect(Validator.validateTransactionRules(input)).toContain("Invalid type");
  });

  it("should return an error for invalid amount", () => {
    const input = "20240522 ACC1 D abc";
    expect(Validator.validateTransactionRules(input)).toContain(
      "Invalid account"
    );
  });
});

describe("validateInterestRules", () => {
  it("should return no errors for valid input", () => {
    const input = "20240522 RULE1 5.5";
    expect(Validator.validateInterestRules(input)).toEqual([]);
  });

  it("should return an error for invalid date", () => {
    const input = "2024-05-22 RULE1 5.5";
    expect(Validator.validateInterestRules(input)).toContain(
      "Invalid rule date"
    );
  });

  it("should return an error for missing rule id", () => {
    const input = "20240522   5.5";
    expect(Validator.validateInterestRules(input)).toContain("Invalid rule id");
  });

  it("should return an error for invalid rate", () => {
    expect(Validator.validateInterestRules("20240522 RULE1 abc")).toContain(
      "Invalid rule rate"
    );
    expect(Validator.validateInterestRules("20240522 RULE1 0")).toContain(
      "Invalid rule rate"
    );
    expect(Validator.validateInterestRules("20240522 RULE1 100")).toContain(
      "Invalid rule rate"
    );
    expect(Validator.validateInterestRules("20240522 RULE1 -5")).toContain(
      "Invalid rule rate"
    );
  });
});
