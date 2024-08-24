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
    <div className="flex App  text-finfloof-text-primary min-h-screen">
      <nav className="flex flex-col bg-finfloof-panel border-finfloof-text-muted px-4 py-4 border-r">
        <div className="flex items-center space-x-4 mb-8">
          <div className="">
            <div className="font-bold text-2xl">Riley's Budget</div>
            <div className="text-lg opacity-75">£4004.24</div>
          </div>
        </div>
        <ul className="">
          {sidebar.map((item) => (
            <li key={item.label}>
              <Link
                to={item?.href ?? ""}
                className="text-xl font-bold text-finfloof-text-secondary hover:text-finfloof-text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-24 py-14 grow">
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
