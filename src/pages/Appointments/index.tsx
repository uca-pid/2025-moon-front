import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Container } from "@/components/Container";

export const Appointments = () => {
  const [service, setService] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");

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
    }
  ]

  const handleDisabled = () => {
    return !service || !date || !time || service === "";
  }

  return (
    <Container>
      <div className="mx-auto flex max-w-6xl items-center justify-start px-4 py-3 w-full">
        <div className="flex flex-col gap-8 w-full">
          <DatePicker date={date} setDate={setDate} time={time} setTime={setTime} />

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
            <Button variant="outline" className="px-6 py-5 text-base" disabled={handleDisabled()}>
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};