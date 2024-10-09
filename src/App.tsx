import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { Application } from "./Application";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Application />
      <Toaster position="bottom-left" richColors />
    </QueryClientProvider>
  );
}

export default App;
