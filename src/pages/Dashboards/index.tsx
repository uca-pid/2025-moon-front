"use client";

import { useEffect, useState } from "react";
import { TrendingUp, BarChart3, DollarSign, Hash } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/Container";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClientDashboardStats } from "@/services/services";
import { getAppointmentsHistory } from "@/services/appointments";
import type { DashboardStats } from "@/types/dashboard.types";
import type { Appointment } from "@/types/appointments.types";

export function Dashboards() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [mode, setMode] = useState<"count" | "totalCost">("count");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [stats, history] = await Promise.all([
          getClientDashboardStats(),
          getAppointmentsHistory(),
        ]);

        const formattedChart = (stats as DashboardStats[]).map((item) => {
          const entry: any = { service: item.serviceName ?? "Sin servicio" };
          item.vehicles.forEach((v) => {
            entry[v.vehiclePlate] = mode === "count" ? v.count : v.totalCost;
          });
          return entry;
        });

        setChartData(formattedChart);
        setAppointments(history);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mode]);

  const vehicleKeys = chartData.length
    ? Object.keys(chartData[0]).filter((k) => k !== "service")
    : [];

  const chartConfig: ChartConfig = vehicleKeys.reduce((acc, key, idx) => {
    acc[key] = {
      label: key,
      color: `var(--chart-${(idx % 6) + 1})`,
    };
    return acc;
  }, {} as ChartConfig);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover text-popover-foreground border rounded-md shadow-md px-3 py-2 text-sm">
          <p className="font-semibold mb-1">{data.service}</p>
          {payload.map((p: any) => (
            <div key={p.dataKey} className="flex items-center gap-2">
              <Badge>{p.dataKey}</Badge>
              <span>
                {mode === "count"
                  ? `${p.value} veces`
                  : `$${Number(p.value).toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Container>
      <Card className="border-0 shadow-none">
        <CardHeader className="px-6 pt-6 pb-2">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
              <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
                <BarChart3 className="h-10 w-10" />
                Dashboard de servicios
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Comparación por vehículo —{" "}
                {mode === "count" ? "Cantidad de servicios" : "Costo total"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full">
              <div className="flex flex-col gap-3 w-full sm:w-auto mb-6">
                <Label
                  htmlFor="mode"
                  className="px-1 text-base text-foreground flex items-center gap-2"
                >
                  {mode === "count" ? (
                    <Hash className="h-4 w-4" />
                  ) : (
                    <DollarSign className="h-4 w-4" />
                  )}
                  Modo de visualización
                </Label>
                <Select
                  value={mode}
                  onValueChange={(v: "count" | "totalCost") => setMode(v)}
                >
                  <SelectTrigger className="w-full sm:w-[200px]" id="mode">
                    <SelectValue placeholder="Seleccionar modo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="count">Por cantidad</SelectItem>
                    <SelectItem value="totalCost">Por coste</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <Skeleton className="h-[400px] w-full rounded-md" />
              ) : chartData.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[400px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    margin={{ left: 10, right: 10, top: 20, bottom: 20 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="service"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <Tooltip cursor={false} content={<CustomTooltip />} />
                    {vehicleKeys.map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={`var(--chart-${
                          (vehicleKeys.indexOf(key) % 6) + 1
                        })`}
                        radius={4}
                      />
                    ))}
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">
                    No hay datos disponibles
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Los datos del dashboard aparecerán aquí cuando haya
                    servicios registrados
                  </p>
                </div>
              )}
              <CardFooter className="px-6 pb-6 flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium items-center">
                  <TrendingUp className="h-4 w-4" />
                  Análisis histórico de servicios del cliente
                </div>
                <div className="text-muted-foreground leading-none">
                  Mostrando comparativa por vehículo y tipo de servicio
                </div>
              </CardFooter>
              {!loading && appointments.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold mb-3">
                    Historial de turnos
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Taller</TableHead>
                        <TableHead>Vehículo</TableHead>
                        <TableHead>Servicio(s)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell>{a.date}</TableCell>
                          <TableCell>{a.time}</TableCell>
                          <TableCell>{a.workshop?.workshopName}</TableCell>
                          <TableCell>{a.vehicle?.licensePlate}</TableCell>
                          <TableCell>
                            {a.services?.length
                              ? a.services.map((s) => s.name).join(", ")
                              : "Sin servicio"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
