import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Budget, Categories, Transaction } from "../types";
import { customFetch } from "../customFetch";

// Define the shape of the response for createTransaction
interface CreateTransactionResponse {
  id: string;
  // Add other properties that the API returns
}

export const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/", fetchFn: customFetch }),
  tagTypes: ["Budget"],
  endpoints: (builder) => ({
    getBudget: builder.query<Budget, void>({
      query: () => "budget",
      providesTags: ["Budget"],
    }),
    assign: builder.mutation<
      void,
      { monthId: string; categoryId: keyof Categories; amount: number }
    >({
      query: ({ monthId, categoryId, amount }) => ({
        url: "assign",
        method: "POST",
        body: { monthId, categoryId, amount },
      }),
      invalidatesTags: ["Budget"],
    }),
    createTransaction: builder.mutation<
      CreateTransactionResponse,
      {
        accountId: string;
        monthId: string;
        categoryId: keyof Categories;
        amount: number;
      }
    >({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Budget"],
    }),
    getTransactions: builder.query<Transaction[], void>({
      query: () => "transactions",
      providesTags: ["Budget"],
    }),
  }),
});

export const {
  useGetBudgetQuery,
  useAssignMutation,
  useCreateTransactionMutation,
  useGetTransactionsQuery,
} = budgetApi;
