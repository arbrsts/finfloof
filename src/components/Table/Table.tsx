import React, { useState, useCallback, useEffect } from "react";
import { NumberInput } from "../Input/NumberInput";
import {
  useCreateTransactionMutation,
  useGetBudgetQuery,
} from "../../store/budgetApi";
import { getCurrentYearMonth } from "../../utils/dates";
import { Transaction } from "../../types";
import { ComboBoxInput } from "../Input/ComboBox";
import { ChartColumnBig } from "lucide-react";

// Define types for the column structure
interface Column {
  key: string;
  name: string;
}

// Define the return type for useTable hook
interface UseTableReturn {
  newRow: Transaction | null;
  setNewRow: React.Dispatch<React.SetStateAction<Transaction | null>>;
}

export const useTable = (): UseTableReturn => {
  const [newRow, setNewRow] = useState<Transaction | null>(null);

  return {
    newRow,
    setNewRow,
  };
};

// Define props for the Table component
interface TableProps {
  columns: Column[];
  rows: Transaction[];
  accountId: string;
  newRow: Transaction | null;
  setNewRow: React.Dispatch<React.SetStateAction<Transaction | null>>;
}

export function Table({
  columns,
  rows,
  accountId,
  newRow,
  setNewRow,
}: TableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<Transaction[]>(rows);
  const [createTransaction] = useCreateTransactionMutation();

  useEffect(() => {
    setTableData(rows);
  }, [rows]);

  const toggleRowSelection = useCallback((rowId: string) => {
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
    (e: React.KeyboardEvent, rowId: string) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleRowSelection(rowId);
      }
    },
    [toggleRowSelection]
  );

  const handleCellValueChange = useCallback(
    (rowId: string, columnKey: string, newValue: unknown) => {
      if (rowId === "new") {
        setNewRow((prev) => (prev ? { ...prev, [columnKey]: newValue } : null));
      } else {
        setTableData((prevData) =>
          prevData.map((row) =>
            row.id === rowId ? { ...row, [columnKey]: newValue } : row
          )
        );
      }
    },
    [setNewRow]
  );

  const handleCreateTransaction = useCallback(
    (row: Transaction) => {
      console.log(row);
      if (row && row.amount && row.categoryId) {
        console.log("accountId table", accountId);
        createTransaction({
          accountId,
          monthId: getCurrentYearMonth().toISOString(),
          categoryId: row.categoryId,
          amount: -row.amount, // Assuming 'type' is used for amount
        })
          .unwrap()
          .then(({ id }) => {
            if (row.id === "new") {
              setTableData((prev) => [...prev, { ...row, id }]);
              setNewRow(null);
            }
          })
          .catch((error) => {
            console.error("Failed to create transaction:", error);
          });
      }
    },
    [accountId, createTransaction, setNewRow]
  );

  return (
    <div className="overflow-hidden rounded-lg border w-full border-gray-200 shadow-sm">
      <table className="w-full border-collapse bg-finfloof-panel text-left text-sm ">
        <thead className="bg-finfloof-pane1">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium ">
              Select
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-4 font-medium "
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
    </div>
  );
}

// Define props for the TableRow component
interface TableRowProps {
  item: Transaction;
  columns: Column[];
  isSelected: boolean;
  isFocused: boolean;
  onSelect: (id: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onCellValueChange: (id: string, columnKey: string, newValue: any) => void;
  onApply: (item: Transaction) => void;
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
}: TableRowProps) {
  return (
    <tr
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={(e) => onKeyDown(e, item.id)}
      tabIndex={0}
      className={`
        ${isSelected ? "bg-finfloof-panel" : ""}
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

// Define props for the TableCell component
interface TableCellProps {
  column: Column;
  rowData: Transaction;
  onValueChange: (newValue: unknown) => void;
  onApply: () => void;
}

function TableCell({
  column,
  rowData,
  onValueChange,
  onApply,
}: TableCellProps) {
  const { data } = useGetBudgetQuery();

  if (column.key === "action") {
    return (
      <td className="px-6 py-4">
        {rowData.action === "Create" ? (
          <button
            onClick={onApply}
            className="rounded bg-green-500 px-2 py-1 text-xs font-semibold hover:bg-green-600"
          >
            Apply
          </button>
        ) : (
          <span className="text-xs font-semibold text-gray-600">
            {rowData.action}
          </span>
        )}
      </td>
    );
  }

  if (column.key === "categoryId") {
    return (
      <td className="px-6 py-4">
        <ComboBoxInput
          defaultInputValue={rowData[column.key]}
          choices={data?.categories}
        />
      </td>
    );
  }

  return (
    <td className="px-6 py-4">
      <NumberInput
        defaultValue={rowData[column.key] as number}
        onCommitOrDismiss={(newValue) => {
          onValueChange(newValue);
        }}
      />
    </td>
  );
}
