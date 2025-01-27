import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Item, Project } from "./types";
import { DroppableContainer } from "./components/DroppableContainer";
import { ProjectList } from "./components/ProjectList";
import { appStateAtom } from "./store/atoms";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [state, setState] = useAtom(appStateAtom);

  const [saveStatus, setSaveStatus] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const handleSave = () => {
      localStorage.setItem("sortflowState", JSON.stringify(state));
    };

    window.addEventListener("beforeunload", handleSave);
    return () => window.removeEventListener("beforeunload", handleSave);
  }, [state]);

  const handleSave = () => {
    try {
      localStorage.setItem("sortflowState", JSON.stringify(state));
      setSaveStatus({
        show: true,
        type: "success",
        message: "Changes saved successfully!",
      });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus({
        show: true,
        type: "error",
        message: "Failed to save changes. Please try again.",
      });
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const deleteProject = (projectId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== projectId),
        currentProjectId:
          prev.currentProjectId === projectId ? null : prev.currentProjectId,
      }));
    }
  };

  const deleteCategory = (
    categoryId: string,
    moveItemsToGeneral: boolean = true
  ) => {
    setState((prev) => {
      const newState = { ...prev };
      const project = newState.projects?.find(
        (p) => p.id === state.currentProjectId
      );
      if (project) {
        const category = project.categories.find((c) => c.id === categoryId);
        if (category) {
          if (moveItemsToGeneral) {
            // Option: Delete without items
            // Move items back to general list first
            project.items = [...project.items, ...category.items];
          }
          // Just remove the category (and its items) in both cases
          project.categories = project.categories.filter(
            (c) => c.id !== categoryId
          );
          project.updatedAt = new Date().toISOString();
        }
      }
      return newState;
    });
  };

  const renameCategory = (categoryId: string, newName: string) => {
    if (!newName.trim()) return;

    setState((prev) => {
      const newState = { ...prev };
      const project = newState.projects?.find(
        (p) => p.id === state.currentProjectId
      );
      if (project) {
        const category = project.categories.find((c) => c.id === categoryId);
        if (category) {
          category.name = newName.trim();
          project.updatedAt = new Date().toISOString();
        }
      }
      return newState;
    });
  };

  const clearProject = (clearGeneralItems: boolean = false) => {
    setState((prev) => {
      const newState = { ...prev };
      const project = newState.projects?.find(
        (p) => p.id === state.currentProjectId
      );
      if (project) {
        // Move all category items to general items
        project.categories.forEach((category) => {
          project.items.push(...category.items);
        });
        // Clear all categories
        project.categories = [];

        // Clear general items if requested
        if (clearGeneralItems) {
          project.items = [];
        }

        project.updatedAt = new Date().toISOString();
      }
      return newState;
    });
  };

  const deleteItem = (itemId: string, categoryId: string | null) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setState((prev) => {
        const newState = { ...prev };
        const project = newState.projects?.find(
          (p) => p.id === state.currentProjectId
        );
        if (project) {
          if (categoryId === null) {
            project.items = project.items.filter((i) => i.id !== itemId);
          } else {
            const category = project.categories.find(
              (c) => c.id === categoryId
            );
            if (category) {
              category.items = category.items.filter((i) => i.id !== itemId);
            }
          }
          project.updatedAt = new Date().toISOString();
        }
        return newState;
      });
    }
  };

  const createProject = (name: string, description: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
      categories: [],
    };

    setState((prev) => {
      const newState = {
        ...prev,
        projects: [...prev.projects, newProject],
      };
      // Auto-save when creating a new project
      localStorage.setItem("sortflowState", JSON.stringify(newState));
      return newState;
    });

    // Show save success message
    setSaveStatus({
      show: true,
      type: "success",
      message: "Project created and saved!",
    });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const selectProject = (project: Project) => {
    setState((prev) => ({
      ...prev,
      currentProjectId: project.id,
    }));
  };

  const getCurrentProject = () => {
    return state.projects?.find((p) => p.id === state.currentProjectId) || null;
  };

  const addCategory = (name: string) => {
    if (!name.trim() || !state.currentProjectId) return;

    setState((prev) => {
      // Check if category with this name already exists
      const newState = { ...prev };
      const project = newState.projects?.find(
        (p) => p.id === state.currentProjectId
      );

      if (project) {
        // Check if category already exists
        const categoryExists = project.categories.some(
          (cat) => cat.name === name.trim()
        );
        if (!categoryExists) {
          project.categories.push({
            id: crypto.randomUUID(),
            name,
            items: [],
          });
          project.updatedAt = new Date().toISOString();
        }
      }
      return newState;
    });
  };

  const addBulkItems = (text: string) => {
    if (!text.trim() || !state.currentProjectId) return;

    const itemNames = text
      .split("*")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (itemNames.length === 0) return;

    setState((prev) => {
      const newState = { ...prev };
      const project = newState.projects?.find(
        (p) => p.id === state.currentProjectId
      );
      if (project) {
        project.items.push(
          ...itemNames.map((name) => ({
            id: crypto.randomUUID(),
            name,
          }))
        );
        project.updatedAt = new Date().toISOString();
      }
      return newState;
    });
  };

  const moveItem = (
    itemId: string,
    fromId: string | null,
    toId: string | null
  ) => {
    if (!state.currentProjectId) return;

    setState((prev) => {
      const newState = { ...prev };
      const project = newState.projects?.find(
        (p) => p.id === state.currentProjectId
      );
      if (!project) return prev;

      let item: Item | undefined;

      // Remove item from source
      if (fromId === null) {
        // Remove from general items
        const itemIndex = project.items.findIndex((i) => i.id === itemId);
        if (itemIndex !== -1) {
          [item] = project.items.splice(itemIndex, 1);
        }
      } else {
        // Remove from category
        const category = project.categories.find((c) => c.id === fromId);
        if (category) {
          const itemIndex = category.items.findIndex((i) => i.id === itemId);
          if (itemIndex !== -1) {
            [item] = category.items.splice(itemIndex, 1);
          }
        }
      }

      if (!item) return prev;

      // Add item to destination
      if (toId === null) {
        // Add to general items
        project.items.push(item);
      } else {
        // Add to category
        const category = project.categories.find((c) => c.id === toId);
        if (category) {
          category.items.push(item);
        }
      }

      project.updatedAt = new Date().toISOString();
      return newState;
    });
  };

  const currentProject = getCurrentProject();

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
        <div className="p-8">
          <ProjectList
            projects={state.projects || []}
            onSelect={selectProject}
            onCreate={createProject}
            onDelete={deleteProject}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#D3D9D4]">
              {currentProject.name}
            </h1>
            <p className="text-[#748D92] text-sm mt-1">
              {currentProject.description}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Clear all categories and move items to general list?"
                  )
                ) {
                  clearProject(false);
                }
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 transition-all duration-200"
            >
              Clear Categories
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Clear all categories and items? This cannot be undone."
                  )
                ) {
                  clearProject(true);
                }
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-all duration-200"
            >
              Clear Everything
            </button>
            <button
              onClick={() =>
                setState((prev) => ({ ...prev, currentProjectId: null }))
              }
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 transition-all duration-200"
            >
              Back to Projects
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all duration-200"
            >
              Save Changes
            </button>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 transition-all duration-200"
            >
              {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* Save Status Toast */}
        {saveStatus && (
          <div
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all transform ${
              saveStatus.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {saveStatus.message}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-[400px_1fr] gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Add Category */}
            <div className="backdrop-blur-sm rounded-xl p-4 shadow-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Add Category
              </h2>
              <div className="flex gap-2">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const name = newCategoryName.trim();
                      if (name) {
                        addCategory(name);
                        setNewCategoryName("");
                      }
                    }
                  }}
                  placeholder="Category name..."
                  className="flex-1 px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <button
                  onClick={() => {
                    const name = newCategoryName.trim();
                    if (name) {
                      addCategory(name);
                      setNewCategoryName("");
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all duration-200"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Add Items */}
            <div className="backdrop-blur-sm rounded-xl p-4 shadow-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Add Items
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const textarea = form.elements.namedItem(
                    "items"
                  ) as HTMLTextAreaElement;
                  addBulkItems(textarea.value);
                  textarea.value = "";
                }}
              >
                <textarea
                  name="items"
                  placeholder="* Item 1&#10;* Item 2&#10;* Item 3"
                  className="w-full h-24 px-3 py-2 text-sm rounded-lg border mb-2 resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all duration-200"
                >
                  Add Items
                </button>
              </form>
            </div>

            {/* General Items */}
            <DroppableContainer
              id={null}
              title="General Items"
              items={currentProject.items}
              onMove={moveItem}
              onDelete={deleteItem}
            />
          </div>

          {/* Categories Grid */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4 min-w-max">
              {currentProject.categories.map((category) => (
                <DroppableContainer
                  key={category.id}
                  id={category.id}
                  title={category.name}
                  items={category.items}
                  onMove={moveItem}
                  onDelete={deleteItem}
                  onDeleteCategory={deleteCategory}
                  onRenameCategory={(newName) =>
                    renameCategory(category.id, newName)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <AppContent />
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;
