import { useDrop } from "react-dnd";
import { Item } from "../types";
import { DraggableItem } from "./DraggableItem";
import { useState, useRef, useEffect } from "react";
interface Props {
  id: string | null;
  title: string;
  items: Item[];
  onMove: (itemId: string, fromId: string | null, toId: string | null) => void;
  onDelete: (itemId: string, categoryId: string | null) => void;
  onDeleteCategory?: (categoryId: string, deleteItems: boolean) => void;
  onRenameCategory?: (newName: string) => void;
}

export function DroppableContainer({
  id,
  title,
  items,
  onMove,
  onDelete,
  onDeleteCategory,
  onRenameCategory,
}: Props) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ITEM",
    drop: (item: { id: string; containerId: string | null }) => {
      if (item.containerId !== id) {
        onMove(item.id, item.containerId, id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const optionsRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(title);
  const [showOptions, setShowOptions] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRenameCategory && newName.trim()) {
      onRenameCategory(newName);
      setIsEditing(false);
      setShowOptions(false);
    }
  };

  return (
    <div
      ref={drop}
      className={`relative group h-fit min-w-[400px] rounded-xl p-4 shadow-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${
        isOver ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <form onSubmit={handleRename} className="flex-1 flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-2 py-1 text-sm rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-1 text-xs text-blue-500 bg-blue-500 hover:bg-blue-700 border border-blue-500 hover:border-blue-700 rounded-lg transition-all duration-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setNewName(title);
              }}
              className="px-2 py-1 text-xs text-gray-500 bg-gray-700 hover:bg-gray-900 border border-gray-700 hover:border-gray-900 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-500 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${
                    isCollapsed ? "" : "rotate-90"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h3
                className={`text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2`}
              >
                {title}
                <span
                  className={`text-sm font-normal text-gray-500 dark:text-gray-400`}
                >
                  ({items.length})
                </span>
              </h3>
            </div>
            {id !== null && (
              <div className="relative" ref={optionsRef}>
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-500 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                {showOptions && (
                  <div
                    className={`absolute right-0 mt-1 w-48 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg py-1 z-10`}
                  >
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowOptions(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-left text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                    >
                      Rename Category
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this category? Items will be moved to general items."
                          )
                        ) {
                          onDeleteCategory?.(id, true); // true = move to general items
                          setShowOptions(false);
                        }
                      }}
                      className="w-full px-4 py-2 text-sm text-left text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                    >
                      Delete without Items
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this category and all its items permanently? This action cannot be undone."
                          )
                        ) {
                          onDeleteCategory?.(id, false); // false = don't move to general items (delete everything)
                          setShowOptions(false);
                        }
                      }}
                      className="w-full px-4 py-2 text-sm text-left text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-500 transition-all duration-200"
                    >
                      Delete with Items
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div
        className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "h-0" : "h-auto"
        }`}
      >
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            containerId={id}
            onDelete={() => onDelete(item.id, id)}
          />
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No items yet
          </p>
        )}
      </div>
    </div>
  );
}
