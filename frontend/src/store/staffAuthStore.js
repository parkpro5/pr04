import { create } from 'zustand';

const TOKEN_KEY = 'pr04_staff_token';

export const useStaffAuthStore = create((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  staff: null,

  setSession: (token, staff) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ token, staff });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, staff: null });
  },
}));
