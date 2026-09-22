import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface UiState {
  globalLoadingCount: number;
  showGlobalLoader: () => void;
  hideGlobalLoader: () => void;
  theme: Theme;
  toggleTheme: () => void;
  initTheme: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNavOpen: () => void;
}

const SIDEBAR_COLLAPSED_KEY = 'sidebar_collapsed';

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored as Theme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  }
  return 'light';
};

const getInitialSidebarCollapsed = (): boolean => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
  return stored === 'true';
};

export const useUiStore = create<UiState>((set, get) => ({
  globalLoadingCount: 0,
  showGlobalLoader: () => set((state) => ({ globalLoadingCount: state.globalLoadingCount + 1 })),
  hideGlobalLoader: () => set((state) => ({ globalLoadingCount: Math.max(0, state.globalLoadingCount - 1) })),
  theme: getInitialTheme(),
  sidebarCollapsed: getInitialSidebarCollapsed(),
  mobileNavOpen: false,
  setSidebarCollapsed: (collapsed: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? 'true' : 'false');
    }
    set({ sidebarCollapsed: collapsed });
  },
  toggleSidebarCollapsed: () => {
    const next = !get().sidebarCollapsed;
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? 'true' : 'false');
    }
    set({ sidebarCollapsed: next });
  },
  setMobileNavOpen: (open: boolean) => set({ mobileNavOpen: open }),
  toggleMobileNavOpen: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
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
