"use client";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A1A30",
            color: "#ffffff",
            border: "1px solid rgba(124,58,237,0.4)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#7C3AED", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
    </>
  );
}
