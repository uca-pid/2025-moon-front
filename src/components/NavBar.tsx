import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserRoles } from "@/zustand/session/session.types";
import type { UserRole } from "@/zustand/session/session.types";
import { useStore } from "@/zustand/store";

export const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useStore((state) => state.user)
  const isRealRole = (role: UserRole): role is Exclude<UserRole, typeof UserRoles.NULL> => role !== UserRoles.NULL
  const navPaths = [
    {
      path: "/home",
      label: "Inicio",
      userRole: [UserRoles.USER, UserRoles.MECHANIC]
    },
    {
      path: "/appointments",
      label: "Mis turnos",
      userRole: [UserRoles.USER]
    },
    {
      path: "/shifts",
      label: "Turnos",
      userRole: [UserRoles.MECHANIC]
    },
  ]

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {navPaths.map((navPath) => (
              <NavigationMenuItem key={navPath.path}>
                {
                  isRealRole(user.userRole) && navPath.userRole.includes(user.userRole) && (
                    <NavigationMenuLink asChild className={`${location.pathname === navPath.path && "bg-accent"}`}>
                      <Link className="px-3 py-2 rounded-md" to={navPath.path}>
                        {navPath.label}
                      </Link>
                    </NavigationMenuLink>
                  )
                }
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" className={`rounded-full px-5 ${location.pathname === "/profile" && "bg-accent"}`} onClick={() => navigate("/profile")}>
            Perfil
          </Button>
        </div>
      </div>
    </header>
  );
};


