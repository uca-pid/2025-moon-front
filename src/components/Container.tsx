import { AppSidebar } from "./AppSidebar"
import { cn } from "@/lib/utils"

export const Container = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("min-h-screen w-full bg-background", className)}>
      <AppSidebar>{children}</AppSidebar>
    </div>
  )
}