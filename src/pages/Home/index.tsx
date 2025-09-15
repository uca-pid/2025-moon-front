import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          Hola <span className="italic">MINI PEKKA</span>
        </h1>

        <div>
          <Button variant="outline" className="px-6 py-5 text-base" onClick={() => navigate("/appointments")}>
            Queres reservar un turno?
          </Button>
        </div>
      </main>
    </div>
  );
};