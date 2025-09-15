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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function PasswordRecoveryForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  
  return (
    <div className={cn("flex flex-col gap-6 w-xl", className)} {...props}>
      <Card>
        {!emailSent ? (
          <div className="flex flex-col gap-4">
            <CardHeader>
              <CardTitle>Recupere su contraseña</CardTitle>
              <CardDescription>Ingrese su Email</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={() => setEmailSent(true)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Input
                      id="email"
                      type="email"
                      placeholder="mail@example.com"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                    >
                      Enviar mail para recuperar su contraseña.
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/login')}
                    >
                      Volver
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
