import type { CreateVehicle } from "@/types/vehicles.types";
import { post } from "@/utils/rest-api";

export const createVehicle = (vehicle: CreateVehicle) => {
  return post(`/vehicle`, vehicle);
};
