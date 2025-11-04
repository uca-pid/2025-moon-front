import { useEffect, useState } from "react"
import { Container } from "@/components/Container"
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

export function MechanicDashboard() {
  const [services, setServices] = useState<(Service & { appointmentsCount: number })[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [servicesData, appointmentsData] = await Promise.all([
          getRequestedServicesByMechanicId(),
          getNextAppointmentsOfMechanic(),
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
              name: sparePart.sparePartName ?? "",
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

  const COLORS = ["#60a5fa", "#a78bfa", "#f472b6", "#fb923c", "#34d399", "#22d3ee", "#818cf8", "#f97316"]

  if (loading) {
    return (
      <Container>
        <div className="flex flex-col gap-6">
          <div className="h-10 w-64 bg-accent/50 rounded-2xl animate-pulse" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-[400px] bg-accent/50 rounded-3xl animate-pulse" />
            <div className="h-[400px] bg-accent/50 rounded-3xl animate-pulse" />
          </div>
          <div className="h-[400px] bg-accent/50 rounded-3xl animate-pulse" />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Análisis y estadísticas de tu taller</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Servicios más solicitados</h2>
                <p className="text-sm text-muted-foreground">Cantidad de turnos por servicio</p>
              </div>
            </div>
            {servicesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={servicesChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {servicesChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      color: "hsl(var(--foreground))",
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
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-2xl">
                <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Consumo de stock de repuestos</h2>
                <p className="text-sm text-muted-foreground">Unidades consumidas por repuesto</p>
              </div>
            </div>
            {sparePartsConsumption.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sparePartsConsumption}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[
                      0,
                      Math.max(...sparePartsConsumption.map((item) => item.value)) < 5
                        ? 5
                        : Math.max(...sparePartsConsumption.map((item) => item.value)),
                    ]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar dataKey="value" fill="#a78bfa" name="Unidades consumidas" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No hay datos de repuestos disponibles
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-500/10 rounded-2xl">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Horarios más concurridos del taller</h2>
              <p className="text-sm text-muted-foreground">Cantidad de turnos por franja horaria (8:00 - 17:00)</p>
            </div>
          </div>
          {busyHoursData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={busyHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <YAxis
                  domain={[
                    0,
                    Math.max(...busyHoursData.map((item) => item.appointments)) < 5
                      ? 5
                      : Math.max(...busyHoursData.map((item) => item.appointments)),
                  ]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Area type="monotone" dataKey="appointments" stroke="#fb923c" fill="#fdba74" name="Turnos" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No hay datos de turnos disponibles
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
