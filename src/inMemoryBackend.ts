// src/inMemoryBackend.ts
import { Budget, Categories } from "./types";
import { adjustMonth, getCurrentYearMonth } from "./utils/dates";

class InMemoryBackend {
  private budget: Budget;

  constructor() {
    this.budget = {
      categories: {
        [getCurrentYearMonth().toISOString()]: {
          Home: {
            assigned: 10,
            activity: 35,
          },
          ReadyToAssign: {
            assigned: 5000,
            activity: 35,
          },
        },
        [adjustMonth(getCurrentYearMonth(), -1).toISOString()]: {
          Home: {
            assigned: 10,
            activity: 35,
          },
          ReadyToAssign: {
            assigned: 5000,
            activity: 35,
          },
        },
      },
      account: {
        main: {
          balance: 5000,
        },
      },
      transactions: [],
    };
  }

  getBudget() {
    return this.budget;
  }

  assign(monthId: string, categoryId: keyof Categories, amount: number) {
    this.budget.categories[monthId].ReadyToAssign.assigned +=
      this.budget.categories?.[monthId]?.[categoryId].assigned - amount;
    this.budget.categories[monthId][categoryId].assigned = amount;
  }

  createTransaction(
    categoryId: keyof Categories,
    accountId: string,
    amount: number
  ) {
    this.budget.categories[categoryId].activity -= amount;
    this.budget.account[accountId].balance -= amount;
    this.budget.transactions.push({
      id: crypto.randomUUID(),
      accountId,
      amount,
    });
  }

  getTransactions() {
    return this.budget;
  }
}

export const inMemoryBackend = new InMemoryBackend();
