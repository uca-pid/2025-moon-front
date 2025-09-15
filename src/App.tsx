import { Routing } from "./routes/routing";
import { UserResolver } from "./routes/Resolvers/UserResolver";

function App() {
  return (
    <UserResolver>
      <Routing />
    </UserResolver>
  );
}

export default App;
