import { useState } from "react";
import "./App.css";
import {
  initialItems,
  SortableTree,
} from "./components/Tree/CategoryTree/SortableTree";
import { NumberInput } from "./components/Input/NumberInput";
import {
  useAssignMutation,
  useCreateTransactionMutation,
  useGetBudgetQuery,
} from "./store/budgetApi";
import { Categories } from "./types";
import { TreeItem } from "./components/Tree/CategoryTree/components";
import { adjustMonth, getCurrentYearMonth } from "./utils/dates";

const sidebar = [
  { label: "Budget" },
  { label: "Reports" },
  { label: "Accounts" },
];

// Format date as yyyy-mm
function App() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const result = await window.api.dbQuery("SELECT * FROM users", []);
    setData(result);
  };
  console.log("rendering");

  const { data: budget, isLoading } = useGetBudgetQuery();

  const [items, setItems] = useState(initialItems);
  const [detailId, setDetailId] = useState<keyof Categories>();
  const [date, setDate] = useState(getCurrentYearMonth());

  const [assign] = useAssignMutation();
  const [createTransaction] = useCreateTransactionMutation();

  return (
    <div className="App flex ">
      <div className="bg-amber-50/50 border-r p-5">
        <div className="rounded-2xl bg-white px-4 py-2 border text-lg">
          <div className="bg-neutral-400 rounded-xl"></div>
          <div>Riley's Budget</div>
          <div className="text-xs text-neutral-900">riley@gmail.com</div>
        </div>
        <ul>
          {sidebar.map((item) => (
            <li className="p-1 ">{item.label}</li>
          ))}
        </ul>
      </div>
      <div className="flex p-5 gap-8">
        <div className="flex flex-col">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setDate((prevDate) => adjustMonth(prevDate, -1));
              }}
            >
              Prev
            </button>
            <div>{date.toDateString()}</div>
            <button
              onClick={() => setDate((prevDate) => adjustMonth(prevDate, 1))}
            >
              Next
            </button>
          </div>
          <div>All Money Assigned</div>
          detailId: {detailId}
          <div>
            <TreeItem
              value="Category"
              isColumnHeader={true}
              depth={0}
              indentationWidth={0}
            />
          </div>
          <SortableTree
            removable
            indicator
            collapsible
            items={items}
            setItems={setItems}
            setDetailId={setDetailId}
          >
            {({ ...props }) => (
              <TreeItem monthId={date.toISOString()} {...props}></TreeItem>
            )}
          </SortableTree>
        </div>

        <div className="">
          <div className="flex">
            <NumberInput />
          </div>
          <pre>Ready to Assign: {JSON.stringify(budget, null, 2)}</pre>
          <div className="flex gap-4 ">
            <button
              onClick={() => assign({ categoryId: detailId, amount: 100 })}
            >
              Assign 10
            </button>
            <button
              onClick={() =>
                createTransaction({
                  categoryId: "Home",
                  accountId: "main",
                  amount: 50,
                })
              }
            >
              Create transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
