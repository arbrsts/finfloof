import { useState } from "react";
import {
  initialItems,
  SortableTree,
} from "../../components/Tree/CategoryTree/SortableTree";
import { NumberInput } from "../../components/Input/NumberInput";
import {
  useAssignMutation,
  useCreateTransactionMutation,
  useGetBudgetQuery,
} from "../../store/budgetApi";
import { Categories } from "../../types";
import { TreeItem } from "../../components/Tree/CategoryTree/components";
import { adjustMonth, getCurrentYearMonth } from "../../utils/dates";
import { Link } from "wouter";

const sidebar = [
  { label: "Budget", href: "/" },
  { label: "Reports" },
  { label: "Accounts", href: "/accounts" },
];

// Format date as yyyy-mm
function Budget() {
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
    <>
      <div className="flex flex-col">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setDate((prevDate) => adjustMonth(prevDate, -1));
            }}
          >
            Prev
          </button>
          <div className="font-bold text-xl">{date.toDateString()}</div>
          <button
            onClick={() => setDate((prevDate) => adjustMonth(prevDate, 1))}
          >
            Next
          </button>
        </div>
        <TreeItem
          value="Pouch"
          isColumnHeader={true}
          depth={0}
          indentationWidth={0}
        />
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
    </>
  );
}

export default Budget;
