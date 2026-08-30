"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { serverStorage, api } from "@/lib/api";
import { SERVER_PRESETS } from "@/lib/constants";

interface ServerContextType {
  serverUrl: string;
  setServerUrl: (url: string) => void;
  resetServerUrl: () => void;
  isOnline: boolean | null;
  isReady: boolean | null;
  isChecking: boolean;
  checkServerHealth: (
    customUrl?: string,
  ) => Promise<{ online: boolean; ready: boolean }>;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [serverUrl, setServerUrlState] = useState<string>(
    SERVER_PRESETS[0].url,
  );
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    const saved = serverStorage.get();
    if (saved) {
      setServerUrlState(saved);
    }
  }, []);

  const checkServerHealth = useCallback(
    async (targetUrl?: string) => {
      const url = targetUrl || serverUrl;
      setIsChecking(true);
      try {
        const [healthOk, readyOk] = await Promise.all([
          api.checkHealth(url).catch(() => false),
          api.checkReady(url).catch(() => false),
        ]);
        setIsOnline(healthOk);
        setIsReady(readyOk);
        return { online: healthOk, ready: readyOk };
      } catch {
        setIsOnline(false);
        setIsReady(false);
        return { online: false, ready: false };
      } finally {
        setIsChecking(false);
      }
    },
    [serverUrl],
  );

  useEffect(() => {
    checkServerHealth(serverUrl);
  }, [serverUrl, checkServerHealth]);

  const setServerUrl = (url: string) => {
    serverStorage.set(url);
    setServerUrlState(url);
    checkServerHealth(url);
  };

  const resetServerUrl = () => {
    serverStorage.reset();
    const def = SERVER_PRESETS[0].url;
    setServerUrlState(def);
    checkServerHealth(def);
  };

  return (
    <ServerContext.Provider
      value={{
        serverUrl,
        setServerUrl,
        resetServerUrl,
        isOnline,
        isReady,
        isChecking,
        checkServerHealth,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useServer must be used within a ServerProvider");
  }
  return context;
};
