export interface UpdateVehicle {
  licensePlate: string;
  model: string;
  year: number;
  km: number;
}

export interface CreateVehicle {
  licensePlate: string;
  model: string;
  year: number;
  km: number;
}

export interface Vehicle {
  id: number;
  licensePlate: string;
  model: string;
  year: number;
  km: number;
}
