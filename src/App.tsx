import { Routing } from "./routes/routing";
import { UserResolver } from "./routes/Resolvers/UserResolver";
import { LoaderModal } from "@/components/LoaderModal";
import { ThemeProvider } from "@/components/ThemeProvider";

function App() {
  return (
    <UserResolver>
      <ThemeProvider>
        <Routing />
        <LoaderModal />
      </ThemeProvider>
    </UserResolver>
  );
}

export default App;
