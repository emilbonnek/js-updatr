import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TableDependencies } from "./TableDependencies";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TableDependencies />
    </QueryClientProvider>
  );
}

export default App;
