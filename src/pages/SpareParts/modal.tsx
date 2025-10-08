import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isCreating = !sparePart?.id
  const title = isCreating
    ? 'Creando repuesto'
    : `Editando respuesto #${sparePart?.id}`
  const handleSubmit = async () => {
    if (isSubmitting) return
    try {
      setIsSubmitting(true)
      await Promise.resolve(onSave())
      toast.success('Repuesto guardado correctamente')
      onOpenChange(false)
    } catch (error) {
      const message = (error as Error)?.message ?? 'Ocurrió un error'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }
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
              min={0}
              value={sparePart?.stock}
              onChange={(e) =>
                onChangeSparePart?.({
                  ...sparePart,
                  stock: Math.max(0, Number(e.target.value)),
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='secondary' onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type='submit'
            onClick={handleSubmit}
            disabled={isSubmitting || sparePart?.name === ""}
          >
            {isSubmitting ? 'Guardando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
