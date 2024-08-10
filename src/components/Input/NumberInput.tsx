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
import { useKeyboard, useFocusWithin } from "react-aria";
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
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleCommitOrDismiss = useCallback(() => {
    if (onCommitOrDismiss) {
      onCommitOrDismiss(value);
    }
    setIsFocused(false);
  }, [value, onCommitOrDismiss]);

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
    <TextField {...props} ref={ref}>
      <Label>{label}</Label>
      {isFocused ? "true" : "false"}
      <Input
        {...focusWithinProps}
        {...keyboardProps}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className={classNames([
          "text-right  rounded px-1",
          isFocused ? "hover:outline outline-1" : "outline-0",
        ])}
      />
    </TextField>
  );
};
