import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export const NavBar = () => {
  const location = useLocation();

  const navPaths = [
    {
      path: "/home",
      label: "Inicio"
    },
    {
      path: "/appointments",
      label: "Mis turnos"
    }
  ]

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {navPaths.map((navPath) => (
              <NavigationMenuItem key={navPath.path}>
                <NavigationMenuLink asChild className={`${location.pathname === navPath.path && "bg-accent"}`}>
                  <Link className="px-3 py-2 rounded-md" to={navPath.path}>
                    {navPath.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <Button variant="outline" className="rounded-full px-5">
          Perfil
        </Button>
      </div>
    </header>
  );
};


