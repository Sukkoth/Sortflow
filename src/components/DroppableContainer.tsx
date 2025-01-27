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
        bg-[#2E3944] backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#748D92]/30
        ${isOver ? "border-[#D3D9D4]" : ""}
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
              className="flex-1 px-2 py-1 text-sm bg-[#212A31] border border-[#748D92]/30 rounded-lg text-[#D3D9D4]"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-1 text-xs text-[#D3D9D4] bg-[#124E66] hover:bg-[#2E3944] border border-[#748D92] hover:border-[#D3D9D4] rounded-lg transition-all duration-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setNewName(title);
              }}
              className="px-2 py-1 text-xs text-[#748D92] bg-[#212A31] hover:bg-[#2E3944] border border-[#748D92]/30 hover:border-[#748D92] rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 text-[#748D92] hover:text-[#D3D9D4] rounded-lg hover:bg-[#124E66] transition-all duration-200"
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
              <h3 className="text-lg font-semibold text-[#D3D9D4] flex items-center gap-2">
                {title}
                <span className="text-sm font-normal text-[#748D92]">
                  ({items.length})
                </span>
              </h3>
            </div>
            {id !== null && (
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1 text-[#748D92] hover:text-[#D3D9D4] rounded-lg hover:bg-[#124E66] transition-all duration-200"
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
                  <div className="absolute right-0 mt-1 w-48 rounded-lg bg-[#212A31] border border-[#748D92]/30 shadow-lg py-1 z-10">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full px-4 py-2 text-sm text-left text-[#748D92] hover:bg-[#2E3944] hover:text-[#D3D9D4] transition-all duration-200"
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
                      className="w-full px-4 py-2 text-sm text-left text-[#748D92] hover:bg-[#2E3944] hover:text-[#D3D9D4] transition-all duration-200"
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
