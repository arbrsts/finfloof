import { useState } from "react";
import { useGetBudgetQuery } from "../../store/budgetApi";
import { Table, useTable } from "../../components/Table/Table";

const columns = [
  { name: "Category", key: "categoryId" },
  { name: "Amount", key: "amount" },
  { name: "Status", key: "action" },
];

export const Accounts = () => {
  const { data: budget, isLoading } = useGetBudgetQuery();
  const [activeAccountId, setActiveAccountId] = useState("main");
  const tableProps = useTable();

  const transactions =
    budget?.transactions.filter(
      (transaction) => transaction.accountId == activeAccountId
    ) ?? [];

  return (
    <div className="">
      <div className="bg-finfloof-background">
        <h1 className="text-finfloof-text-primary text-4xl font-bold mb-4">
          August 2024
        </h1>

        <button
          onClick={() => {
            tableProps.setNewRow({
              id: "new",
              categoryId: "",
              amount: undefined,
              action: "Create",
            });
          }}
          className="bg-finfloof-primary font-medium text-finfloof-background px-4 py-2 rounded"
        >
          New Transaction
        </button>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="flex basis-3/4 border">
          <Table
            {...tableProps}
            columns={columns}
            rows={transactions}
            accountId={activeAccountId}
          />
        </div>
        <div className="p-4 bg-finfloof-panel rounded-lg basis-1/4">
          <h2 className="px-8 uppercase font-medium mb-2 flex justify-between">
            <span>Budget</span>
            <span className="">£ 8520</span>
          </h2>
          {Object.entries(budget?.account ?? {}).map(([key, value]) => {
            return (
              <div
                key={key}
                onClick={() => {
                  setActiveAccountId(key);
                }}
                className={`flex gap-4  px-8 py-2 rounded-xl justify-between ${
                  activeAccountId == key && "bg-neutral-700"
                }`}
              >
                <span className="capitalize text-finfloof-primary font-medium">
                  {key}
                </span>
                <span className="">£ {value.balance}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
