import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Target, Wrench, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Service } from "@/types/services.types";
import { getServicesByMechanicId } from "@/services/services";

const mockGoals = [
  {
    id: 1,
    type: "service",
    name: "Cambio de aceite",
    target: 10,
    current: 6,
    startDate: "2025-10-05",
    endDate: "2025-10-15",
  },
  {
    id: 2,
    type: "appointment",
    name: "Turnos del mes",
    target: 20,
    current: 12,
    startDate: "2025-10-01",
    endDate: "2025-10-31",
  },
];

export function MechanicGoals() {
  const [goals, setGoals] = useState(mockGoals);
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const today = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);

  const [newGoal, setNewGoal] = useState({
    type: "",
    name: "",
    target: 0,
    startDate: format(today, "yyyy-MM-dd"),
    endDate: format(oneWeekLater, "yyyy-MM-dd"),
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServicesByMechanicId(1);
        setServices(data);
      } catch {
        setServices([
          {
            id: 1,
            name: "Cambio de aceite",
            price: 5000,
            status: "active",
            spareParts: [],
          },
          {
            id: 2,
            name: "Revisión de frenos",
            price: 7000,
            status: "active",
            spareParts: [],
          },
          {
            id: 3,
            name: "Alineación y balanceo",
            price: 9000,
            status: "active",
            spareParts: [],
          },
        ]);
      }
    };
    fetchServices();
  }, []);

  const handleAddGoal = () => {
    if (!newGoal.type || !newGoal.name || newGoal.target <= 0) {
      toast.error("Completá todos los campos antes de guardar la meta.");
      return;
    }

    setGoals([
      ...goals,
      {
        ...newGoal,
        id: Date.now(),
        current: 0,
      },
    ]);

    toast.success("Meta agregada correctamente");
    setOpen(false);
  };

  return (
    <Container>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Metas</h1>
            <p className="text-muted-foreground">
              Establecé y seguí el progreso de tus objetivos de servicios y
              turnos
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Agregar meta
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Nueva meta
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-6 mt-4">
                <div>
                  <Label className="mb-2 block">Tipo de meta</Label>
                  <Select
                    value={newGoal.type}
                    onValueChange={(value) =>
                      setNewGoal((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Seleccioná el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Servicio</SelectItem>
                      <SelectItem value="appointment">Turnos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newGoal.type === "service" && (
                  <div>
                    <Label className="mb-2 block">Servicio</Label>
                    <Select
                      onValueChange={(value) =>
                        setNewGoal((prev) => ({
                          ...prev,
                          name:
                            services.find((s) => s.id.toString() === value)
                              ?.name ?? "",
                        }))
                      }
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Seleccioná un servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {newGoal.type === "appointment" && (
                  <div>
                    <Label className="mb-2 block">Nombre de la meta</Label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-xl border border-border bg-background"
                      value={newGoal.name}
                      onChange={(e) =>
                        setNewGoal((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Ej. Turnos del mes"
                    />
                  </div>
                )}
                <div>
                  <Label className="mb-2 block">Cantidad objetivo</Label>
                  <input
                    type="number"
                    className="w-full p-2 rounded-xl border border-border bg-background"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        target: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="Ej. 10"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Fecha inicio</Label>
                    <DatePicker
                      date={new Date(newGoal.startDate)}
                      setDate={(d) =>
                        setNewGoal((prev) => ({
                          ...prev,
                          startDate: d
                            ? format(d, "yyyy-MM-dd")
                            : prev.startDate,
                        }))
                      }
                      hasTimePicker={false}
                      availableHours={[]}
                      setTime={() => {}}
                      time=""
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Fecha fin</Label>
                    <DatePicker
                      date={new Date(newGoal.endDate)}
                      setDate={(d) =>
                        setNewGoal((prev) => ({
                          ...prev,
                          endDate: d ? format(d, "yyyy-MM-dd") : prev.endDate,
                        }))
                      }
                      hasTimePicker={false}
                      availableHours={[]}
                      setTime={() => {}}
                      time=""
                    />
                  </div>
                </div>

                <Button onClick={handleAddGoal} className="rounded-2xl mt-2">
                  Guardar meta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const icon =
              goal.type === "service" ? (
                <Wrench className="h-5 w-5 text-blue-500" />
              ) : (
                <Clock className="h-5 w-5 text-purple-500" />
              );

            return (
              <div
                key={goal.id}
                className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-accent/10">{icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {goal.name}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {goal.type === "service" ? "Servicio" : "Turnos"} —{" "}
                      {goal.startDate} a {goal.endDate}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progreso: {goal.current}/{goal.target}
                    </span>
                    <span className="font-medium text-foreground">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-3 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="text-center text-muted-foreground mt-20">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-60" />
            <p>No hay metas creadas todavía.</p>
            <p className="text-sm">
              Agregá una meta para comenzar a trackear tu progreso.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
