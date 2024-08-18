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
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleCommitOrDismiss = useCallback(() => {
    if (onCommitOrDismiss) {
      onCommitOrDismiss(value);
    }
    setIsFocused(false);
  }, [onCommitOrDismiss, value]);

  useEffect(() => {
    setValue(props.defaultValue ?? "");
  }, [props.defaultValue]);

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        handleCommitOrDismiss();
        inputRef?.current?.blur();
      }
    },
  });

  const { focusWithinProps } = useFocusWithin({
    onBlurWithin: () => {
      handleCommitOrDismiss();
      inputRef?.current?.blur();
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
          "text-right hover:outline outline-1 hover:bg-white rounded px-1 w-16",
          isFocused ? "outline-1 bg-white" : "bg-transparent",
        ])}
      />
    </TextField>
  );
};
