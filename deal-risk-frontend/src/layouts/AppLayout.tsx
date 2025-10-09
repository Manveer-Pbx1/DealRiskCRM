import { Navbar } from "../components/common/Navbar"
import React, { ReactNode } from "react"

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
      <main style={{ flex: 1, padding: "1rem" }}>{children}</main>
      <footer className="text-center text-[rgb(var(--text))] p-4 border-t font-bold">
        © 2025 DealRisk
      </footer>
    </div>
  )
}