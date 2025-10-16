import { useEffect, useState } from "react"
import { TrendingUp, BarChart3, DollarSign, Hash, Car, Wrench, Calendar, Clock, Store } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import { ChartContainer } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/Container"
import { getClientDashboardStats, getClientHistoryAppointments } from "@/services/dashboards"
import type { DashboardStats } from "@/types/dashboards.types"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const UserDashboard = () => {
  const [chartData, setChartData] = useState<any[]>([])
  const [rawData, setRawData] = useState<DashboardStats[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [mode, setMode] = useState<"count" | "totalCost">("count")
  const [loading, setLoading] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data: DashboardStats[] = await getClientDashboardStats()
        setRawData(data)

        const formatted = data.map((item) => {
          const entry: any = { service: item.serviceName }
          item.vehicles.forEach((v) => {
            entry[v.vehiclePlate] = mode === "count" ? v.count : v.totalCost
          })
          return entry
        })

        setChartData(formatted)
      } catch (error) {
        console.error("Error cargando estadísticas del dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [mode])

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoadingHistory(true)
        const data = await getClientHistoryAppointments()
        setHistory(data)
      } catch (error) {
        console.error("Error cargando historial de servicios:", error)
      } finally {
        setLoadingHistory(false)
      }
    }

    loadHistory()
  }, [])

  const vehicleKeys = chartData.length ? Object.keys(chartData[0]).filter((k) => k !== "service") : []

  const chartConfig: ChartConfig = vehicleKeys.reduce((acc, key, idx) => {
    acc[key] = {
      label: key,
      color: `var(--chart-${(idx % 6) + 1})`,
    }
    return acc
  }, {} as ChartConfig)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover text-popover-foreground border rounded-md shadow-md px-3 py-2 text-sm">
          <p className="font-semibold mb-1">{data.service}</p>
          {payload.map((p: any) => (
            <div key={p.dataKey} className="flex items-center gap-2">
              <Badge variant="secondary">{p.dataKey}</Badge>
              <span>{mode === "count" ? `${p.value} veces` : `$${Number(p.value).toLocaleString()}`}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Container>
      <div className="space-y-6 p-6 text-foreground">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Dashboard de Cliente
          </h1>
          <p className="text-muted-foreground">Análisis de servicios realizados y estadísticas de tus vehículos</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Estadísticas de Servicios
                  </CardTitle>
                  <CardDescription>Comparación de servicios realizados por vehículo</CardDescription>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <Label htmlFor="mode" className="text-sm font-medium flex items-center gap-2">
                    {mode === "count" ? <Hash className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                    Modo de visualización
                  </Label>
                  <Select value={mode} onValueChange={(v: "count" | "totalCost") => setMode(v)}>
                    <SelectTrigger className="w-full sm:w-[200px]" id="mode">
                      <SelectValue placeholder="Seleccionar modo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="count">Por cantidad</SelectItem>
                      <SelectItem value="totalCost">Por costo total</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              {loading ? (
                <Skeleton className="h-[350px] w-full rounded-md" />
              ) : chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <BarChart accessibilityLayer data={chartData} margin={{ left: 10, right: 10, top: 20, bottom: 20 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="service" tickLine={false} tickMargin={10} axisLine={false} />
                    <Tooltip cursor={false} content={<CustomTooltip />} />
                    {vehicleKeys.map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={`var(--chart-${(vehicleKeys.indexOf(key) % 6) + 1})`}
                        radius={4}
                      />
                    ))}
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px] text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No hay datos disponibles</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Los datos del dashboard aparecerán aquí cuando haya servicios registrados
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
              <div className="flex gap-2 font-medium leading-none items-center">
                <TrendingUp className="h-4 w-4 text-primary" />
                Análisis histórico de servicios
              </div>
              <div className="leading-none text-muted-foreground">
                Mostrando comparativa por vehículo y tipo de servicio
              </div>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Historial de Servicios
              </CardTitle>
              <CardDescription>Registro completo de servicios realizados a tus vehículos</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              {loadingHistory ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : history.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Fecha
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Hora
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            Vehículo
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            Taller
                          </div>
                        </TableHead>
                        <TableHead>Servicios realizados</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((h) => (
                        <TableRow key={h.id}>
                          <TableCell className="font-medium">{h.date}</TableCell>
                          <TableCell>{h.time}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{h.vehiclePlate}</Badge>
                          </TableCell>
                          <TableCell>{h.workshopName}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {h.services.map((s: string) => (
                                <Badge key={s} variant="secondary">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No hay servicios registrados</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    El historial de servicios aparecerá aquí cuando se completen turnos
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
              <div className="flex gap-2 font-medium leading-none items-center">
                <Calendar className="h-4 w-4 text-primary" />
                Historial completo de servicios
              </div>
              <div className="leading-none text-muted-foreground">
                Todos los servicios realizados ordenados por fecha
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Container>
  )
}
