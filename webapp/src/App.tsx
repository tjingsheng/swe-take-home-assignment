import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SalaryTable } from "./components/SalaryTable.tsx";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

const queryClient = new QueryClient();
const theme = createTheme({});

export function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SalaryTable />
      </QueryClientProvider>
    </MantineProvider>
  );
}
