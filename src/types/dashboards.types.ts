export interface DashboardVehicleData {
  vehiclePlate: string;
  count: number;
  totalCost: number;
}

export interface DashboardStats {
  serviceName: string;
  vehicles: DashboardVehicleData[];
}

export interface ServiceGrowth {
  serviceName: string;
  currentCount: number;
  previousCount: number;
  growth: number;
}
