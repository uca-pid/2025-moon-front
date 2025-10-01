import { useMemo, useState, useEffect } from "react";
import { ChevronDownIcon, HelpCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  className?: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  setTime: (time: string) => void;
  hasTimePicker: boolean;
  availableHours: { hours: string[] }[];
  time?: string;
}

export function DatePicker({
  className,
  date,
  setDate,
  setTime,
  hasTimePicker,
  availableHours,
  time,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const now = useMemo(() => new Date(), []);
  const today = useMemo(
    () => new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    [now]
  );

  const buildDateTimeFromHour = (selectedDate: Date, hour: string) => {
    const [hh, mm] = hour.split(":").map((v) => parseInt(v, 10));
    const dt = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hh,
      mm,
      0,
      0
    );
    return dt;
  };

  const isTimeDisabled = (hour: string): boolean => {
    if (!date) return false;
    const candidate = buildDateTimeFromHour(date, hour);
    const minAllowed = new Date(now.getTime() + 60 * 60 * 1000);
    return candidate < minAllowed;
  };

  useEffect(() => {
    if (!time || !date) return;
    if (isTimeDisabled(time)) {
      setTime("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center gap-2">
          <Label htmlFor="date-picker" className="px-1 text-lg">
            Fecha
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label="Ayuda" className="text-muted-foreground">
                <HelpCircleIcon className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Las reservas tienen que tener un minimo de 1 hora de antelación.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-3 flex-col lg:flex-row w-full">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="justify-between font-normal w-full lg:w-auto"
              >
                {date ? date.toLocaleDateString() : "Selecciona una fecha"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date || undefined}
                captionLayout="dropdown"
                disabled={{ before: today }}
                onSelect={(date) => {
                  setDate(date || undefined);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          {hasTimePicker && (
            <Select onValueChange={(value) => setTime(value)}>
              <SelectTrigger className="w-full lg:w-auto">
                <SelectValue placeholder="Seleccione un horario" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                <SelectGroup>
                  <SelectLabel>Horarios Disponibles</SelectLabel>
                  {availableHours?.map((item: { hours: string[] }, i: number) => (
                    <div key={i}>
                      {item.hours.map((hour: string) => {
                        const disabled = !!date && isTimeDisabled(hour);
                        return (
                          <SelectItem
                            key={`${i}-${hour}`}
                            value={hour}
                            className="cursor-pointer"
                            disabled={disabled}
                          >
                            <div className="flex w-full items-center">
                              <span>{hour}</span>
                              {disabled && (
                                <span className="text-muted-foreground ml-auto pl-2">
                                  — No se puede reservar
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </div>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
