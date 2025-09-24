import type { Appointment, Shift } from "@/types/appointments.types";

export const sortAppointments = (appointments: Appointment[] | Shift[]) => {
  return [...appointments].sort((a, b) => {
    if (a.date === b.date) {
      return a.time.localeCompare(b.time);
    }
    return a.date.localeCompare(b.date);
  });
}