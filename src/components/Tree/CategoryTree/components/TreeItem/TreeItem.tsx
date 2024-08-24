import React, { forwardRef, HTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

import styles from "./TreeItem.module.css";
import { Action, Handle, Remove } from "../../../Item/components";
import { NumberInput } from "../../../../Input/NumberInput";
import {
  useAssignMutation,
  useGetBudgetQuery,
} from "../../../../../store/budgetApi";

export interface TreeItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, "id" | "children"> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth?: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth?: number;
  isColumnHeader?: boolean; // Show item as header with column labels instead with number input fields
  value?: string;
  monthId?: string; // Month to assign and retrieve values from
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
  children?: ({ ...props }: Omit<TreeItemProps, "children">) => ReactNode;
}

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      onClick,
      style,
      value,
      wrapperRef,
      isColumnHeader,
      monthId,
      ...props
    },
    ref
  ) => {
    const { data: budget } = useGetBudgetQuery();
    const [assign] = useAssignMutation();

    return (
      <li
        className={classNames(
          styles.Wrapper,
          clone && styles.clone,
          ghost && styles.ghost,
          indicator && styles.indicator,
          disableSelection && styles.disableSelection,
          disableInteraction && styles.disableInteraction
        )}
        onClick={onClick}
        ref={wrapperRef}
        {...props}
      >
        <div
          className={classNames(styles.TreeItem, !depth && "bg-neutral-200")}
          ref={ref}
          style={style}
        >
          <Handle {...handleProps} />
          <div className="w-4">
            {onCollapse && (
              <Action
                onClick={onCollapse}
                className={classNames(
                  styles.Collapse,
                  collapsed && styles.collapsed
                )}
              >
                {collapseIcon}
              </Action>
            )}
          </div>

          <span className={styles.Text}>{value}</span>

          <div className="flex gap-2">
            <div className="w-20 flex border justify-end">
              {isColumnHeader ? (
                <div className="">Budgeted</div>
              ) : (
                <NumberInput
                  defaultValue={budget?.categoriesMonthly[monthId]?.[
                    value
                  ]?.assigned?.toString()}
                  onCommitOrDismiss={(amount) => {
                    assign({
                      categoryId: value,
                      monthId,
                      amount: parseFloat(amount),
                    });
                  }}
                />
              )}
            </div>
            <div className="w-20 flex border justify-end">
              {isColumnHeader ? (
                <div className="">Activity</div>
              ) : (
                <NumberInput
                  defaultValue={budget?.categoriesMonthly[monthId]?.[
                    value
                  ]?.activity?.toString()}
                />
              )}
            </div>
            <div className="w-20 flex border justify-end">
              {isColumnHeader ? (
                <div className="">Available</div>
              ) : (
                <NumberInput
                  defaultValue={budget?.categoriesMonthly[monthId]?.[
                    value
                  ]?.available?.toString()}
                />
              )}
            </div>
          </div>

          <div className="w-4">
            {!clone && onRemove && <Remove onClick={onRemove} />}
            {clone && childCount && childCount > 1 ? (
              <span className={styles.Count}>{childCount}</span>
            ) : null}
          </div>
        </div>
      </li>
    );
  }
);

const collapseIcon = (
  <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41">
    <path d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z" />
  </svg>
);
