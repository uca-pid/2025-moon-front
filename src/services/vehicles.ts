import type { CreateVehicle } from "@/types/vehicles.types";
import { get, post } from "@/utils/rest-api";

export const createVehicle = (vehicle: CreateVehicle) => {
  return post(`/vehicle`, vehicle);
};

export const getVehiclesOfUser = () => {
  return get(`/vehicle/user`);
};
