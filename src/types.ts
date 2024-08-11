// src/types.ts

export type Category = {
  assigned: number;
  activity: number;
  available: number;
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
  amount: number;
};

export type Budget = {
  categories: Categories;
  account: Accounts;
  transactions: Transaction[];
};
