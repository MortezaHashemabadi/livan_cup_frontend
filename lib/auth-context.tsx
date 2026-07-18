"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { api, registerAuthHooks } from "./api/client";
import type {
  User,
  OtpVerifyResponse,
  TokenRefreshResponse,
} from "./api/types";

const REFRESH_KEY = "il_refresh_token";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  isLoadingAuth: boolean;
  sendOtp: (phone: string, purpose?: "login" | "register") => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<{ created: boolean }>;
  logout: (redirect?: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessTokenRef = useRef<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const setSession = useCallback(
    (access: string, refresh: string, userData: User) => {
      accessTokenRef.current = access;
      localStorage.setItem(REFRESH_KEY, refresh);
      setUser(userData);
      setIsAuthenticated(true);
    },
    [],
  );

  const clearSession = useCallback(() => {
    accessTokenRef.current = null;
    localStorage.removeItem(REFRESH_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const refresh = useCallback(async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) return null;
    try {
      const res = await api.post<TokenRefreshResponse>(
        "/accounts/token/refresh/",
        { refresh: refreshToken },
        { auth: false },
      );
      accessTokenRef.current = res.access;
      if (res.refresh) localStorage.setItem(REFRESH_KEY, res.refresh);
      return res.access;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    registerAuthHooks({
      getAccessToken: () => accessTokenRef.current,
      onRefresh: refresh,
      onAuthFailure: clearSession,
    });
  }, [refresh, clearSession]);

  useEffect(() => {
    (async () => {
      const access = await refresh();
      if (access) {
        try {
          const me = await api.get<User>("/accounts/me/");
          setUser(me);
          setIsAuthenticated(true);
        } catch {
          clearSession();
        }
      }
      setIsLoadingAuth(false);
    })();
  }, [refresh, clearSession]);

  const sendOtp = useCallback(
    async (phone: string, purpose: "login" | "register" = "login") => {
      await api.post(
        "/accounts/otp/send/",
        { phone, purpose },
        { auth: false },
      );
    },
    [],
  );

  const verifyOtp = useCallback(
    async (phone: string, code: string) => {
      const res = await api.post<OtpVerifyResponse>(
        "/accounts/otp/verify/",
        { phone, code },
        { auth: false },
      );
      setSession(res.access, res.refresh, res.user);
      return { created: res.created };
    },
    [setSession],
  );

  const logout = useCallback(
    (redirect: boolean = true) => {
      clearSession();
      if (redirect && typeof window !== "undefined") window.location.href = "/";
    },
    [clearSession],
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoadingAuth,
        sendOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
