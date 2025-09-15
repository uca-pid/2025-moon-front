import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  className?: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
}

export function DatePicker({ className, date, setDate, time, setTime }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Fecha
        </Label>
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
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date || undefined}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date || undefined)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Hora
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="00:00:00"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
    </div>
  )
}
