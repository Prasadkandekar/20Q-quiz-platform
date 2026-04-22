import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground">20Q</span>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </nav>
  )
}
