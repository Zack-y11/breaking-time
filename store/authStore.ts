import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isOnboardingComplete: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  setOnboardingComplete: (v: boolean) => void;
  initialize: () => () => void;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    username: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  isOnboardingComplete: false,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (isLoading) => set({ isLoading }),
  setOnboardingComplete: (v) => set({ isOnboardingComplete: v }),

  initialize: () => {
    supabase.auth.getSession().then(({ data }) => {
      set({
        session: data.session,
        user: data.session?.user ?? null,
        isLoading: false,
      });
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({ session, user: session?.user ?? null });
      },
    );
    return () => listener.subscription.unsubscribe();
  },

  signInWithEmail: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  signUpWithEmail: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase
        .from("users")
        .insert({ id: userId, username });
      if (profileError) return { error: profileError.message };
    }
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isOnboardingComplete: false });
  },
}));
