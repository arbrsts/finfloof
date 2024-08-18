import React, { useState, useCallback } from "react";
import { NumberInput } from "../Input/NumberInput";
import {
  useCreateTransactionMutation,
  useGetBudgetQuery,
} from "../../store/budgetApi";
import { getCurrentYearMonth } from "../../utils/dates";

function Table({ columns, rows }) {
  const { data: budget, isLoading } = useGetBudgetQuery();
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [focusedRowId, setFocusedRowId] = useState(null);
  const [tableData, setTableData] = useState(rows);
  const [newRow, setNewRow] = useState(null);
  const [createTransaction] = useCreateTransactionMutation();

  const toggleRowSelection = useCallback((rowId) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, []);

  const handleRowKeyDown = useCallback(
    (e, rowId) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleRowSelection(rowId);
      }
    },
    [toggleRowSelection]
  );

  const handleCellValueChange = useCallback((rowId, columnKey, newValue) => {
    if (rowId === "new") {
      setNewRow((prev) => ({ ...prev, [columnKey]: newValue }));
    } else {
      setTableData((prevData) =>
        prevData.map((row) =>
          row.id === rowId ? { ...row, [columnKey]: newValue } : row
        )
      );
    }
  }, []);

  const handleCreateTransaction = useCallback(
    (row) => {
      if (row && row.name && row.type) {
        createTransaction({
          monthId: getCurrentYearMonth().toISOString(),
          categoryId: "Home",
          amount: -row.type, // Assuming 'type' is used for amount
        })
          .unwrap()
          .then(() => {
            // If it's a new row, add it to the table data
            if (row.id === "new") {
              setTableData((prev) => [
                ...prev,
                { ...row, id: Date.now(), action: "Completed" },
              ]);
              setNewRow(null);
            } else {
              // If it's an existing row, update its status
              setTableData((prev) =>
                prev.map((item) =>
                  item.id === row.id ? { ...item, action: "Completed" } : item
                )
              );
            }
          })
          .catch((error) => {
            console.error("Failed to create transaction:", error);
          });
      }
    },
    [createTransaction]
  );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Select
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-4 font-medium text-gray-900"
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {tableData.map((row) => (
            <TableRow
              key={row.id}
              item={row}
              columns={columns}
              isSelected={selectedRows.has(row.id)}
              isFocused={focusedRowId === row.id}
              onSelect={toggleRowSelection}
              onFocus={() => setFocusedRowId(row.id)}
              onBlur={() => setFocusedRowId(null)}
              onKeyDown={handleRowKeyDown}
              onCellValueChange={handleCellValueChange}
              onApply={handleCreateTransaction}
            />
          ))}
          {newRow && (
            <TableRow
              key="new"
              item={newRow}
              columns={columns}
              isSelected={false}
              isFocused={false}
              onSelect={() => {}}
              onFocus={() => {}}
              onBlur={() => {}}
              onKeyDown={() => {}}
              onCellValueChange={(_, columnKey, newValue) =>
                handleCellValueChange("new", columnKey, newValue)
              }
              onApply={handleCreateTransaction}
            />
          )}
        </tbody>
      </table>
      <button
        onClick={() =>
          setNewRow({ id: "new", name: "", type: "", action: "Create" })
        }
        className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Add New Row
      </button>
      <pre>{JSON.stringify(budget, null, 2)}</pre>
    </div>
  );
}

function TableRow({
  item,
  columns,
  isSelected,
  isFocused,
  onSelect,
  onFocus,
  onBlur,
  onKeyDown,
  onCellValueChange,
  onApply,
}) {
  return (
    <tr
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={(e) => onKeyDown(e, item.id)}
      tabIndex={0}
      className={`
        ${isSelected ? "bg-indigo-50" : ""}
        ${isFocused ? "bg-gray-100" : ""}
        hover:bg-gray-50
      `}
    >
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(item.id)}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
      </td>
      {columns.map((column) => (
        <TableCell
          key={column.key}
          column={column}
          rowData={item}
          onValueChange={(newValue) =>
            onCellValueChange(item.id, column.key, newValue)
          }
          onApply={() => onApply(item)}
        />
      ))}
    </tr>
  );
}

function TableCell({ column, rowData, onValueChange, onApply }) {
  return (
    <td className="px-6 py-4">
      {column.key === "action" ? (
        rowData.action === "Create" ? (
          <button
            onClick={onApply}
            className="rounded bg-green-500 px-2 py-1 text-xs font-semibold text-white hover:bg-green-600"
          >
            Apply
          </button>
        ) : (
          <span className="text-xs font-semibold text-gray-600">
            {rowData.action}
          </span>
        )
      ) : (
        <NumberInput
          defaultValue={rowData[column.key]}
          onCommitOrDismiss={(newValue) => {
            onValueChange(newValue);
          }}
        />
      )}
    </td>
  );
}

// Usage remains the same
const columns = [
  { name: "Name", key: "name" },
  { name: "Amount", key: "type" },
  { name: "Status", key: "action" },
];

const rows = [
  { id: 1, name: 100, type: 200, action: "Completed" },
  { id: 2, name: 300, type: 400, action: "Pending" },
  { id: 3, name: 500, type: 600, action: "Completed" },
];

export default function App() {
  return <Table columns={columns} rows={rows} />;
}
