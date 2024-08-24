import React from "react";
import {
  ComboBox,
  Group,
  Input,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  ComboBoxProps,
  ListBoxItemProps,
  Label,
} from "react-aria-components";
import { ChevronsUpDown } from "lucide-react";
import { CheckIcon } from "lucide-react";

// Define the shape of each choice item
interface Choice {
  id: string;
  name: string;
}

// Define the props for the ComboBoxInput component
interface ComboBoxInputProps {
  choices: Choice[];
}

export function ComboBoxInput({
  choices,
  defaultInputValue,
  onInputChange,
}: ComboBoxInputProps & ComboBoxProps<Choice>) {
  const [value, setValue] = React.useState(defaultInputValue ?? "");

  return (
    <ComboBox
      aria-label="add-later"
      className={"flex"}
      onInputChange={(newValue) => {
        setValue(newValue);
        if (onInputChange) {
          onInputChange(newValue);
        }
      }}
      inputValue={value}
    >
      <Group className="flex border bg-finfloof-panel bg-opacity-90 focus-within:bg-opacity-100 transition shadow-md ring-1 ring-black/10 focus-visible:ring-2 focus-visible:ring-black">
        <Input className="flex-1 w-full border-none py-2 px-3 leading-5  bg-transparent outline-none text-base" />
        <Button className="px-3 items-center text-gray-700 transition border-0 border-solid border-l border-l-sky-200 bg-transparent rounded-r-lg pressed:bg-sky-100">
          <ChevronsUpDown />
        </Button>
      </Group>
      <Popover className=" w-[--trigger-width] bg-finfloof-panel overflow-auto rounded-md  text-base shadow-lg ring-1 ring-black/5 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out">
        <ListBox className="outline-none p-1" items={choices}>
          {(item) => (
            <UserItem textValue={item.name}>
              <span className="truncate">{item.name}</span>
            </UserItem>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}

function UserItem(props: ListBoxItemProps & { children: React.ReactNode }) {
  return (
    <ListBoxItem
      {...props}
      className="group flex items-center gap-2 cursor-default select-none py-2 pl-2 pr-4 outline-none rounded  focus:bg-sky-600 focus:text-white"
    >
      {({ isSelected }) => (
        <>
          <span className="flex-1 flex items-center gap-3 truncate font-normal group-selected:font-medium">
            {props.children}
          </span>
          {isSelected && (
            <span className="w-5 flex items-center text-sky-600 group-focus:text-white">
              <CheckIcon />
            </span>
          )}
        </>
      )}
    </ListBoxItem>
  );
}
