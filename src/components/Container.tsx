import { NavBar } from "./NavBar"

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center w-full gap-10">
      <NavBar />
      {children}
    </div>
  )
}