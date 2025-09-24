import { Routing } from "./routes/routing";
import { UserResolver } from "./routes/Resolvers/UserResolver";
import { LoaderModal } from "@/components/LoaderModal";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

function App() {
  return (
    <UserResolver>
      <ThemeProvider>
        <Routing />
        <LoaderModal />
        <Toaster position="top-center" richColors />
      </ThemeProvider>
    </UserResolver>
  );
}

export default App;
