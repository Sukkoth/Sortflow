import { useDrop } from "react-dnd";
import { Item } from "../types";
import { DraggableItem } from "./DraggableItem";
import { useState } from "react";

interface Props {
  id: string | null;
  title: string;
  items: Item[];
  onMove: (itemId: string, fromId: string | null, toId: string | null) => void;
  onDelete: (itemId: string, categoryId: string | null) => void;
  onDeleteCategory?: () => void;
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

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(title);
  const [showOptions, setShowOptions] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      ref={drop}
      className={`
        relative group h-fit min-w-[400px]
        bg-indigo-800/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-indigo-700/50
        ${isOver ? "border-blue-500" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onRenameCategory) {
                onRenameCategory(newName);
                setIsEditing(false);
              }
            }}
            className="flex-1 flex gap-2"
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-2 py-1 text-sm bg-indigo-900/50 border border-indigo-600/30 rounded-lg text-white"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-1 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setNewName(title);
              }}
              className="px-2 py-1 text-xs text-indigo-200 bg-indigo-800/50 rounded-lg hover:bg-indigo-700/50"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 text-indigo-300 hover:text-white rounded-lg hover:bg-indigo-700/50"
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
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {title}
                <span className="text-sm font-normal text-indigo-400">
                  ({items.length})
                </span>
              </h3>
            </div>
            {id !== null && (
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1 text-indigo-300 hover:text-white rounded-lg hover:bg-indigo-700/50"
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
                  <div className="absolute right-0 mt-1 w-48 rounded-lg bg-indigo-900/95 border border-indigo-700/50 shadow-lg py-1 z-10">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full px-4 py-2 text-sm text-left text-indigo-200 hover:bg-indigo-800/50 hover:text-white"
                    >
                      Rename Category
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Move items to general list and delete category?"
                          )
                        ) {
                          onDeleteCategory?.();
                        }
                      }}
                      className="w-full px-4 py-2 text-sm text-left text-indigo-200 hover:bg-indigo-800/50 hover:text-white"
                    >
                      Delete Category & Move Items
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm("Delete category and all its items?")
                        ) {
                          onDeleteCategory?.();
                        }
                      }}
                      className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-red-900/30 hover:text-red-300"
                    >
                      Delete Category & Items
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
      </div>
    </div>
  );
}
