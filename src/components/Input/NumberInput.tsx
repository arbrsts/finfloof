import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Input,
  Label,
  TextField,
  TextFieldProps,
  ValidationResult,
} from "react-aria-components";
import { useKeyboard, useFocusWithin, useFocusManager } from "react-aria";
import classNames from "classnames";

interface NumberInput extends TextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  onCommitOrDismiss?: (value: string) => void;
}

export const NumberInput = ({
  label,
  onCommitOrDismiss,
  ...props
}: NumberInput) => {
  const [value, setValue] = useState(props.defaultValue ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleCommitOrDismiss = useCallback(() => {
    inputRef?.current?.blur();

    if (onCommitOrDismiss) {
      onCommitOrDismiss(value);
    }
    setIsFocused(false);
  }, [onCommitOrDismiss, value]);

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        handleCommitOrDismiss();
      }
    },
  });

  const { focusWithinProps } = useFocusWithin({
    onBlurWithin: () => {
      handleCommitOrDismiss();
    },
    onFocusWithinChange: (isFocusWithin) => {
      setIsFocused(isFocusWithin);
    },
  });

  return (
    <TextField {...props} className={"flex"}>
      <Label>{label}</Label>
      <Input
        {...focusWithinProps}
        {...keyboardProps}
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className={classNames([
          "text-right hover:outline outline-1 hover:bg-white rounded px-1 w-8",
          isFocused ? "outline-1 bg-white" : "bg-transparent",
        ])}
      />
    </TextField>
  );
};
