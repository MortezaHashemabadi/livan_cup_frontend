"use client";
import { createContext, useContext, useState } from "react";

interface AuthModalContextValue {
  isOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        openAuthModal: () => setIsOpen(true),
        closeAuthModal: () => setIsOpen(false),
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx)
    throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
