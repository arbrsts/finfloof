import { useState } from "react";
import "./App.css";
import { initialItems } from "./components/Tree/CategoryTree/SortableTree";
import {
  useAssignMutation,
  useCreateTransactionMutation,
  useGetBudgetQuery,
} from "./store/budgetApi";
import { Categories } from "./types";
import { getCurrentYearMonth } from "./utils/dates";
import { Link, Route, Switch } from "wouter";
import Budget from "./pages/budget/Budget";
import { Accounts } from "./pages/accounts/Account";

const sidebar = [
  { label: "Budget", href: "/" },
  { label: "Accounts", href: "/accounts" },
  { label: "Reports" },
];

// Format date as yyyy-mm
function App() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const result = await window.api.dbQuery("SELECT * FROM users", []);
    setData(result);
  };

  const { data: budget, isLoading } = useGetBudgetQuery();

  const [items, setItems] = useState(initialItems);
  const [detailId, setDetailId] = useState<keyof Categories>();
  const [date, setDate] = useState(getCurrentYearMonth());

  const [assign] = useAssignMutation();
  const [createTransaction] = useCreateTransactionMutation();

  return (
    <div className="App bg-finfloof-background text-finfloof-text-primary min-h-screen">
      <nav className="flex items-center justify-between border-b border-finfloof-text-muted p-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-lg bg-finfloof-primary px-4 py-2 text-finfloof-background">
            <div className="font-bold text-lg">finfloof</div>
            <div className="text-xs opacity-75">budget</div>
          </div>
        </div>
        <ul className="flex space-x-6">
          {sidebar.map((item) => (
            <li key={item.label}>
              <Link
                to={item?.href ?? ""}
                className="text-finfloof-text-secondary hover:text-finfloof-text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-8">
        <Switch>
          <Route exact path="/" component={Budget} />
          <Route path="/accounts" component={Accounts} />
          <Route>
            <div className="text-center text-finfloof-text-accent">
              404: No such page!
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
