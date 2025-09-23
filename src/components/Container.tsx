import { AppSidebar } from "./AppSidebar"

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full">
      <AppSidebar>{children}</AppSidebar>
    </div>
  )
}