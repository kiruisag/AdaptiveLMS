import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface UiState {
  globalLoadingCount: number;
  showGlobalLoader: () => void;
  hideGlobalLoader: () => void;
  theme: Theme;
  toggleTheme: () => void;
  initTheme: () => void;
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored as Theme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  }
  return 'light';
};

export const useUiStore = create<UiState>((set, get) => ({
  globalLoadingCount: 0,
  showGlobalLoader: () => set((state) => ({ globalLoadingCount: state.globalLoadingCount + 1 })),
  hideGlobalLoader: () => set((state) => ({ globalLoadingCount: Math.max(0, state.globalLoadingCount - 1) })),
  theme: getInitialTheme(),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  initTheme: () => {
    const theme = getInitialTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}));
