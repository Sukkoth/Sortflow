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
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  const handleCreate = () => {
    if (!newProject.name.trim()) return;
    onCreate(newProject.name, newProject.description);
    setNewProject({ name: "", description: "" });
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My Projects</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all hover:scale-105"
          >
            New Project
          </button>
        </div>

        {isCreating && (
          <div className="bg-indigo-800/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-700/50 mb-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create New Project
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-indigo-900/50 border border-indigo-600/30 rounded-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Enter project name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-indigo-900/50 border border-indigo-600/30 rounded-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-24 resize-none"
                  placeholder="Enter project description..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Create Project
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm font-medium text-indigo-200 bg-indigo-950/50 hover:bg-indigo-900/50 rounded-lg transition-colors"
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
              className="group bg-indigo-800/30 backdrop-blur-sm p-6 rounded-xl border border-indigo-700/50 hover:border-indigo-600 hover:bg-indigo-800/40 transition-all text-left relative"
            >
              <button
                onClick={() => onSelect(project)}
                className="w-full text-left"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400">
                  {project.name}
                </h3>
                <p className="text-sm text-indigo-200/70 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-xs text-indigo-300/60">
                  <span>
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2">
                    <span>{project.categories.length} Categories</span>
                    <span>•</span>
                    <span>{project.items.length} Items</span>
                  </span>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    confirm("Are you sure you want to delete this project?")
                  ) {
                    onDelete(project.id);
                  }
                }}
                className="absolute top-4 right-4 p-2 text-indigo-300/60 hover:text-red-400 rounded-full hover:bg-red-900/30 transition-colors"
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
          ))}
        </div>
      </div>
    </div>
  );
}
