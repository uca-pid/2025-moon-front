import { get } from "@/utils/rest-api";
import type { DashboardStats } from "@/types/dashboards.types";

export const getClientDashboardStats = (): Promise<DashboardStats[]> => {
  return get(`/client/dashboard/stats`);
};

export const getClientUpcomingAppointments = () => {
  return get(`/client/dashboard/upcoming`);
};
export const getClientHistoryAppointments = () => {
  return get(`/client/dashboard/history`);
};
