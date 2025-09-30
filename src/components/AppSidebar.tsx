import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useStore } from "@/zustand/store"
import { UserRoles } from "@/zustand/session/session.types"
import type { UserRole } from "@/zustand/session/session.types"
import { Home, Calendar, Wrench, User, Moon, Sun, Plus } from "lucide-react"

export const AppSidebar = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation()
  const user = useStore((state) => state.user)
  const themeMode = useStore((state) => state.themeMode)
  const toggleTheme = useStore((state) => state.toggleTheme)

  const isDark = themeMode === 'dark' || (themeMode === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const isRealRole = (role: UserRole): role is Exclude<UserRole, typeof UserRoles.NULL> => role !== UserRoles.NULL

  type NavItem = {
    path: string
    label: string
    userRole: UserRole[]
    icon: React.ReactNode
  }

  const navPaths: NavItem[] = [
    {
      path: "/home",
      label: "Inicio",
      userRole: [UserRoles.USER, UserRoles.MECHANIC],
      icon: <Home className="size-4" />,
    },
    {
      path: "/appointments",
      label: "Mis turnos",
      userRole: [UserRoles.USER],
      icon: <Calendar className="size-4" />,
    },
    {
      path: "/shifts",
      label: "Turnos",
      userRole: [UserRoles.MECHANIC],
      icon: <Wrench className="size-4" />,
    },
    {
      path: "/reserve",
      label: "Reservar",
      userRole: [UserRoles.USER],
      icon: <Plus className="size-4" />,
    },
  ] as const

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <img src="/estaller-logo.png" alt="ESTALLER" className="h-8 w-8" />
            <span className="text-sm font-semibold transition-opacity duration-200 group-data-[collapsible=icon]:hidden">ESTALLER</span>
          </div>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {navPaths.map((nav) => {
                  const allowed = isRealRole(user.userRole) && nav.userRole.includes(user.userRole)
                  if (!allowed) return null
                  const isActive = location.pathname === nav.path
                  return (
                    <SidebarMenuItem key={nav.path}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={nav.label}>
                        <Link to={nav.path} className="flex items-center gap-2">
                          {nav.icon}
                          <span>{nav.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Cambiar tema" onClick={toggleTheme}>
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                <span>Cambiar tema</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/profile"} tooltip="Perfil">
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="size-4" />
                  <span>Perfil</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      {children ? <SidebarInset>{children}</SidebarInset> : null}
    </SidebarProvider>
  )
}

export default AppSidebar


