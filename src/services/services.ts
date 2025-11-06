import type { ServiceGrowth } from "@/types/dashboards.types";
import type { PaginatedQueryDto } from "@/types/paginated.types";
import type { CreateService } from "@/types/services.types";
import { del, get, post, put } from "@/utils/rest-api";

export const getServiceById = (id: number) => {
  return get(`/services/${id}`);
};

export const getServicesByMechanicId = (mechanicId: number) => {
  return get(`/services/mechanic/${mechanicId}`);
};

export const getServices = (query: PaginatedQueryDto) => {
  return get(`/services`, { params: query });
};

export const createService = (service: CreateService) => {
  return post(`/services`, service);
};

export const updateService = (service: CreateService) => {
  return put(`/services/${service.id}`, service);
};

export const deleteService = (id: number) => {
  return del(`/services/${id}`);
};

export const getClientDashboardStats = () => {
  return get("/services/stats/user");
};

export const getRequestedServicesByMechanicId = () => {
  return get(`/services/requested-services`);
};

export const getTopGrowingServices = (
  days?: number
): Promise<ServiceGrowth[]> => {
  const params = days ? { days } : undefined;
  return get(`/services/stats/mechanic/growth`, { params });
};
