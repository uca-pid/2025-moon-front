import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Car,
  Package,
  Settings,
  UserIcon,
  Clock,
  ChartNoAxesCombined,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getNextAppointmentsOfUser } from "@/services/appointments";
import { getVehiclesOfUser } from "@/services/vehicles";
import type { Appointment } from "@/types/appointments.types";
import { useStore } from "@/zustand/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Home() {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    vehicles: 0,
  });

  useEffect(() => {
    if (user.userRole !== "USER") return;

    const fetchStats = async () => {
      try {
        const [appointmentsRaw, vehiclesRaw] = await Promise.all([
          getNextAppointmentsOfUser(),
          getVehiclesOfUser(),
        ]);

        const appointments = (appointmentsRaw ?? []) as Appointment[];
        const vehicles = (vehiclesRaw ?? []) as unknown[];

        setStats({
          upcomingAppointments: Array.isArray(appointments)
            ? appointments.length
            : 0,
          vehicles: Array.isArray(vehicles) ? vehicles.length : 0,
        });
      } catch {
        toast.error("Error al obtener las estadísticas");
      }
    };

    fetchStats();
  }, [user.userRole]);

  const userQuickActions = [
    {
      title: "Reservar Turno",
      description: "Agenda un nuevo turno para tu vehículo",
      icon: Calendar,
      href: "/reserve",
      color: "text-blue-600",
    },
    {
      title: "Mis Vehículos",
      description: "Gestiona tus vehículos registrados",
      icon: Car,
      href: "/vehicles",
      color: "text-green-600",
    },
    {
      title: "Mis Turnos",
      description: "Revisa tus turnos reservados",
      icon: Clock,
      href: "/appointments",
      color: "text-purple-600",
    },
    {
      title: "Dashboards",
      description: "Revisa estadisticas de tus vehiculos y turnos",
      icon: ChartNoAxesCombined,
      href: "/dashboards",
      color: "text-yellow-600",
    },
  ];

  const mechanicQuickActions = [
    {
      title: "Mis Turnos",
      description: "Gestiona tus turnos asignados",
      icon: Calendar,
      href: "/shifts",
      color: "text-blue-600",
    },
    {
      title: "Repuestos",
      description: "Administra el inventario de repuestos",
      icon: Package,
      href: "/spare-parts",
      color: "text-orange-600",
    },
    {
      title: "Servicios",
      description: "Gestiona los servicios disponibles",
      icon: Settings,
      href: "/services",
      color: "text-green-600",
    },
  ];

  const quickActions =
    user.userRole === "MECHANIC" ? mechanicQuickActions : userQuickActions;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Hola, <span className="text-primary">{user.fullName}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {user.userRole === "MECHANIC"
              ? "Bienvenido a tu panel de mecánico"
              : "Bienvenido a tu panel de gestión de vehículos"}
          </p>
        </div>
        {user.userRole === "USER" && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Turnos Próximos
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.upcomingAppointments}
                </div>
                <p className="text-xs text-muted-foreground">
                  Turnos agendados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mis Vehículos
                </CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.vehicles}</div>
                <p className="text-xs text-muted-foreground">
                  Vehículos registrados
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Accesos Rápidos
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.href}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(action.href)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors`}
                      >
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {action.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <UserIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Mi Perfil</CardTitle>
                  <CardDescription>
                    Gestiona tu información personal y configuración
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/profile")}>
                Ver Perfil
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
