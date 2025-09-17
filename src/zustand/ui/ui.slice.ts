import type { StateCreator } from 'zustand'

export interface UiState {
  loading: boolean
  loadingMessage?: string
}

export interface UiActions {
  showLoading: (message?: string) => void
  hideLoading: () => void
}

export interface UiSlice extends UiState, UiActions {}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  loading: false,
  loadingMessage: undefined,

  showLoading: (message?: string) => set(() => ({ loading: true, loadingMessage: message })),
  hideLoading: () => set(() => ({ loading: false, loadingMessage: undefined })),
})


