import type { Service } from "./services.types";
import type { User } from "./users.types";

export interface CreateAppointment {
  date: string;
  time: string;
  serviceId: number;
}

export interface Appointment {
  id: number;
  date: string;
  time: string;
  service: Service;
}

export interface Shift {
  id: number;
  date: string;
  time: string;
  user: User;
  service: Service;
}
