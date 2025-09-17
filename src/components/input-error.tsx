import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputErrorProps {
  isValid: boolean
  message: string
  children: React.ReactElement
  rightAdornment?: React.ReactNode
  className?: string
}

export function InputError({
  isValid,
  message,
  children,
  rightAdornment,
  className,
}: InputErrorProps) {
  const childWithInvalid = React.cloneElement(children, {
    'aria-invalid': !isValid || undefined,
    className: cn(children.props.className, rightAdornment ? 'pr-10' : undefined),
  })

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('relative w-full')}>
        {childWithInvalid}
        {rightAdornment ? (
          <div className="absolute inset-y-0 right-2 my-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground">
            {rightAdornment}
          </div>
        ) : null}
      </div>
      {!isValid ? (
        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{message}</span>
        </p>
      ) : null}
    </div>
  )
}

export default InputError


