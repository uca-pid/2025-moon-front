import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [mechanic, setMechanic] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6 w-xl", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Regístrate</CardTitle>
          <CardDescription>
            Solo necesitamos que completes algunos datos antes de que tu cuenta
            este lista.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="full-name">Nombre completo</Label>
                <Input id="full-name" type="full-name" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                </div>
                <Input id="confirm-password" type="password" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox checked={mechanic} onCheckedChange={() => setMechanic(!mechanic)} />
                  <p>
                    ¿Quieres registrarte como mecanico?
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                {mechanic && (
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="local-name">Nombre del local</Label>
                      </div>
                      <Input id="local-name" type="local-name" required />
                      <div className="flex items-center">
                        <Label htmlFor="local-address">Direccion</Label>
                      </div>
                      <Input id="local-address" type="local-address" required />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Crear cuenta
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Ya tenes una cuenta?
              <a href="/login" className="underline underline-offset-4 ml-2">
                Inicia sesion
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
