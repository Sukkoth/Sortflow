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
                  className="inline-flex w-full justify-center items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 text-white transition-all duration-200 shadow-sm hover:shadow-md"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800 shadow-sm hover:shadow-md transition-all duration-200"
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
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {project.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => onSelect(project)}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 text-white transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Open Project
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
