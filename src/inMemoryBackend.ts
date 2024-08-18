import { Budget, Categories } from "./types";
import { adjustMonth, getCurrentYearMonth } from "./utils/dates";

export const initialBudget = {
  categories: {
    [getCurrentYearMonth().toISOString()]: {
      Home: { assigned: 0, activity: 0, available: 0 },
      ReadyToAssign: { assigned: 0, activity: 0, available: 200, inflow: 100 },
    },
    [adjustMonth(getCurrentYearMonth(), -1).toISOString()]: {
      Home: { assigned: 0, activity: 0, available: 0 },
      ReadyToAssign: { assigned: 0, activity: 0, available: 100, inflow: 100 },
    },
    [adjustMonth(getCurrentYearMonth(), -2).toISOString()]: {
      Home: { assigned: 0, activity: 0, available: 0 },
      ReadyToAssign: { assigned: 0, activity: 0, available: 0, inflow: 0 },
    },
  },
  account: {
    main: { balance: 5000 },
  },
  transactions: [],
};

export class SimplifiedBudgetLogic {
  private budget: Budget;

  constructor(initialBudget: Budget) {
    this.budget = initialBudget;
    this.recalculateBudget();
  }

  recalculateBudget() {
    const months = Object.keys(this.budget.categories).sort();
    const prevMonthCategories: Record<string, number> = {};

    for (const month of months) {
      const categories = this.budget.categories[month];

      for (const [categoryId, category] of Object.entries(categories)) {
        // Start with the previous month's available amount
        const prevAvailable = prevMonthCategories[categoryId] || 0;
        
        // Add this month's inflow (only applicable for ReadyToAssign)
        const inflow = categoryId === "ReadyToAssign" ? category.inflow : 0;
        
        // Calculate the new available amount
        category.available = prevAvailable + inflow + category.assigned + category.activity;
        
        // Store this month's available amount for the next month's calculation
        prevMonthCategories[categoryId] = category.available;
      }
    }
  }

  assign(monthId: string, categoryId: keyof Categories, amount: number) {
    const category = this.budget.categories[monthId][categoryId];
    const readyToAssign = this.budget.categories[monthId].ReadyToAssign;
    
    // Calculate the difference between the new amount and the current assigned amount
    const diff = amount - category.assigned;
    
    // Update the category's assigned amount
    category.assigned = amount;
    
    if (categoryId !== "ReadyToAssign") {
      // For categories other than ReadyToAssign, reduce ReadyToAssign by the difference
      readyToAssign.assigned -= diff;
    }
    
    this.recalculateBudget();
  }

  addTransaction(monthId: string, categoryId: keyof Categories, amount: number) {
    console.log("adding")
    const category = this.budget.categories[monthId][categoryId];
    category.activity += amount;
    this.budget.account.main.balance += amount;
    this.recalculateBudget();
  }

  getBudget(): Budget {
    return this.budget;
  }
}

export const budget = new SimplifiedBudgetLogic(initialBudget);