import { useEffect, useState } from "react"
import { Container } from "@/components/Container"
import { getNextAppointmentsOfMechanic } from "@/services/appointments"
import { getRequestedServicesByMechanicId } from "@/services/services"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  BarChart,
  Bar,
  type TooltipProps,
} from "recharts"
import { Wrench, Package, Clock, Star } from "lucide-react"
import type { Service, SparePartService } from "@/types/services.types"
import type { Appointment } from "@/types/appointments.types"
import { getReviews } from "@/services/users"
import { useStore } from "@/zustand/store"
import type { MechanicReview } from "@/types/users.types"
import { toStars, getSubcategoryCounts, subLabel } from "@/helpers/reviews"
import { ReviewEnum, SubCategroriesEnum } from "@/types/users.types"

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null

  type PayloadType = {
    value?: number
    name?: string
    fill?: string
    payload?: { name?: string; fill?: string; total?: number }
  }

  const data = payload[0] as unknown as PayloadType
  const total = payload.reduce((acc, curr) => acc + (curr.value ?? 0), 0)
  const value = data.value ?? 0
  const percentage = total > 0 ? (((value) / total) * 100).toFixed(1) : 0
  const title = data.payload?.name ?? data.name ?? ""
  const color = data.payload?.fill ?? data.fill ?? "hsl(var(--muted-foreground))"

  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <p className="font-semibold text-foreground">{title}</p>
      </div>
      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground">
          Cantidad: <span className="font-medium text-foreground">{value}</span>
        </p>
        <p className="text-muted-foreground">
          Porcentaje: <span className="font-medium text-foreground">{percentage}%</span>
        </p>
      </div>
    </div>
  )
}

const CustomLegend = ({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      {data.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2 px-3 py-1.5 bg-accent/30 rounded-full">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
          <span className="text-xs font-medium text-foreground">{entry.name}</span>
        </div>
      ))}
    </div>
  )
}

const renderCenterLabel = (total: number, label: string) => {
  return (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan x="50%" dy="-0.5em" className="text-3xl font-bold fill-foreground">
        {total}
      </tspan>
      <tspan x="50%" dy="1.5em" className="text-sm fill-muted-foreground">
        {label}
      </tspan>
    </text>
  )
}

type DashboardSection = "services" | "stock" | "reviews" | "hours"

