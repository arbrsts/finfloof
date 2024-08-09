type Category = {
  assigned: number;
  activity: number;
};

export type Categories = {
  Home: Category;
  ReadyToAssign: Category;
  [category: string]: Category; // Allow for more categories in the future
};

type Budget = {
  categories: Categories;
};

type Subscriber = () => void;

class InMemoryBudget {
  public budget: Budget;
  private subscribers: Set<Subscriber>;

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

    this.subscribers = new Set<Subscriber>();
  }

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(): void {
    this.subscribers.forEach((callback) => callback());
  }

  assign(categoryId: keyof Categories, amount: number): void {
    this.budget.categories[categoryId].assigned += amount;
    this.budget.categories.ReadyToAssign.assigned -= amount;
    this.notify(); // Notify subscribers of the change
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
    this.notify(); // Notify subscribers of the change
  }

  getTransactions(): Budget {
    return this.budget;
  }
}

export default InMemoryBudget;
