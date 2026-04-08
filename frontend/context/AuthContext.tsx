"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  mobile: string;
  email?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────
// We store the token in a cookie (name: "auth_token") so that
// middleware.ts can read it on the server side for route protection.

function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_TOKEN_KEY = "auth_token";
const LS_USER_KEY = "auth_user";

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true until hydration check done

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(LS_TOKEN_KEY);
      const storedUser = localStorage.getItem(LS_USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Corrupted storage — clear it
      localStorage.removeItem(LS_TOKEN_KEY);
      localStorage.removeItem(LS_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((authUser: AuthUser, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    localStorage.setItem(LS_TOKEN_KEY, authToken);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(authUser));
    // Also set a cookie so middleware can read it
    setCookie("auth_token", authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(LS_TOKEN_KEY);
    localStorage.removeItem(LS_USER_KEY);
    deleteCookie("auth_token");
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
