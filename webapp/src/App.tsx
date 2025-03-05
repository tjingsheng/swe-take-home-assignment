import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SalaryTable } from "./components/SalaryTable.tsx";
import { Card, Center, createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

const queryClient = new QueryClient();
const theme = createTheme({});

export function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Center>
          <Card
            w={{ base: "100%", sm: "80%", md: "60%", lg: "40%" }}
            m="xl"
            withBorder
          >
            <SalaryTable />
          </Card>
        </Center>
      </QueryClientProvider>
    </MantineProvider>
  );
}
