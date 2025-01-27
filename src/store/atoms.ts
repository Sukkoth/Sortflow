import { atomWithStorage } from 'jotai/utils';
import { AppState } from '../types';

const initialState: AppState = {
  projects: [],
  currentProjectId: null,
};

export const appStateAtom = atomWithStorage<AppState>("sortflowState", initialState);
