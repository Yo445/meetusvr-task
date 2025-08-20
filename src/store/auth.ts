import { create } from "zustand";

export type User = { 
  id: string | number; 
  name: string;
} | null;

interface AuthState {
  user: User;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));
