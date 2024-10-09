import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TableDependencies } from "./TableDependencies";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TableDependencies />
      <Toaster position="bottom-left" richColors />
    </QueryClientProvider>
  );
}

export default App;
