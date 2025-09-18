import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Container } from "@/components/Container";

export const Appointments = () => {
  const [service, setService] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");

  const availableHours = [
    {
      workshop: "example",
      hours: ["08:00", "10:00"],
    },
  ];

  const Appointments = [
    {
      id: 1,
      date: "2025-09-20",
      hour: "10:00",
      workshop: "example",
      servicio: "nose",
    },
    {
      id: 2,
      date: "2025-09-21",
      hour: "14:00",
      workshop: "example",
      servicio: "nose",
    },
    {
      id: 3,
      date: "2025-09-22",
      hour: "16:30",
      workshop: "example",
      servicio: "nose",
    },
    {
      id: 4,
      date: "2025-09-23",
      hour: "18:00",
      workshop: "example",
      servicio: "nose",
    },
    {
      id: 1,
      date: "2025-09-20",
      hour: "10:00",
      workshop: "example",
      servicio: "nose",
    },
    {
      id: 2,
      date: "2025-09-21",
      hour: "14:00",
      workshop: "example",
      servicio: "nose",
    },
    {
      id: 3,
      date: "2025-09-22",
      hour: "16:30",
      workshop: "example",
      servicio: "nose",
    },
  ];

  const services = [
    {
      name: "Service de auto",
      price: 1000,
    },
    {
      name: "Service de moto",
      price: 2000,
    },
    {
      name: "Reparación de auto",
      price: 5000,
    },
    {
      name: "Revisión",
      price: null,
    },
  ];

  const handleDisabled = () => {
    return !service || !date || !time || service === "";
  };

  return (
    <Container>
      <div className="mx-auto flex max-w-6xl items-center justify-start px-4 py-3 w-full">
        <div className="flex flex-col gap-8 w-full">
          <DatePicker
            hasTimePicker={true}
            date={date}
            setDate={setDate}
            setTime={setTime}
            availableHours={availableHours}
          />
          <div className="flex flex-col gap-3 w-[50%] cursor-pointer">
            <Label htmlFor="service" className="px-1">
              Servicio
            </Label>
            <select
              id="service"
              className="h-10 rounded-md border bg-background px-3 text-sm shadow-xs focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none cursor-pointer"
              defaultValue={service}
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="" disabled>
                Selecciona un servicio
              </option>
              {services.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name} - ${service.price ?? "Consultar"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Button
              variant="outline"
              className="px-6 py-5 text-base"
              disabled={handleDisabled()}
            >
              Confirmar
            </Button>
          </div>
          <div className="flex flex-col gap-3 w-[50%]">
            <Label htmlFor="appointments" className="px-1">
              Turnos agendados
            </Label>
          </div>
          <ScrollArea className="h-65 w-[100%] lg:w-[70%] rounded-md border">
            <div>
              {Appointments.map((app) => {
                return (
                  <Card className="flex  ">
                    <CardHeader>
                      <CardTitle>Turno #{app.id}</CardTitle>
                      <CardDescription>
                        Tienes un turno agendado en el taller {app.workshop} el
                        dia {app.date} a las {app.hour} para realizar el
                        servicio {app.servicio}.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Container>
  );
};
