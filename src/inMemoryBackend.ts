// src/inMemoryBackend.ts
import { Budget, Categories } from "./types";

class InMemoryBackend {
  private budget: Budget;

  constructor() {
    this.budget = {
      categories: {
        Home: {
          assigned: 10,
          activity: 35,
        },
        ReadyToAssign: {
          assigned: 5000,
          activity: 35,
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

  assign(categoryId: keyof Categories, amount: number) {
    this.budget.categories.ReadyToAssign.assigned +=
      this.budget.categories[categoryId].assigned - amount;
    this.budget.categories[categoryId].assigned = amount;
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
