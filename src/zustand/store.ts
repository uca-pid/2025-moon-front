import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

import { createSessionSlice, type SessionSlice } from './session/session.slice';

// Combine all slices
type StoreState = SessionSlice;

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (...a) => ({
        ...createSessionSlice(...a),
      }),
      {
        name: 'app-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ user: state.user }),
        onRehydrateStorage: () => (state) => {
          if (state?.user?.expiresAt?.date) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const raw = (state.user.expiresAt.date as any) as string;
            state.user.expiresAt.date = new Date(raw);
          }
        },
      }
    ),
    { name: 'App Store' }
  )
);