import {
  ActionIcon,
  Card,
  Grid,
  Group,
  Loader,
  NumberInput,
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
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(0);
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(4000);

  const handleSort = (key: SortKey) => {
    setSort((prev) => (prev === key ? "DEFAULT" : key));
  };

  const { isLoading, data: persons } = useQuery({
    queryKey: ["persons", sort, offset, limit, min, max],
    queryFn: async () => {
      const response = await axios.get("/api/users", {
        params: {
          sort: sort !== "DEFAULT" ? sort : undefined,
          offset: Math.max(offset, 0),
          limit: Math.max(limit, 0),
          min,
          max,
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
          <Grid>
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <NumberInput
                label="Offset"
                value={offset}
                min={0}
                description="Offset from the beginning"
                onChange={(value) => setOffset(parseInt(String(value), 10))}
              />
            </Grid.Col>
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <NumberInput
                label="Limit"
                value={limit}
                min={0}
                description="0 means no limit"
                onChange={(value) => setLimit(parseInt(String(value), 10))}
              />
            </Grid.Col>
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <NumberInput
                label="Min"
                value={min}
                min={0}
                step={100}
                description="Should be less than Max"
                onChange={(value) => setMin(parseInt(String(value), 10))}
              />
            </Grid.Col>
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <NumberInput
                label="Max"
                value={max}
                min={0}
                step={100}
                description="Should be greater than Min"
                onChange={(value) => setMax(parseInt(String(value), 10))}
              />
            </Grid.Col>
          </Grid>
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
