import { create } from 'zustand';

interface SettingsState {
  trackedApps: string[];  // package names the user wants to track
  setTrackedApps: (apps: string[]) => void;
  addTrackedApp: (packageName: string) => void;
  removeTrackedApp: (packageName: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  trackedApps: [],
  setTrackedApps: (trackedApps) => set({ trackedApps }),
  addTrackedApp: (packageName) =>
    set((state) => ({
      trackedApps: state.trackedApps.includes(packageName)
        ? state.trackedApps
        : [...state.trackedApps, packageName],
    })),
  removeTrackedApp: (packageName) =>
    set((state) => ({
      trackedApps: state.trackedApps.filter((p) => p !== packageName),
    })),
}));
