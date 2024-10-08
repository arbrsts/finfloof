// src/types.ts

export type Category = {
  assigned: number;
  activity: number;
  available: number;
  inflow?: number;
};

export type Categories = {
  [key: string]: {
    Home: Category;
    ReadyToAssign: Category;
    [category: string]: Category; // Allow for more categories in the future
  };
};

export type Account = {
  balance: number;
};

export type Accounts = {
  [accountId: string]: Account;
};

export type Transaction = {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
};

export type Budget = {
  categoriesMonthly: Categories;
  account: Accounts;
  transactions: Transaction[];
};
