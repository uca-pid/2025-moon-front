import { useEffect, useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Car,
  Store,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  getClientDashboardStats,
  getClientHistoryAppointments,
} from "@/services/dashboards.ts";
import type { DashboardStats } from "@/types/dashboards.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Container } from "@/components/Container";

const VEHICLE_COLORS: Record<string, string> = {};
const COLOR_PALETTE = [
  "hsl(217, 91%, 60%)", // blue
  "hsl(142, 71%, 45%)", // green
  "hsl(262, 83%, 58%)", // purple
  "hsl(346, 77%, 50%)", // pink
  "hsl(38, 92%, 50%)", // orange
  "hsl(199, 89%, 48%)", // cyan
  "hsl(48, 96%, 53%)", // yellow
  "hsl(339, 90%, 51%)", // red
];

function getVehicleColor(vehiclePlate: string): string {
  if (!VEHICLE_COLORS[vehiclePlate]) {
    const colorIndex =
      Object.keys(VEHICLE_COLORS).length % COLOR_PALETTE.length;
    VEHICLE_COLORS[vehiclePlate] = COLOR_PALETTE[colorIndex];
  }
  return VEHICLE_COLORS[vehiclePlate];
}

export function UserDashboard() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [mode, setMode] = useState<"count" | "totalCost">("count");
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data: DashboardStats[] = await getClientDashboardStats();

        const formatted = data.map((item) => {
          const entry: any = { service: item.serviceName };
          item.vehicles.forEach((v) => {
            entry[v.vehiclePlate] = mode === "count" ? v.count : v.totalCost;
          });
          return entry;
        });

        setChartData(formatted);
      } catch (error) {
        console.error("Error cargando estadísticas del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mode]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoadingHistory(true);
        const data = await getClientHistoryAppointments();
        setHistory(data);
      } catch (error) {
        console.error("Error cargando historial de servicios:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  const vehicleKeys = chartData.length
    ? Object.keys(chartData[0]).filter((k) => k !== "service")
    : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-2xl shadow-lg px-4 py-3 animate-in fade-in zoom-in-95 duration-200">
          <p className="font-semibold mb-2 text-foreground">{data.service}</p>
          {payload.map((p: any) => (
            <div key={p.dataKey} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getVehicleColor(p.dataKey) }}
              />
              <Badge variant="secondary" className="rounded-full">
                {p.dataKey}
              </Badge>
              <span className="text-foreground font-medium">
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
      <div className="max-w-7xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BarChart3 className="h-9 w-9 text-primary" />
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Análisis de servicios y estadísticas de tus vehículos
          </p>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Estadísticas de Servicios
              </h2>
              <p className="text-sm text-muted-foreground">
                Comparación por vehículo y tipo de servicio
              </p>
            </div>
            <Select
              value={mode}
              onValueChange={(v: "count" | "totalCost") => setMode(v)}
            >
              <SelectTrigger className="w-[180px] rounded-xl border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="count">Por cantidad</SelectItem>
                <SelectItem value="totalCost">Por costo total</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : chartData.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-border/50">
                {vehicleKeys.map((vehicle) => (
                  <div key={vehicle} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: getVehicleColor(vehicle) }}
                    />
                    <Badge variant="outline" className="rounded-full">
                      {vehicle}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ left: 10, right: 10, top: 20, bottom: 60 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="service"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      className="fill-foreground"
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
                    />
                    {vehicleKeys.map((key, idx) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={getVehicleColor(key)}
                        radius={[12, 12, 0, 0]}
                        animationDuration={800}
                        animationBegin={idx * 100}
                        minPointSize={5}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                <BarChart3 className="h-10 w-10 text-primary" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                No hay datos disponibles
              </p>
              <p className="text-sm text-muted-foreground">
                Los datos aparecerán cuando haya servicios registrados
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border/50">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Análisis histórico de servicios realizados
            </span>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Historial de Servicios
            </h2>
            <p className="text-sm text-muted-foreground">
              Registro completo de servicios realizados
            </p>
          </div>

          {loadingHistory ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {history.map((h, idx) => (
                <div
                  key={h.id}
                  className="bg-accent/30 rounded-2xl p-4 hover:bg-accent/50 transition-all duration-300 animate-in fade-in slide-in-from-left-4 border border-border/30"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fecha</p>
                        <p className="font-medium text-foreground">{h.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Hora</p>
                        <p className="font-medium text-foreground">{h.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                        <Car className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Vehículo
                        </p>
                        <Badge variant="outline" className="rounded-full mt-1">
                          {h.vehicle.licensePlate}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
                        <Store className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Taller</p>
                        <p className="font-medium text-foreground text-sm">
                          {h.workshop.workshopName}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Servicios
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {h.services.map((s: any) => (
                          <Badge
                            key={s.id}
                            variant="secondary"
                            className="rounded-full text-xs"
                          >
                            {s.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                No hay servicios registrados
              </p>
              <p className="text-sm text-muted-foreground">
                El historial aparecerá cuando se completen turnos
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
