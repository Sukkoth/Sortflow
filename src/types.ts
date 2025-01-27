export interface Item {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  items: Item[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  items: Item[];
  categories: Category[];
}

export interface AppState {
  projects: Project[];
  currentProjectId: string | null;
}
