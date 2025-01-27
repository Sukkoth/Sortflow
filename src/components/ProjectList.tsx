import { useState } from "react";
import { Project } from "../types";
interface Props {
  projects: Project[];
  onSelect: (project: Project) => void;
  onCreate: (name: string, description: string) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectList({ projects, onSelect, onCreate, onDelete }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreate = () => {
    if (!newProjectName.trim()) return;
    onCreate(newProjectName.trim(), newProjectDescription.trim());
    setNewProjectName("");
    setNewProjectDescription("");
    setIsCreating(false);
  };

  return (
    <div
      className={`min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold`}>My Projects</h1>
          <button
            onClick={() => setIsCreating(true)}
            className={`px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all duration-200`}
          >
            New Project
          </button>
        </div>

        {isCreating && (
          <div
            className={`bg-white dark:bg-gray-800 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6 animate-fade-in`}
          >
            <h2 className={`text-xl font-semibold mb-4`}>Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300`}
                >
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300`}
                >
                  Description
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all duration-200`}
                >
                  Create Project
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white transition-all duration-200`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}
            >
              {editingProject?.id === project.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingProject.name.trim()) {
                      // onEdit(editingProject);
                      setEditingProject(null);
                    }
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    value={editingProject?.name}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        name: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  />
                  <textarea
                    value={editingProject?.description}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        description: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all duration-200`}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProject(null)}
                      className={`px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white transition-all duration-200`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-semibold`}>{project.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProject(project)}
                        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(project.id)}
                        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className={`mb-4 text-gray-600 dark:text-gray-300`}>
                    {project.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className={`text-gray-500 dark:text-gray-400`}>
                      {project.categories.length} categories
                    </div>
                    <button
                      onClick={() => onSelect(project)}
                      className={`px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all duration-200`}
                    >
                      Open Project
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
