import { useDrag } from "react-dnd";
import { Item } from "../types";

interface Props {
  item: Item;
  containerId: string | null;
  onDelete: () => void;
}

export function DraggableItem({ item, containerId, onDelete }: Props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ITEM",
    item: { id: item.id, containerId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`
        group relative flex items-center gap-2 p-3 
        bg-[#2E3944] border border-[#748D92]/30 rounded-lg 
        hover:bg-[#124E66] hover:border-[#D3D9D4]
        shadow-sm hover:shadow-md hover:scale-[1.02]
        transition-all duration-200 ease-in-out 
        cursor-move w-[97%] mx-auto text-sm
        ${isDragging ? "opacity-50 scale-95 rotate-2" : ""}
      `}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-[#748D92] group-hover:bg-[#D3D9D4] transition-colors" />
      <div className="flex-1 font-medium text-[#D3D9D4]">{item.name}</div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 text-red-400 hover:text-red-300"
        >
          <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
