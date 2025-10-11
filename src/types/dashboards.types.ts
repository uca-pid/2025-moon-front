export interface DashboardVehicleData {
  vehiclePlate: string;
  count: number;
  totalCost: number;
}

export interface DashboardStats {
  serviceName: string;
  vehicles: DashboardVehicleData[];
}
