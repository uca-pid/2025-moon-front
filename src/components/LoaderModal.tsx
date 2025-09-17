import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useStore } from '@/zustand/store'

export const LoaderModal = () => {
  const loading = useStore((state) => state.loading)
  const message = useStore((state) => state.loadingMessage)

  return (
    <Dialog open={!!loading}>
      <DialogContent showCloseButton={false} className="flex items-center justify-center gap-3 border-none shadow-none bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-black border-t-transparent" />
          {message ? <span className="text-sm text-black">{message}</span> : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoaderModal


