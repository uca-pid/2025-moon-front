import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/Container"
import { Skeleton } from "@/components/ui/skeleton"
import { getNextAppointmentsOfMechanic } from "@/services/appointments"
import { getRequestedServicesByMechanicId } from "@/services/services"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts"
import { Wrench, Package, Clock } from "lucide-react"
import type { Service, SparePartService } from "@/types/services.types"
import type { Appointment } from "@/types/appointments.types"

export const MechanicDashboard = () => {
  const [services, setServices] = useState<(Service & { appointmentsCount: number })[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [servicesData, appointmentsData] = await Promise.all([
          getRequestedServicesByMechanicId(),
          getNextAppointmentsOfMechanic("future"),
        ])
        setServices(servicesData)
        setAppointments(appointmentsData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const servicesChartData = services
    .filter((service) => service.appointmentsCount && service.appointmentsCount > 0)
    .map((service) => ({
      name: service.name,
      value: service.appointmentsCount,
    }))
    .sort((a, b) => b.value - a.value)

  const sparePartsConsumption = services
    .reduce(
      (acc, service) => {
        service.spareParts.forEach((sparePart: SparePartService) => {
          const totalConsumption = sparePart.quantity * service.appointmentsCount
          const existing = acc.find((item) => item.name === sparePart.sparePartName)
          if (existing) {
            existing.value += totalConsumption
          } else {
            acc.push({
              name: sparePart.sparePartName ?? '',
              value: totalConsumption,
            })
          }
        })
        return acc
      },
      [] as { name: string; value: number }[],
    )
    .sort((a, b) => b.value - a.value)

  const timeSlots = []
  for (let hour = 8; hour <= 17; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`)
    if (hour < 17) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:30`)
    }
  }

  const busyHoursData = timeSlots.map((slot) => {
    const count = appointments.filter((apt) => {
      const aptTime = apt.time.substring(0, 5)
      return aptTime === slot
    }).length
    return {
      time: slot,
      appointments: count,
    }
  })

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#6366f1", "#f97316"]

  if (loading) {
    return (
      <Container>
        <div className="flex flex-col gap-6 p-6">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
          </div>
          <Skeleton className="h-[400px]" />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">Análisis y estadísticas de tu taller</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Servicios más solicitados</CardTitle>
                  <CardDescription>Cantidad de turnos por servicio</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {servicesChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={servicesChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {servicesChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                    itemStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    contentStyle={{
                      backgroundColor: "black",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "white",
                    }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No hay datos de servicios disponibles
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Consumo de stock de repuestos</CardTitle>
                  <CardDescription>Unidades consumidas por repuesto</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {sparePartsConsumption.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sparePartsConsumption}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, (Math.max(...sparePartsConsumption.map(item => item.value))) < 5 ? 5 : Math.max(...sparePartsConsumption.map(item => item.value))]} />
                    <Tooltip itemStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    contentStyle={{
                      backgroundColor: "black",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "white",
                    }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" name="Unidades consumidas" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No hay datos de repuestos disponibles
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle>Horarios más concurridos del taller</CardTitle>
                <CardDescription>Cantidad de turnos por franja horaria (8:00 - 17:00)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {busyHoursData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={busyHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, (Math.max(...busyHoursData.map(item => item.appointments))) < 5 ? 5 : Math.max(...busyHoursData.map(item => item.appointments))]} />
                  <Tooltip
                  itemStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                  contentStyle={{
                    backgroundColor: "black",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "white",
                  }}
                  />
                  <Area type="monotone" dataKey="appointments" stroke="#f59e0b" fill="#fbbf24" name="Turnos" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No hay datos de turnos disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
