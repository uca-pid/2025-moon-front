import { Button } from "@/components/ui/button";
import { useStore } from "@/zustand/store";
import { UserRoles } from "@/zustand/session/session.types";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/Container";

export const Home = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  return (
    <Container>
      <div className="w-full max-w-6xl flex-1 p-8">
        <h1 className="text-primary text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          Hola <span className="italic">{user.fullName}</span>
        </h1>
        <div className="gap-3 flex w-full">
          {user.userRole === UserRoles.MECHANIC ? (
            <Button
              variant="outline"
              className="px-6 py-5 text-foreground gap-3"
              onClick={() => navigate("/shifts")}
            >
              Queres ver tus turnos?
            </Button>
          ) : (
            <div className="flex flex-col justify-evenly gap-5 w-full">
              <Button
                variant="outline"
                className="px-6 py-5 text-foreground gap-3"
                onClick={() => navigate("/appointments")}
              >
                Queres reservar un turno?
              </Button>
              <Button
                variant="outline"
                className="px-6 py-5 text-foreground gap-3"
                onClick={() => navigate("/vehicles")}
              >
                Queres ver tus vehiculos?
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};
