import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function PasswordRecoveryForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [emailSent, setEmailSent] = useState(true);
  return (
    <div className={cn("flex flex-col gap-6 w-xl", className)} {...props}>
      <Card>
        {emailSent ? (
          <div>
            <CardHeader>
              <CardTitle>Recupere su contraseña</CardTitle>
              <CardDescription>Ingrese su Email</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      type="button"
                      onClick={() => setEmailSent(false)}
                      className="w-full"
                    >
                      Enviar mail para recuperar su contraseña.
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </div>
        ) : (
          <CardHeader>
            <CardTitle>
              Ya enviamos un mail a su correo para recuperar su contraseña.
            </CardTitle>
          </CardHeader>
        )}
      </Card>
    </div>
  );
}
