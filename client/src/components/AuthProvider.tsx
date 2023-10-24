"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface props {
  children: ReactNode;
}
export function AuthProvider({ children }: props) {
  return <SessionProvider>{children}</SessionProvider>;
}
