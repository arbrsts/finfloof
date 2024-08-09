import { useEffect, useState } from "react";
import "./App.css";
import { initialItems, SortableTree } from "./Tree/SortableTree";
import InMemoryBudget, { Categories } from "./inMemoryBudget";

const budget_ = new InMemoryBudget();

function useBudgetStore() {
  const [budget, setBudget] = useState(budget_.budget);

  useEffect(() => {
    // Subscribe to budget changes
    const unsubscribe = budget_.subscribe(() => {
      // Update the state whenever the budget changes
      console.log("re-render", budget_.budget);
      setBudget({ ...budget_.budget });
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  return budget;
}

const sidebar = [
  { label: "Budget" },
  { label: "Reports" },
  { label: "Accounts" },
];

function App() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const result = await window.api.dbQuery("SELECT * FROM users", []);
    setData(result);
  };

  const [items, setItems] = useState(initialItems);
  const [detailId, setDetailId] = useState<keyof Categories>();
  const budget = useBudgetStore();
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
          <div>
            <div>Riley's Budget</div>
            <div>Aug 2024</div>
          </div>
          <div>All Money Assigned</div>
          detailId: {detailId}
          <SortableTree
            items={items}
            setItems={setItems}
            setDetailId={setDetailId}
          />
        </div>

        <div className="">
          <pre>Ready to Assign: {JSON.stringify(budget, null, 2)}</pre>
          <div className="flex gap-4 ">
            <button onClick={() => budget_.assign(detailId, 100)}>
              Assign 10
            </button>
            <button
              onClick={() => budget_.createTransaction(detailId, "main", 100)}
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
