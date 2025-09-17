import { Button } from "@/components/ui/button";
import { useStore } from "@/zustand/store";
import { UserRoles } from "@/zustand/session/session.types";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/Container";

export const Home = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user)

  return (
    <Container>
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          Hola <span className="italic">{user.fullName}</span>
        </h1>

        {
          user.userRole === UserRoles.MECHANIC ? (
            <Button variant="outline" className="px-6 py-5 text-base" onClick={() => navigate("/shifts")}>
              Queres ver tus turnos?
            </Button>
          ) : (
            <Button variant="outline" className="px-6 py-5 text-base" onClick={() => navigate("/appointments")}>
              Queres reservar un turno?
            </Button>
          )
        }
      </div>
    </Container>
  );
};