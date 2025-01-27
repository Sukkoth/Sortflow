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
        isOver ? "ring-2 ring-violet-500" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <form onSubmit={handleRename} className="flex-1 flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-2 py-1 text-sm rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-1 text-xs text-white bg-violet-500 hover:bg-violet-700 border border-violet-500 hover:border-violet-700 rounded-lg transition-all duration-200"
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
                className="p-2 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform duration-200 ${
                    isCollapsed ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
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
                  className="p-2 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
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
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
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
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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
