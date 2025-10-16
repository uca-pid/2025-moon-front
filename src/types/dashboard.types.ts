export interface DashboardStats {
  serviceName: string | null;
  vehicles: {
    vehiclePlate: string;
    count: number;
    totalCost: number;
  }[];
}
