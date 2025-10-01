import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/MultiSelect";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { getSpareParts } from "@/services/spare-parts";
import type { PaginatedResponseDto } from "@/types/paginated.types";
import type { SparePart } from "@/types/spare-part.types";
import type { CreateService, Service } from "@/types/services.types";

export interface ServiceDialogProps {
  isOpen: boolean;
  isCreating?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  service: Service | null;
  onChangeService?: (service: CreateService) => void;
  onSave: () => void;
}

export const ServiceDialog = ({
  isOpen,
  onOpenChange,
  service,
  onChangeService,
  onSave,
}: ServiceDialogProps) => {
  const isCreating = !service?.id;
  const title = isCreating
    ? "Creando servicio"
    : `Editando servicio #${service?.id}`;
  const { data: sparePartsResponse } = useQuery<
    PaginatedResponseDto<SparePart>
  >(
    ["spare-parts", "for-service-modal"],
    () =>
      getSpareParts({
        page: 1,
        pageSize: 1000,
        search: "",
        orderBy: "id",
        orderDir: "asc",
      }),
    { cacheTime: 5 * 60 * 1000 }
  );

  const sparePartOptions = useMemo(
    () =>
      (sparePartsResponse?.data ?? [])
        .filter((sp) => sp.id != null)
        .map((sp) => ({
          label: `${sp.id} - ${sp.name ?? "Sin nombre"}`,
          value: String(sp.id!),
        })),
    [sparePartsResponse]
  );

  const normalizedSpareParts = useMemo(() => {
    const raw = (service?.spareParts ?? []) as unknown[];
    const toNumber = (val: unknown): number | null => {
      if (typeof val === "number") return Number.isFinite(val) ? val : null;
      if (typeof val === "string") {
        const n = Number(val);
        return Number.isFinite(n) ? n : null;
      }
      return null;
    };
    const result: { sparePartId: number; quantity: number }[] = [];
    for (const sp of raw) {
      const rec = (sp ?? {}) as Record<string, unknown>;
      let id = toNumber(rec.sparePartId);
      if (id == null) {
        const sparePartObj = rec.sparePart as
          | Record<string, unknown>
          | undefined;
        if (sparePartObj) {
          id = toNumber(sparePartObj.id);
        }
      }
      let qty = toNumber(rec.quantity) ?? 1;
      if (qty <= 0) qty = 1;
      if (id != null) result.push({ sparePartId: id, quantity: qty });
    }
    return result;
  }, [service?.spareParts]);

  const selectedSparePartIds = useMemo(
    () => normalizedSpareParts.map((sp) => String(sp.sparePartId)),
    [normalizedSpareParts]
  );

  const onChangeSelectedSpareParts = (newSelected: string[]) => {
    const current =
      service ?? ({ name: "", price: 0, spareParts: [] } as CreateService);
    const currentMap = new Map<number, number>();
    for (const sp of normalizedSpareParts) {
      currentMap.set(sp.sparePartId, sp.quantity);
    }

    const nextSpareParts = newSelected.map((idStr) => {
      const id = Number(idStr);
      return {
        sparePartId: id,
        quantity: currentMap.get(id) ?? 1,
      };
    });

    onChangeService?.({
      ...current,
      spareParts: nextSpareParts,
    });
  };

  const onChangeQuantity = (sparePartId: number, quantity: number) => {
    const current =
      service ?? ({ name: "", price: 0, spareParts: [] } as CreateService);
    const nextSpareParts = normalizedSpareParts.map((sp) =>
      Number(sp.sparePartId) === sparePartId ? { ...sp, quantity } : sp
    );
    onChangeService?.({
      ...current,
      spareParts: nextSpareParts,
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="text-foreground">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={service?.name}
              onChange={(e) =>
                onChangeService?.({
                  ...service,
                  name: e.target.value,
                } as CreateService)
              }
            />
          </div>
          <div className="grid w-full items-center gap-1.5 mt-4">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              value={service?.price}
              onChange={(e) =>
                onChangeService?.({
                  ...service,
                  price: Number(e.target.value),
                } as CreateService)
              }
            />
          </div>

          <div>
            {sparePartOptions.length > 0 ? (
              <div>
                <div className="grid w-full items-center gap-1.5 mt-4">
                  <Label>Repuestos</Label>
                  <MultiSelect
                    options={sparePartOptions}
                    selected={selectedSparePartIds}
                    setSelected={onChangeSelectedSpareParts}
                    placeholder="Selecciona repuestos..."
                  />
                  {normalizedSpareParts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {normalizedSpareParts.map((sp) => {
                        const label =
                          sparePartOptions.find(
                            (o) => o.value === String(sp.sparePartId)
                          )?.label ?? `#${sp.sparePartId}`;
                        const handleRemoveSparePart = () => {
                          const current =
                            service ??
                            ({
                              name: "",
                              price: 0,
                              spareParts: [],
                            } as CreateService);
                          const nextSpareParts = normalizedSpareParts.filter(
                            (item) => item.sparePartId !== sp.sparePartId
                          );
                          onChangeService?.({
                            ...current,
                            spareParts: nextSpareParts,
                          });
                        };
                        return (
                          <div
                            key={sp.sparePartId}
                            className="flex items-center justify-between gap-3"
                          >
                            <div>
                              <button
                                type="button"
                                aria-label="Eliminar repuesto"
                                className="text-destructive hover:opacity-50 px-2 cursor-pointer mr-2"
                                onClick={handleRemoveSparePart}
                              >
                                x
                              </button>
                              <span className="text-sm">{label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`qty-${sp.sparePartId}`}>
                                Cantidad
                              </Label>
                              <Input
                                id={`qty-${sp.sparePartId}`}
                                type="number"
                                min={1}
                                value={sp.quantity}
                                onChange={(e) =>
                                  onChangeQuantity(
                                    sp.sparePartId,
                                    Math.max(1, Number(e.target.value))
                                  )
                                }
                                className="w-28"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="grid w-full items-center gap-1.5 mt-4">
                  <Label>Repuestos</Label>
                  <p className="text-sm text-muted-foreground italic">
                    Debes crear un repuesto para el servicio primero.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={sparePartOptions.length === 0}
            onClick={() => onSave()}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
