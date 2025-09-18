import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

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
import { cn } from "@/lib/utils";

interface DatePickerProps {
  className?: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  setTime: (time: string) => void;
  hasTimePicker: boolean;
  availableHours: { hours: string[] }[];
}

export function DatePicker({
  className,
  date,
  setDate,
  setTime,
  hasTimePicker,
  availableHours,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  
  const handleHourClick = (hour: string) => {
    setTime(hour);
  };
  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Fecha
        </Label>
        <div className="flex gap-3">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="justify-between font-normal"
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
                disabled={{ before: tomorrow }}
                onSelect={(date) => {
                  setDate(date || undefined);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          {hasTimePicker && (
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccione un horario" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Horarios Disponibles</SelectLabel>
                  {availableHours?.map((item: { hours: string[] }, i: number) => (
                    <div key={i}>
                      {item.hours.map((hour: string) => (
                        <SelectItem
                          key={`${i}-${hour}`}
                          onClick={() => handleHourClick(hour)}
                          value={hour}
                          className="cursor-pointer"
                        >
                          {hour}
                        </SelectItem>
                      ))}
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
