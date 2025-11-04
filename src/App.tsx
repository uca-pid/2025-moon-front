import { Routing } from "./routes/routing";
import { UserResolver } from "./routes/Resolvers/UserResolver";
import { LoaderModal } from "@/components/LoaderModal";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
    return (
        <UserResolver>
            <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <Routing />
                    <LoaderModal />
                    <Toaster position="top-center" richColors />
                </QueryClientProvider>
            </ThemeProvider>
        </UserResolver>
    );
}

export default App;
