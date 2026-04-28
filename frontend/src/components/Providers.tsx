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
            background: "linear-gradient(135deg,#DDE7FF,#EEF3FF)",
            color: "#111322",
            border: "1px solid rgba(47,69,216,0.4)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#2F45D8", secondary: "#111322" },
          },
          error: {
            iconTheme: { primary: "#2F45D8", secondary: "#111322" },
          },
        }}
      />
    </>
  );
}
