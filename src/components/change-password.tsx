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
import { InputError } from "@/components/input-error";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import { changePassword } from "@/services/users";

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token");
  const email = params.get("email");
  const navigate = useNavigate();
  const passwordRules = {
    minLength: 6,
    uppercase: /[A-Z]/,
    digit: /\d/,
  };

  const passwordValid =
    password.length >= passwordRules.minLength &&
    passwordRules.uppercase.test(password) &&
    passwordRules.digit.test(password);

  const confirmValid =
    confirmPassword.length > 0 && confirmPassword === password;

  const onChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordValid || !confirmValid) {
      setPasswordTouched(true);
      setConfirmTouched(true);
      return;
    }

    if (!email || !token) {
      setStatus("error");
      return;
    }

    try {
      await changePassword(email, token, password);
      setStatus("success");
      toast.success("Contraseña cambiada correctamente");
      navigate("/login");
    } catch (error) {
      console.log(error);
      setStatus("error");
      toast.error("No se pudo cambiar la contraseña");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-xl", className)} {...props}>
      <Card>
        {status === "idle" ? (
          <>
            <CardHeader>
              <CardTitle>Ingrese una nueva contraseña</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onChangePassword}>
                <div className="flex flex-col gap-6">
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
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Contraseña</Label>
                    </div>
                    <InputError
                      isValid={!passwordTouched ? true : passwordValid}
                      message={"Mín 6 caracteres, 1 mayúscula y 1 número"}
                      rightAdornment={
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                          }
                          aria-pressed={showPassword}
                        >
                          {showPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      }
                    >
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setPasswordTouched(true)}
                      />
                    </InputError>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    </div>
                    <InputError
                      isValid={!confirmTouched ? true : confirmValid}
                      message={
                        confirmPassword.length === 0
                          ? "La confirmación es requerida"
                          : "Las contraseñas no coinciden"
                      }
                      rightAdornment={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          aria-label={
                            showConfirmPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          aria-pressed={showConfirmPassword}
                        >
                          {showConfirmPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      }
                    >
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => setConfirmTouched(true)}
                      />
                    </InputError>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
                      Cambiar Contraseña
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </>
        ) : status === "success" ? (
          <>
            <CardHeader>
              <CardTitle>Tu contraseña fue cambiada correctamente.</CardTitle>
            </CardHeader>
            <CardContent>
              <Button type="button" className="w-full" onClick={() => navigate("/login")}>
                Ir a iniciar sesión
              </Button>
            </CardContent>
          </>
        ) : (
          <CardHeader>
            <CardTitle>El token es inválido o ya fue utilizado.</CardTitle>
          </CardHeader>
        )}
      </Card>
    </div>
  );
}
