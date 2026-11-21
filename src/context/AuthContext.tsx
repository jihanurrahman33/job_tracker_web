"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User, LoginRequest, RegisterRequest } from "@/types/api";
import { api, tokenStorage } from "@/lib/api";
import { useToast } from "./ToastContext";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_PATHS = ["/", "/login", "/register"];
const AUTH_PATHS = ["/login", "/register"];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    const savedToken = tokenStorage.get();
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      setToken(savedToken);
      const userData = await api.getMe();
      setUser(userData);
    } catch (err) {
      console.warn("Session verification failed, logging out", err);
      tokenStorage.remove();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Route protection
  useEffect(() => {
    if (!isLoading) {
      const isPublicPath = PUBLIC_PATHS.includes(pathname);
      if (!user && !isPublicPath) {
        router.push("/login");
      } else if (user && AUTH_PATHS.includes(pathname)) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await api.login(credentials);
      tokenStorage.set(res.token);
      setToken(res.token);
      setUser(res.user);
      success("Welcome back!", `Signed in as ${res.user.name}`);
      router.push("/dashboard");
      return true;
    } catch (err: any) {
      error("Sign in failed", err.message || "Please check your credentials.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await api.register(data);
      tokenStorage.set(res.token);
      setToken(res.token);
      setUser(res.user);
      success("Account created!", `Welcome to Job Tracker, ${res.user.name}`);
      router.push("/dashboard");
      return true;
    } catch (err: any) {
      let detailMsg = err.message;
      if (err.details) {
        detailMsg = Object.values(err.details).join(", ");
      }
      error("Registration failed", detailMsg || "Please verify your details.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore logout errors, ensure client state is cleared
    } finally {
      tokenStorage.remove();
      setUser(null);
      setToken(null);
      success("Signed out", "You have been safely logged out.");
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
