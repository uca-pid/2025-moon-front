import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { login } from '@/services/users'
import { useStore } from '@/zustand/store'
import { decodeJwtPayload, getExpirationDate } from '@/helpers/jwt-decode'
import type { User } from '@/zustand/session/session.types'
import { useNavigate } from 'react-router-dom'

interface LoginResponse {
  token: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login: loginStore } = useStore()
  const navigate = useNavigate()
  
  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response: LoginResponse = await login(email, password)

      const userDecoded = decodeJwtPayload(response.token) as unknown as User
      console.log(userDecoded)
      if (userDecoded) {
        const expiresAt = getExpirationDate(userDecoded.exp as number)
        loginStore({
          ...userDecoded,
          id: userDecoded.id,
          fullName: userDecoded.fullName,
          email: userDecoded.email,
          userRole: userDecoded.userRole,
          expiresAt,
          workshopName: userDecoded.workshopName,
          address: userDecoded.address,
        })
      }

      navigate('/home')

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 w-xl', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido a Estaller</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLogin}>
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
                <div className='flex items-center'>
                  <Label htmlFor='password'>Contraseña</Label>
                  <a
                    onClick={() => navigate('/passwordRecovery')}
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    Olvidaste tu contraseña?
                  </a>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='pr-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                    aria-pressed={showPassword}
                    className='absolute inset-y-0 right-2 my-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground'
                  >
                    {showPassword ? (
                      <Eye className='h-4 w-4' />
                    ) : (
                      <EyeOff className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>
              <div className='flex flex-col gap-3'>
                <Button type='submit' className='w-full'>
                  Iniciar sesión
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Iniciar sesión con Google
                </Button> */}
              </div>
            </div>
            <div className='mt-4 text-center text-sm'>
              No tenés una cuenta?{' '}
              <a onClick={() => navigate('/register')} className='underline underline-offset-4'>
                Registrate
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
