import type React from 'react'

import { Link, useLocation, useNavigate } from 'react-router-dom'
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
} from '@/components/ui/sidebar'
import { useStore } from '@/zustand/store'
import { UserRoles } from '@/zustand/session/session.types'
import type { UserRole } from '@/zustand/session/session.types'
import {
  Home,
  Calendar,
  Wrench,
  User,
  Moon,
  Sun,
  Plus,
  Car,
  Hammer,
  Cog,
  Menu,
  Bell,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  getNotifications,
  markNotificationAsRead,
} from '@/services/notifications'
import { useQuery } from 'react-query'
import type { Notification } from '@/types/notifications.types'
import { useState } from 'react'

export const AppSidebar = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const user = useStore((state) => state.user)
  const themeMode = useStore((state) => state.themeMode)
  const navigate = useNavigate()
  const { data: notifications, refetch } = useQuery(
    'notifications',
    () => getNotifications(),
    {
      initialData: [],
    }
  )
  const toggleTheme = useStore((state) => state.toggleTheme)

  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  const isRealRole = (
    role: UserRole
  ): role is Exclude<UserRole, typeof UserRoles.NULL> => role !== UserRoles.NULL

  type NavItem = {
    path: string
    label: string
    userRole: UserRole[]
    icon: React.ReactNode
  }

  const navPaths: NavItem[] = [
    {
      path: '/home',
      label: 'Inicio',
      userRole: [UserRoles.USER, UserRoles.MECHANIC],
      icon: <Home className='size-4' />,
    },
    {
      path: '/appointments',
      label: 'Mis turnos',
      userRole: [UserRoles.USER],
      icon: <Calendar className='size-4' />,
    },
    {
      path: '/vehicles',
      label: 'Mis vehiculos',
      userRole: [UserRoles.USER],
      icon: <Car className='size-4' />,
    },
    {
      path: '/shifts',
      label: 'Turnos',
      userRole: [UserRoles.MECHANIC],
      icon: <Wrench className='size-4' />,
    },
    {
      path: '/reserve',
      label: 'Reservar',
      userRole: [UserRoles.USER],
      icon: <Plus className='size-4' />,
    },
    {
      path: '/spare-parts',
      label: 'Repuestos',
      userRole: [UserRoles.MECHANIC],
      icon: <Cog className='size-4' />,
    },
    {
      path: '/services',
      label: 'Servicios',
      userRole: [UserRoles.MECHANIC],
      icon: <Hammer className='size-4' />,
    },
  ] as const

  return (
    <SidebarProvider>
      <Sidebar collapsible='icon' className='border-r'>
        <SidebarHeader className='flex items-center justify-between p-2'>
          <div className='flex items-center gap-2 relative'>
            <img src='/estaller-logo.png' alt='ESTALLER' className='h-8 w-8' />
            <span className='text-sm font-semibold transition-opacity duration-200 group-data-[collapsible=icon]:hidden'>
              ESTALLER
            </span>

            <div className='relative'>
              <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger
                  className={notifications.length > 0 ? 'cursor-pointer' : ''}
                >
                  <Bell className='size-6' />
                  {notifications.length > 0 && (
                    <span className='absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center'>
                      {notifications.length}
                    </span>
                  )}
                </PopoverTrigger>
                {notifications.length > 0 && (
                  <PopoverContent>
                    <div>
                      <div className='p-2'>
                        <div className='font-semibold border-b'>
                          Notificaciones
                        </div>
                        <ul>
                          {notifications?.map((notification: Notification) => (
                            <li
                              key={notification.id}
                              className='text-sm border p-4 hover:bg-accent cursor-pointer transition'
                              onClick={() => {
                                const redirectTo =
                                  user.userRole === UserRoles.USER
                                    ? '/appointments'
                                    : '/shifts'
                                markNotificationAsRead(notification.id).then(
                                  refetch
                                )
                                navigate(redirectTo)
                                setOpen(false)
                              }}
                            >
                              {notification.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </PopoverContent>
                )}
              </Popover>
            </div>
          </div>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className='gap-2'>
                {navPaths.map((nav) => {
                  const allowed =
                    isRealRole(user.userRole) &&
                    nav.userRole.includes(user.userRole)
                  if (!allowed) return null
                  const isActive = location.pathname === nav.path
                  return (
                    <SidebarMenuItem key={nav.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={nav.label}
                      >
                        <Link to={nav.path} className='flex items-center gap-2'>
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
          <SidebarMenu className='gap-2'>
            <SidebarMenuItem>
              <SidebarMenuButton
                className='hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer'
                tooltip='Cambiar tema'
                onClick={toggleTheme}
              >
                {isDark ? (
                  <Sun className='size-4' />
                ) : (
                  <Moon className='size-4' />
                )}
                <span>Cambiar tema</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === '/profile'}
                tooltip='Perfil'
              >
                <Link to='/profile' className='flex items-center gap-2'>
                  <User className='size-4' />
                  <span>Perfil</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      {children ? (
        <SidebarInset>
          <header className='sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden text-foreground'>
            <SidebarTrigger className='flex items-center gap-2'>
              <Menu className='size-5' />
              <span className='sr-only'>Abrir menú</span>
            </SidebarTrigger>
            <div className='flex items-center gap-2'>
              <img
                src='/estaller-logo.png'
                alt='ESTALLER'
                className='h-6 w-6'
              />
              <span className='text-sm font-semibold'>ESTALLER</span>
            </div>
          </header>
          {children}
        </SidebarInset>
      ) : null}
    </SidebarProvider>
  )
}

export default AppSidebar
