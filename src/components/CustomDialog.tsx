import type React from "react"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export interface CustomDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title: string
  onSave: () => Promise<void>
  children: React.ReactNode
  saveDisabled?: boolean
}

export function CustomDialog({ isOpen, onOpenChange, title, onSave, children, saveDisabled }: CustomDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (isSubmitting) return
    try {
      setIsSubmitting(true)
      await onSave()
      toast.success("Guardado correctamente")
      onOpenChange(false)
    } catch (error) {
      const message = (error as Error)?.message ?? "Ocurrió un error"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="text-foreground rounded-3xl border-border/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="rounded-xl">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || saveDisabled} className="rounded-xl">
            {isSubmitting ? "Guardando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
