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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                {currentProject.name}
              </h1>
              <div className="px-3 py-1 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300">
                {currentProject.categories.length} Categories
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 max-w-2xl">
              {currentProject.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:text-violet-600 dark:hover:text-violet-400"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 text-white transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </button>
            </div>

            <div className="flex items-center">
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, currentProjectId: null }))
                }
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Back to Projects
              </button>

              <div className="relative group">
                <button className="px-4 py-2 text-sm font-medium rounded-lg ml-2 bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200 shadow-sm hover:shadow-md">
                  Actions
                  <span className="ml-2">▼</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 invisible group-hover:visible transition-all duration-200">
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
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                    className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Clear Everything
                  </button>
                </div>
              </div>
            </div>
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
            <div className="backdrop-blur-sm rounded-xl p-4 shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 text-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Add Items */}
            <div className="backdrop-blur-sm rounded-xl p-4 shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
                  className="inline-items-center w-full gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 text-white transition-all duration-200 shadow-sm hover:shadow-md"
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
          <div className="overflow-x-auto scrollbar-hide min-h-[80dvh]">
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
