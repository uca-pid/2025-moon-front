import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useStore } from "@/zustand/store";
import { UserRoles } from "@/zustand/session/session.types";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user)

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          Hola <span className="italic">{user.fullName}</span>
        </h1>

        <Button variant="outline" className="px-6 py-5 text-base" onClick={() => navigate(user.userRole === UserRoles.USER ? "/appointments" : "/home")}>
          Queres reservar un turno?
        </Button>
      </div>
    </div>
  );
};