import type { StateCreator } from 'zustand'

export interface UiState {
  loading: boolean
  loadingMessage?: string
  themeMode: 'light' | 'dark' | 'system'
}

export interface UiActions {
  showLoading: (message?: string) => void
  hideLoading: () => void
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
}

export interface UiSlice extends UiState, UiActions {}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  loading: false,
  loadingMessage: undefined,
  themeMode: 'system',

  showLoading: (message?: string) => set(() => ({ loading: true, loadingMessage: message })),
  hideLoading: () => set(() => ({ loading: false, loadingMessage: undefined })),
  setThemeMode: (mode) => set(() => ({ themeMode: mode })),
  toggleTheme: () =>
    set((state) => ({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark' })),
})


