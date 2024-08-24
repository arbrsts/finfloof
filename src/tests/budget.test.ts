import { SimplifiedBudgetLogic } from "../inMemoryBackend";
import { adjustMonth, getCurrentYearMonth } from "../utils/dates";
import { Budget } from "../types";

const currentMonth = getCurrentYearMonth().toISOString();
const previousMonth = adjustMonth(getCurrentYearMonth(), -1).toISOString();
const nextMonth = adjustMonth(getCurrentYearMonth(), 1).toISOString();

const testInitialBudget: Budget = {
  categoriesMonthly: {
    [previousMonth]: {
      Home: { assigned: 0, activity: 0, available: 0 },
      Food: { assigned: 0, activity: 0, available: 0 },
      ReadyToAssign: { assigned: 0, activity: 0, available: 100, inflow: 100 },
    },
    [currentMonth]: {
      Home: { assigned: 0, activity: 0, available: 0 },
      Food: { assigned: 0, activity: 0, available: 0 },
      ReadyToAssign: { assigned: 0, activity: 0, available: 200, inflow: 100 },
    },
    [nextMonth]: {
      Home: { assigned: 0, activity: 0, available: 0 },
      Food: { assigned: 0, activity: 0, available: 0 },
      ReadyToAssign: { assigned: 0, activity: 0, available: 0, inflow: 100 },
    },
  },
  account: {
    main: { balance: 300 },
  },
  transactions: [],
};

describe("SimplifiedBudgetLogic", () => {
  let budgetLogic: SimplifiedBudgetLogic;

  beforeEach(() => {
    budgetLogic = new SimplifiedBudgetLogic(JSON.parse(JSON.stringify(testInitialBudget)));
  });

  test("initial budget is set correctly", () => {
    const budget = budgetLogic.getBudget();
    expect(budget.categoriesMonthly[currentMonth].ReadyToAssign.available).toBe(200);
    expect(budget.categoriesMonthly[currentMonth].Home.available).toBe(0);
    expect(budget.categoriesMonthly[currentMonth].Food.available).toBe(0);
  });

  test("assign reduces ReadyToAssign and increases category available", () => {
    budgetLogic.assign(currentMonth, "Home", 50);
    const budget = budgetLogic.getBudget();
    expect(budget.categoriesMonthly[currentMonth].ReadyToAssign.available).toBe(150);
    expect(budget.categoriesMonthly[currentMonth].Home.available).toBe(50);
  });

  test("multiple assigns are cumulative", () => {
    budgetLogic.assign(currentMonth, "Home", 50);
    budgetLogic.assign(currentMonth, "Home", 75);
    budgetLogic.assign(currentMonth, "Food", 100);
    const budget = budgetLogic.getBudget();
    expect(budget.categoriesMonthly[currentMonth].ReadyToAssign.available).toBe(25);
    expect(budget.categoriesMonthly[currentMonth].Home.available).toBe(75);
    expect(budget.categoriesMonthly[currentMonth].Food.available).toBe(100);
  });

  test("addTransaction updates category activity and available", () => {
    budgetLogic.assign(currentMonth, "Home", 100);
    budgetLogic.addTransaction(currentMonth, "Home", -30);
    const budget = budgetLogic.getBudget();
    expect(budget.categoriesMonthly[currentMonth].Home.activity).toBe(-30);
    expect(budget.categoriesMonthly[currentMonth].Home.available).toBe(70);
  });

  test("available amount rolls over to next month", () => {
    budgetLogic.assign(currentMonth, "Home", 100);
    budgetLogic.addTransaction(currentMonth, "Home", -30);
    const budget = budgetLogic.getBudget();
    expect(budget.categoriesMonthly[nextMonth].Home.available).toBe(70);
  });

  test("ReadyToAssign rolls over correctly", () => {
    budgetLogic.assign(currentMonth, "Home", 50);
    const budget = budgetLogic.getBudget();
    expect(budget.categoriesMonthly[nextMonth].ReadyToAssign.available).toBe(250); // 150 (current) + 100 (next month inflow)
  });

  test("negative assign to ReadyToAssign decreases its available amount", () => {
    budgetLogic.assign(currentMonth, "ReadyToAssign", -50);
    const budget = budgetLogic.getBudget();
    expect(budget.categoriesMonthly[currentMonth].ReadyToAssign.available).toBe(150);
  });

  test("positive assign to ReadyToAssign increases its available amount", () => {
    budgetLogic.assign(currentMonth, "ReadyToAssign", 50);
    const budget = budgetLogic.getBudget();
    expect(budget.categoriesMonthly[currentMonth].ReadyToAssign.available).toBe(250);
  });

  test("assign more than available should still work but leave ReadyToAssign negative", () => {
    budgetLogic.assign(currentMonth, "Home", 300);
    const budget = budgetLogic.getBudget();
    expect(budget.categoriesMonthly[currentMonth].ReadyToAssign.available).toBe(-100);
    expect(budget.categoriesMonthly[currentMonth].Home.available).toBe(300);
  });
});