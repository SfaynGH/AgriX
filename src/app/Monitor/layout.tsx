import type React from "react"
import { TopNav } from "@/components/nav"

export default function TicketLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TopNav title="Plant Health Monitor" />
      <main className="container mx-auto px-4 py-6 max-w-7xl">{children}</main>
    </>
  )
}
