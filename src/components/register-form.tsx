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
import { InputError } from '@/components/input-error'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { register } from '@/services/users'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { AddressAutocompleteNew } from './AutoCompleteAddress'

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
  const [addressHasNumber, setAddressHasNumber] = useState(false)
  const [addressLat, setAddressLat] = useState<number | null>(null)
  const [addressLng, setAddressLng] = useState<number | null>(null)
  const [addressTouched, setAddressTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [fullNameTouched, setFullNameTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmTouched, setConfirmTouched] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  
  const passwordRules = {
    minLength: 6,
    uppercase: /[A-Z]/,
    digit: /\d/,
  }

  const isValidEmail = (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
  const emailValid = email.length > 0 && isValidEmail(email)
  const fullNameValid = fullName.trim().length > 0
  const passwordValid =
    password.length >= passwordRules.minLength &&
    passwordRules.uppercase.test(password) &&
    passwordRules.digit.test(password)
  const confirmValid = confirmPassword.length > 0 && confirmPassword === password

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const addressValid =
      !isMechanic ||
      (address.trim().length > 0 && addressHasNumber && addressLat !== null && addressLng !== null)
    if (!emailValid || !fullNameValid || !passwordValid || !confirmValid || !addressValid) {
      setEmailTouched(true)
      setFullNameTouched(true)
      setPasswordTouched(true)
      setConfirmTouched(true)
      if (isMechanic) setAddressTouched(true)
      return
    }
    try {
      await register(
        email,
        fullName,
        password,
        isMechanic ? 'MECHANIC' : 'USER',
        workShopName,
        address,
        Number(addressLat),
        Number(addressLng)
      )
      toast.success('Cuenta creada correctamente')
      navigate('/login')
    } catch (error) {
      console.log(error)
      toast.error('No se pudo crear la cuenta')
    }
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
                <InputError
                  isValid={!emailTouched ? true : emailValid}
                  message={email.length === 0 ? 'El email es requerido' : 'Ingresá un email válido'}
                >
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    id='email'
                    type='email'
                    placeholder='mail@example.com'
                    required
                  />
                </InputError>
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='fullName'>Nombre completo</Label>
                <InputError
                  isValid={!fullNameTouched ? true : fullNameValid}
                  message={'El nombre es requerido'}
                >
                  <Input
                    id='fullName'
                    type='text'
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => setFullNameTouched(true)}
                  />
                </InputError>
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Contraseña</Label>
                </div>
                <InputError
                  isValid={!passwordTouched ? true : passwordValid}
                  message={'Mín 6 caracteres, 1 mayúscula y 1 número'}
                  rightAdornment={
                    <button
                      type='button'
                      onClick={() => setShowPassword((prev: boolean) => !prev)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (
                        <Eye className='h-4 w-4' />
                      ) : (
                        <EyeOff className='h-4 w-4' />
                      )}
                    </button>
                  }
                >
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                  />
                </InputError>
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='confirmPassword'>Confirmar Contraseña</Label>
                </div>
                <InputError
                  isValid={!confirmTouched ? true : confirmValid}
                  message={
                    confirmPassword.length === 0
                      ? 'La confirmación es requerida'
                      : 'Las contraseñas no coinciden'
                  }
                  rightAdornment={
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword((prev: boolean) => !prev)}
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      aria-pressed={showConfirmPassword}
                    >
                      {showConfirmPassword ? (
                        <Eye className='h-4 w-4' />
                      ) : (
                        <EyeOff className='h-4 w-4' />
                      )}
                    </button>
                  }
                >
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setConfirmTouched(true)}
                  />
                </InputError>
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
                      <AddressAutocompleteNew
                        value={address}
                        onChange={(e) => {
                          setAddress(e)
                          setAddressTouched(true)
                        }}
                        onSelect={(e) => setAddress(e?.text.text || '')}
                        onResolved={(d) => {
                          setAddressHasNumber(Boolean(d?.hasStreetNumber))
                          setAddressLat(d?.lat ?? null)
                          setAddressLng(d?.lng ?? null)
                        }}
                        invalid={addressTouched && isMechanic && !addressHasNumber}
                        errorText={'Seleccioná una dirección con altura (número).'}
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
              <a onClick={() => navigate('/login')} className='underline underline-offset-4 ml-2 cursor-pointer'>
                Inicia sesion
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
