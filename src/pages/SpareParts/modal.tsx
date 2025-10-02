import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SparePartData } from '@/types/spare-part.types'

export interface SparePartDialogProps {
  isOpen: boolean
  isCreating?: boolean
  onOpenChange: (isOpen: boolean) => void
  sparePart: SparePartData | null
  onChangeSparePart?: (sparePart: SparePartData) => void
  onSave: () => void
}

export const SparePartDialog = ({
  isOpen,
  onOpenChange,
  sparePart,
  onChangeSparePart,
  onSave,
}: SparePartDialogProps) => {
  const isCreating = !sparePart?.id
  const title = isCreating
    ? 'Creando repuesto'
    : `Editando respuesto #${sparePart?.id}`
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='text-foreground'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='name'>Nombre</Label>
            <Input
              id='name'
              value={sparePart?.name}
              onChange={(e) =>
                onChangeSparePart?.({ ...sparePart, name: e.target.value })
              }
            />
          </div>
          <div className='grid w-full items-center gap-1.5 mt-4'>
            <Label htmlFor='stock'>Stock</Label>
            <Input
              id='stock'
              type='number'
              value={sparePart?.stock}
              onChange={(e) =>
                onChangeSparePart?.({
                  ...sparePart,
                  stock: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='secondary' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type='submit'
            onClick={() => onSave()}
            disabled={sparePart?.name === ""}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
