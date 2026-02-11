export const dynamic = 'force-dynamic'; // <--- AGREGÁ ESTO

import type React from "react"

export const metadata = {
  title: "Live Rankings - Camp Score",
  description: "View real-time competition rankings",
}

export default function RankingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
