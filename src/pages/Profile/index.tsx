import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { InputError } from "@/components/input-error"
import { useStore } from "@/zustand/store"
import { useMemo, useState } from "react"
import { UserRoles } from "@/zustand/session/session.types"
import { LogOut } from "lucide-react"
import { Container } from "@/components/Container"

export const Profile = () => {
  const user = useStore((state) => state.user)
  const clearSession = useStore((state) => state.clearSession)
  const showLoading = useStore((state) => state.showLoading)
  const hideLoading = useStore((state) => state.hideLoading)

  const [fullName, setFullName] = useState(user.fullName)
  const [workshopName, setWorkshopName] = useState(user.workshopName)
  const [address, setAddress] = useState(user.address)
  const [role] = useState(user.userRole)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [changing, setChanging] = useState(false)
  const [changed, setChanged] = useState(false)

  const [touched, setTouched] = useState<{ [k: string]: boolean }>({})
  const markTouched = (key: string) => setTouched((t) => ({ ...t, [key]: true }))

  const email = user.email

  const isUserMechanic = role === UserRoles.MECHANIC

  const nameValid = fullName.trim().length > 0
  const addressValid = !isUserMechanic ? true : address.trim().length > 0

  const passwordRules = useMemo(() => ({ minLength: 6, uppercase: /[A-Z]/, digit: /\d/ }), [])
  const newPassValid =
    newPassword.length === 0 ||
    (newPassword.length >= passwordRules.minLength &&
      passwordRules.uppercase.test(newPassword) &&
      passwordRules.digit.test(newPassword))
  const confirmPassValid = confirmNewPassword.length === 0 || confirmNewPassword === newPassword
  const currentPassValid = currentPassword.length === 0 || currentPassword.length >= 1

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameValid || !addressValid) {
      markTouched('fullName')
      if (isUserMechanic) markTouched('address')
      return
    }
    try {
      setSaving(true)
      showLoading('Guardando cambios…')
      setSaved(false)
      // TODO: Implement update profile
      setSaved(true)
    } finally {
      setSaving(false)
      hideLoading()
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassValid || !newPassValid || !confirmPassValid || newPassword.length === 0) {
      markTouched('currentPassword')
      markTouched('newPassword')
      markTouched('confirmNewPassword')
      return
    }
    try {
      setChanging(true)
      showLoading('Actualizando contraseña…')
      setChanged(false)
      // TODO: Implement change password
      setChanged(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } finally {
      setChanging(false)
      hideLoading()
      setTimeout(() => setChanged(false), 2000)
    }
  }

  return (
    <Container>
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tu perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSaveProfile} className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input value={email} id="email" disabled />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <InputError
                    isValid={!touched.fullName ? true : nameValid}
                    message={'El nombre es requerido'}
                  >
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => markTouched('fullName')}
                    />
                  </InputError>
                </div>

                {isUserMechanic && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="workshopName">Nombre del local</Label>
                      <Input
                        id="workshopName"
                        value={workshopName}
                        onChange={(e) => setWorkshopName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Dirección</Label>
                      <InputError
                        isValid={!touched.address ? true : addressValid}
                        message={'La dirección es requerida'}
                      >
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          onBlur={() => markTouched('address')}
                        />
                      </InputError>
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Guardando…' : saved ? 'Guardado' : 'Guardar cambios'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cambiar contraseña</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onChangePassword} className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <InputError
                    isValid={!touched.currentPassword ? true : currentPassValid}
                    message={'La contraseña actual es requerida'}
                  >
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      onBlur={() => markTouched('currentPassword')}
                    />
                  </InputError>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <InputError
                    isValid={!touched.newPassword ? true : newPassValid}
                    message={'Mín 6 caracteres, 1 mayúscula y 1 número'}
                  >
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onBlur={() => markTouched('newPassword')}
                    />
                  </InputError>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmNewPassword">Confirmar nueva contraseña</Label>
                  <InputError
                    isValid={!touched.confirmNewPassword ? true : confirmPassValid}
                    message={
                      confirmNewPassword.length === 0
                        ? 'La confirmación es requerida'
                        : 'Las contraseñas no coinciden'
                    }
                  >
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      onBlur={() => markTouched('confirmNewPassword')}
                    />
                  </InputError>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={changing}>
                    {changing ? 'Actualizando…' : changed ? 'Actualizada' : 'Actualizar contraseña'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <Button type="button" variant="destructive" onClick={() => { showLoading('Cerrando sesión…'); setTimeout(() => { clearSession(); hideLoading(); }, 300); }}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </Container>
  )
}