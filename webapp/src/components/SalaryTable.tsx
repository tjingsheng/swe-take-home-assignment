import {
  ActionIcon,
  Card,
  Group,
  Loader,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconSortAscending } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type SortKey = "DEFAULT" | "NAME" | "SALARY";

export function SalaryTable() {
  const [sort, setSort] = useState<SortKey>("DEFAULT");
  const handleSort = (key: SortKey) => {
    setSort((prev) => (prev === key ? "DEFAULT" : key));
  };

  const { isLoading, data: persons } = useQuery({
    queryKey: ["persons", sort],
    queryFn: async () => {
      const response = await axios.get("/api/users", {
        params: {
          sort: sort !== "DEFAULT" ? sort : undefined,
        },
      });

      const responseData = response.data;
      const persons = responseData.results as {
        name: string;
        salary: number;
      }[];
      return persons;
    },
  });

  return isLoading ? (
    <Loader />
  ) : (
    persons && (
      <Stack>
        <Card withBorder>
          <Group></Group>
        </Card>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Group gap="xs" align="center">
                  <Text>Name</Text>
                  <ActionIcon
                    variant={sort === "NAME" ? "filled" : "subtle"}
                    size="xs"
                    onClick={() => handleSort("NAME")}
                    style={{ cursor: "pointer" }}
                  >
                    <IconSortAscending />
                  </ActionIcon>
                </Group>
              </Table.Th>
              <Table.Th>
                <Group gap="xs" align="center">
                  <Text>Salary</Text>
                  <ActionIcon
                    variant={sort === "SALARY" ? "filled" : "subtle"}
                    size="xs"
                    onClick={() => handleSort("SALARY")}
                  >
                    <IconSortAscending />
                  </ActionIcon>
                </Group>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {persons.map((person) => (
              <Table.Tr key={person.name}>
                <Table.Td>{person.name}</Table.Td>
                <Table.Td>${person.salary.toFixed(2)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    )
  );
}
