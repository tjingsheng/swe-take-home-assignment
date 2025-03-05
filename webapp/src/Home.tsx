import { SalaryTable } from "./components/SalaryTable.tsx";
import { Card, Center } from "@mantine/core";
import "@mantine/core/styles.css";
import { Socials } from "./components/Socials.tsx";

export function Home() {
  return (
    <>
      <Socials />
      <Center>
        <Card
          w={{ base: "100%", sm: "80%", md: "60%", lg: "40%" }}
          m="xl"
          withBorder
        >
          <SalaryTable />
        </Card>
      </Center>
    </>
  );
}
