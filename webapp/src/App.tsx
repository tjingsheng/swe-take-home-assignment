import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Home } from "./Home.tsx";

const queryClient = new QueryClient();
const theme = createTheme({});

export function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}
