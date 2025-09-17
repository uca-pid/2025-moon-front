import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { register } from '@/services/users'
import { useNavigate } from 'react-router-dom'

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isMechanic, setIsMechanic] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [workShopName, setWorkShopName] = useState('')
  const [address, setAddress] = useState('')
  const navigate = useNavigate()
  
  const onRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password != confirmPassword) {
      //TODO: display error
      throw new Error()
    }
    register(
      email,
      fullName,
      password,
      isMechanic ? 'MECHANIC' : 'USER',
      workShopName,
      address
    )

    navigate('/login')
  }

  return (
    <div className={cn('flex flex-col gap-6 w-xl', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Regístrate</CardTitle>
          <CardDescription>
            Solo necesitamos que completes algunos datos antes de que tu cuenta
            este lista.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onRegister}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id='email'
                  type='email'
                  placeholder='mail@example.com'
                  required
                />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='fullName'>Nombre completo</Label>
                <Input
                  id='fullName'
                  type='text'
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Contraseña</Label>
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='confirmPassword'>Confirmar Contraseña</Label>
                </div>
                <Input
                  id='confirmPassword'
                  type='password'
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center gap-2'>
                  <Checkbox
                    checked={isMechanic}
                    onCheckedChange={() => setIsMechanic(!isMechanic)}
                  />
                  <p>¿Quieres registrarte como mecanico?</p>
                </div>
              </div>
              <div className='grid gap-3'>
                {isMechanic && (
                  <div className='flex flex-col gap-6'>
                    <div className='grid gap-3'>
                      <div className='flex items-center'>
                        <Label htmlFor='local-name'>Nombre del local</Label>
                      </div>
                      <Input
                        id='local-name'
                        type='local-name'
                        required
                        value={workShopName}
                        onChange={(e) => setWorkShopName(e.target.value)}
                      />
                      <div className='flex items-center'>
                        <Label htmlFor='address'>Direccion</Label>
                      </div>
                      <Input
                        id='address'
                        type='address'
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className='flex flex-col gap-3'>
                <Button type='submit' className='w-full'>
                  Crear cuenta
                </Button>
              </div>
            </div>
            <div className='mt-4 text-center text-sm'>
              Ya tenes una cuenta?
              <a onClick={() => navigate('/login')} className='underline underline-offset-4 ml-2'>
                Inicia sesion
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
