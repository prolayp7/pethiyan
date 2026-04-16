"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { getProfile, logoutUserSession } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  mobile: string;
  email?: string | null;
  company_name?: string | null;
  gstin?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (user: AuthUser, token?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_TOKEN_KEY = "auth_token";
const LS_USER_KEY = "auth_user";
const AUTH_SESSION_MARKER = "__http_only_session__";

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true until hydration check done

  useEffect(() => {
    let cancelled = false;

    async function hydrateAuth() {
      try {
        const storedToken = localStorage.getItem(LS_TOKEN_KEY);
        const storedUser = localStorage.getItem(LS_USER_KEY);

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser) as AuthUser;
          if (!cancelled) {
            setToken(storedToken);
            setUser(parsedUser);
          }
        }

        // Only verify with the server when there is a local session marker.
        // Calling getProfile() unconditionally would hit /api/user/profile on
        // every page load for every logged-out visitor, producing a 401 in the
        // console for every guest. The HttpOnly cookie is the real session —
        // storedToken is the client-side signal that a session should exist.
        if (storedToken) {
          const profile = await getProfile();
          if (cancelled) return;

          if (profile) {
            setUser(profile);
            setToken(AUTH_SESSION_MARKER);
            localStorage.setItem(LS_TOKEN_KEY, AUTH_SESSION_MARKER);
            localStorage.setItem(LS_USER_KEY, JSON.stringify(profile));
          } else {
            // Server rejected the session (cookie expired or revoked).
            // Clear local state so the user is shown as logged out.
            setUser(null);
            setToken(null);
            localStorage.removeItem(LS_TOKEN_KEY);
            localStorage.removeItem(LS_USER_KEY);
          }
        }
      } catch {
        localStorage.removeItem(LS_TOKEN_KEY);
        localStorage.removeItem(LS_USER_KEY);
        if (!cancelled) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void hydrateAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((authUser: AuthUser) => {
    setUser(authUser);
    setToken(AUTH_SESSION_MARKER);
    localStorage.setItem(LS_TOKEN_KEY, AUTH_SESSION_MARKER);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(authUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(LS_TOKEN_KEY);
    localStorage.removeItem(LS_USER_KEY);
    void logoutUserSession();
  }, []);

  const updateUser = useCallback((data: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem(LS_USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const AUTH_DEFAULTS: AuthContextType = {
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  // During SSR the AuthProvider hasn't mounted yet — return safe defaults
  // so server rendering succeeds. The client hydration will supply real values.
  return context ?? AUTH_DEFAULTS;
}