export const MechanicDashboard = () => {
  const { user } = useStore()
  const [services, setServices] = useState<(Service & { appointmentsCount: number })[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [reviews, setReviews] = useState<MechanicReview[]>([])
  const [loading, setLoading] = useState(true)

  const [visibleSections, setVisibleSections] = useState<Set<DashboardSection>>(
    new Set(["services", "stock", "reviews", "hours"]),
  )

  const toggleSection = (section: DashboardSection) => {
    setVisibleSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [servicesData, appointmentsData, reviewsData] = await Promise.all([
          getRequestedServicesByMechanicId(),
          getNextAppointmentsOfMechanic(),
          getReviews(user.id),
        ])
        setServices(servicesData)
        setAppointments(appointmentsData)
        setReviews(reviewsData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user.id])

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

  const totalServices = servicesChartData.reduce((acc, item) => acc + item.value, 0)
  const servicesWithTotal = servicesChartData.map((item) => ({ ...item, total: totalServices }))

  const reviewsAggregate: MechanicReview | undefined = Array.isArray(reviews)
    ? reviews[0]
    : (reviews as unknown as MechanicReview)
  const allReviews: ReviewEnum[] = reviewsAggregate?.reviews ?? []
  const allSubCategories: SubCategroriesEnum[] = reviewsAggregate?.subCategories ?? []

  const reviewCounts = {
    [ReviewEnum.EXCELLENT]: allReviews.filter((r) => r === ReviewEnum.EXCELLENT).length,
    [ReviewEnum.GOOD]: allReviews.filter((r) => r === ReviewEnum.GOOD).length,
    [ReviewEnum.BAD]: allReviews.filter((r) => r === ReviewEnum.BAD).length,
  }

  const reviewPieData = [
    { key: ReviewEnum.EXCELLENT, name: "Excelente", value: reviewCounts[ReviewEnum.EXCELLENT], fill: "#22c55e" },
    { key: ReviewEnum.GOOD, name: "Buena", value: reviewCounts[ReviewEnum.GOOD], fill: "#3b82f6" },
    { key: ReviewEnum.BAD, name: "Mala", value: reviewCounts[ReviewEnum.BAD], fill: "#ef4444" },
  ].filter((d) => d.value > 0)

  const totalReviews = allReviews.length
  const reviewsWithTotal = reviewPieData.map((item) => ({ ...item, total: totalReviews }))
  const { avg, filled } = toStars(allReviews)
  const subCountsMap = getSubcategoryCounts(allSubCategories)
  const orderedSubs: SubCategroriesEnum[] = [
    SubCategroriesEnum.PUNCTUALITY,
    SubCategroriesEnum.QUALITY,
    SubCategroriesEnum.PRICE,
    SubCategroriesEnum.ATTITUDE,
    SubCategroriesEnum.CLARITY,
  ]
  const orderedSubEntries = orderedSubs
    .map((k) => [k, (subCountsMap as Record<string, number>)[k] ?? 0] as [SubCategroriesEnum, number])
    .filter(([, v]) => v > 0)

  const COLORS = ["#60a5fa", "#a78bfa", "#f472b6", "#fb923c", "#34d399", "#22d3ee", "#fbbf24", "#f87171"]

  const filterChips = [
    {
      id: "services" as DashboardSection,
      label: "Servicios",
      icon: Wrench,
      color: "blue",
    },
    {
      id: "stock" as DashboardSection,
      label: "Stock",
      icon: Package,
      color: "purple",
    },
    {
      id: "reviews" as DashboardSection,
      label: "Reseñas",
      icon: Star,
      color: "yellow",
    },
    {
      id: "hours" as DashboardSection,
      label: "Horarios",
      icon: Clock,
      color: "orange",
    },
  ]

  if (loading) {
    return (
      <Container>
        <div className="flex flex-col gap-6 p-6">
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
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Análisis y estadísticas de tu taller</p>
        </div>

        <div className="bg-card rounded-3xl p-4 shadow-sm border border-border/50">
          <p className="text-sm text-muted-foreground mb-3 px-2">Selecciona las secciones que deseas visualizar</p>
          <div className="flex flex-wrap gap-3">
            {filterChips.map((chip) => {
              const Icon = chip.icon
              const isActive = visibleSections.has(chip.id)
              return (
                <button
                  key={chip.id}
                  onClick={() => toggleSection(chip.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm
                    transition-all duration-300 ease-out cursor-pointer
                    ${
                      isActive
                        ? `bg-${chip.color}-500/15 text-${chip.color}-600 dark:text-${chip.color}-400 border-2 border-${chip.color}-500/30 shadow-sm`
                        : "bg-accent/30 text-muted-foreground border-2 border-transparent hover:bg-accent/50"
                    }
                  `}
                  style={
                    isActive
                      ? {
                          backgroundColor: `hsl(var(--${chip.color}-500) / 0.15)`,
                          borderColor: `hsl(var(--${chip.color}-500) / 0.3)`,
                        }
                      : undefined
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{chip.label}</span>
                  <div
                    className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${isActive ? "bg-current scale-100" : "bg-transparent scale-0"}
                  `}
                  />
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {visibleSections.has("services") && (
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={servicesWithTotal}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                        animationEasing="ease-out"
                      >
                        {servicesWithTotal.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            className="hover:opacity-80 transition-opacity shadow-md"
                            stroke="none"
                            strokeWidth={0}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      {renderCenterLabel(totalServices, "Total")}
                    </PieChart>
                  </ResponsiveContainer>
                  <CustomLegend data={servicesChartData} colors={COLORS} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No hay datos de servicios disponibles
                </div>
              )}
            </div>
          )}

          {visibleSections.has("stock") && (
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={sparePartsConsumption} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                    <defs>
                      {COLORS.map((color, index) => (
                        <linearGradient
                          key={`gradient-${index}`}
                          id={`barGradient-${index}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      stroke="hsl(var(--border))"
                    />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }} />
                    <Bar
                      dataKey="value"
                      radius={[12, 12, 0, 0]}
                      animationBegin={0}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {sparePartsConsumption.map((_, index) => (
                        <Cell
                          key={`bar-cell-${index}`}
                          fill={`url(#barGradient-${index % COLORS.length})`}
                          className="hover:opacity-80 transition-opacity shadow-md"
                          stroke="none"
                          strokeWidth={0}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No hay datos de repuestos disponibles
                </div>
              )}
            </div>
          )}
        </div>

        {visibleSections.has("reviews") && (
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-500/10 rounded-2xl">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Reseñas del taller</h2>
                <p className="text-sm text-muted-foreground">Distribución de opiniones y puntaje promedio</p>
              </div>
            </div>
            {totalReviews > 0 ? (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={reviewsWithTotal}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                        animationEasing="ease-out"
                      >
                        {reviewsWithTotal.map((entry, index) => (
                          <Cell
                            key={`review-cell-${index}`}
                            fill={entry.fill}
                            className="hover:opacity-80 transition-opacity shadow-md"
                            stroke="none"
                            strokeWidth={0}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      {renderCenterLabel(totalReviews, "Reseñas")}
                    </PieChart>
                  </ResponsiveContainer>
                  <CustomLegend data={reviewPieData} colors={reviewPieData.map((d) => d.fill)} />
                </div>
                <div className="space-y-4">
                  <div className="bg-accent/30 rounded-2xl p-4">
                    <p className="text-sm text-muted-foreground mb-2">Calificación promedio</p>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${i < filled ? "text-yellow-500" : "text-muted-foreground/30"}`}
                          fill={i < filled ? "currentColor" : "none"}
                        />
                      ))}
                      <span className="text-2xl font-bold text-foreground ml-2">{avg.toFixed(1)}</span>
                      <span className="text-muted-foreground">/5</span>
                    </div>
                  </div>
                  {orderedSubEntries.length > 0 && (
                    <div className="bg-accent/30 rounded-2xl p-4">
                      <p className="text-sm text-muted-foreground mb-3">Aspectos destacados</p>
                      <div className="flex flex-wrap gap-2">
                        {orderedSubEntries.map(([k, v]) => (
                          <div key={k} className="bg-card px-3 py-1.5 rounded-full border border-border/50">
                            <span className="text-xs font-medium text-foreground">
                              {subLabel(k)}: {v}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No hay reseñas disponibles
              </div>
            )}
          </div>
        )}

        {visibleSections.has("hours") && (
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        )}
      </div>
    </Container>
  )
}
