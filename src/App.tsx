import { useState } from "react";
import "./App.css";
import React from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MultipleContainers } from "./MultipleContainers";

function App() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const result = await window.api.dbQuery("SELECT * FROM users", []);
    setData(result);
  };

  const [count, setCount] = useState(0);

  return (
    <div className="App flex bg-neutral-300">
      <div className="bg-blue-500">
        <div>Riley's Budget</div>
        <ul>
          <li>Budget</li>
          <li>Reflect</li>
          <li>All Accounts</li>
          <li>Budget</li>
        </ul>
      </div>
      <div className="flex flex-col">
        <div>
          <div>Riley's Budget</div>
          <div>Aug 2024</div>
        </div>
        <div>All Money Assigned</div>
        <MultipleContainers itemCount={2} vertical />;
      </div>
    </div>
  );
}

const initialItems = [
  { id: "Item 1", children: [] },
  {
    id: "Item 2",
    children: [
      { id: "Sub Item 1", children: [] },
      {
        id: "Sub Item 2",
        children: [],
      },
    ],
  },
];

type Item = { id: string; children: Item[] };

function findIndexById(
  items: Item[],
  id: string,
  path: number[] = []
): number[] | null {
  for (let index = 0; index < items.length; index++) {
    const currentPath = [...path, index];
    if (items[index].id === id) {
      return currentPath;
    }
    const childPath = findIndexById(items[index].children, id, currentPath);
    if (childPath) {
      return childPath;
    }
  }
  return null;
}

function getItemAndParentByPath(
  items: Item[],
  path: number[]
): { parent: Item[]; index: number } {
  let currentParent: Item[] = items;
  let currentIndex: number;

  for (let i = 0; i < path.length - 1; i++) {
    currentIndex = path[i];
    currentParent = currentParent[currentIndex].children;
  }

  return { parent: currentParent, index: path[path.length - 1] };
}

// Function to create an immutable copy of the items and move the item
function arrayMove(
  items: Item[],
  oldPath: number[],
  newPath: number[]
): Item[] {
  if (oldPath.length === 0 || newPath.length === 0) {
    throw new Error("Invalid path");
  }

  // Clone the original array
  const itemsClone = structuredClone(items);

  const { parent: oldParentClone, index: oldIndexClone } =
    getItemAndParentByPath(itemsClone, oldPath);
  const { parent: newParentClone, index: newIndexClone } =
    getItemAndParentByPath(itemsClone, newPath);

  // Remove the item from the old location
  const [item] = oldParentClone.splice(oldIndexClone, 1);

  // Insert the item into the new location
  newParentClone.splice(newIndexClone, 0, item);

  return itemsClone;
}

const Categories: React.FC = () => {
  const [items, setItems] = React.useState<Item[]>(initialItems);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over, delta } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = findIndexById(items, active.id);
        const newIndex =
          delta.x < 50
            ? findIndexById(items, over.id)
            : [...findIndexById(items, over.id), 0];

        console.log(delta, oldIndex, newIndex);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderItems = (items: Item[], depth = 0) => {
    return items.map(({ id, children }) => (
      <NestedSortableItem key={id} id={id} depth={depth}>
        {renderItems(children, depth + 1)}
      </NestedSortableItem>
    ));
  };

  const [activeId, setActiveId] = useState(null);
  return (
    <>
      active: {activeId}
      <pre>{JSON.stringify(items, null, 4)}</pre>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragEnd={(event) => {
          setActiveId(null);
          handleDragEnd(event);
        }}
        onDragStart={(event) => setActiveId(event.active.id)}
      >
        <div className="border-red-500 border">
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {renderItems(items)}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeId ? (
            <div style={{ padding: "11px", backgroundColor: "lightgrey" }}>
              Ghost: {activeId}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default App;
