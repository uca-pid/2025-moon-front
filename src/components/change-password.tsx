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
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import { changePassword } from "@/services/users";

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token");
  const email = params.get("email");
  // toDo: chequear que ni el token ni el email son null, si son null q muestre un error.
  const onClickChangePassword = (e) => {
    e.preventDefault();
    changePassword(email || "", token || "", password);
  };

  return (
    <div className={cn("flex flex-col gap-6 w-xl", className)} {...props}>
      <Card>
        <div className="flex flex-col gap-4">
          <CardHeader>
            <CardTitle>Ingrese una nueva contraseña</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      value={email || ""}
                      disabled
                      id="email"
                      type="email"
                      placeholder="mail@example.com"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-2 my-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 cursor-pointer" />
                      ) : (
                        <EyeOff className="h-4 w-4 cursor-pointer" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      value={checkPassword}
                      onChange={(e) => setCheckPassword(e.target.value)}
                      id="password"
                      type={showPassword2 ? "text" : "password"}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword2((prev) => !prev)}
                      aria-label={
                        showPassword2
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      aria-pressed={showPassword2}
                      className="absolute inset-y-0 right-2 my-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                    >
                      {showPassword2 ? (
                        <Eye className="h-4 w-4 cursor-pointer" />
                      ) : (
                        <EyeOff className="h-4 w-4 cursor-pointer" />
                      )}
                    </button>
                  </div>
                  <Button
                    type="submit"
                    onClick={onClickChangePassword}
                    className="w-full"
                  >
                    Cambiar Contraseña
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
