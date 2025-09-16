import type { StateCreator } from 'zustand';

import type { SessionState, User } from './session.types';
import { sessionInitialState } from './session.types';

export interface SessionActions {
  login: (data: User) => void;
}

export interface SessionSlice extends SessionState, SessionActions {}

export const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  ...sessionInitialState,

  login: (data: User) => {
    set((state) => ({
      user: {
        ...state.user,
        ...data,
      },
    }));
  },
});