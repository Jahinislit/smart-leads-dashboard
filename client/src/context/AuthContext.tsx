import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { api } from "../api/client";
import type { ApiResponse, Role, User } from "../types";

interface AuthResult {
  token: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login(email: string, password: string): Promise<void>;
  register(input: { name: string; email: string; password: string; role: Role }): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const storedUser = (): User | null => {
  const raw = localStorage.getItem("smart_leads_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem("smart_leads_user");
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("smart_leads_token"));
  const [user, setUser] = useState<User | null>(() => storedUser());

  const persist = (result: AuthResult): void => {
    localStorage.setItem("smart_leads_token", result.token);
    localStorage.setItem("smart_leads_user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      async login(email, password) {
        const { data } = await api.post<ApiResponse<AuthResult>>("/auth/login", { email, password });
        persist(data.data);
      },
      async register(input) {
        const { data } = await api.post<ApiResponse<AuthResult>>("/auth/register", input);
        persist(data.data);
      },
      logout() {
        localStorage.removeItem("smart_leads_token");
        localStorage.removeItem("smart_leads_user");
        setToken(null);
        setUser(null);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
