import type { Service } from "@/types/services.types"

export enum ServiceStatusEnum {
  ACTIVO = "ACTIVO",
  FALTA_STOCK = "FALTA STOCK",
  BLOQUEADO = "BLOQUEADO",
}

export const getServiceStatus = (service: Service) => {
  if (service.status !== "active") {
    return ServiceStatusEnum.BLOQUEADO
  }

  const hasEnoughStockForAll = (service.spareParts ?? []).every((sp) => {
    const stock = Number(sp?.sparePart?.stock ?? 0)
    const quantity = Number(sp?.quantity ?? 0)
    return stock > quantity
  })

  return hasEnoughStockForAll
    ? ServiceStatusEnum.ACTIVO
    : ServiceStatusEnum.FALTA_STOCK
}