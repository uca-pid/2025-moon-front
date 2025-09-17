import { Routing } from "./routes/routing";
import { UserResolver } from "./routes/Resolvers/UserResolver";
import { LoaderModal } from "@/components/LoaderModal";

function App() {
  return (
    <UserResolver>
      <Routing />
      <LoaderModal />
    </UserResolver>
  );
}

export default App;
