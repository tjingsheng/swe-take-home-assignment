import {
  Accordion,
  ActionIcon,
  Button,
  Card,
  Center,
  Grid,
  Group,
  Loader,
  NumberInput,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconFileTypeCsv,
  IconFilter,
  IconSortAscending,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { CsvFileInput } from "./CsvFileInput.tsx";

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

  const handleClearFilters = () => {
    setOffset(0);
    setLimit(0);
    setMin(0);
    setMax(4000);
  };

  return isLoading ? (
    <Loader />
  ) : (
    persons && (
      <Stack gap="xl">
        <Title> Salary </Title>
        <Accordion>
          <Accordion.Item key="filters" value="Filters">
            <Accordion.Control icon={<IconFilter />}>Filters</Accordion.Control>
            <Accordion.Panel>
              <Card withBorder>
                <Grid>
                  <Grid.Col span={{ sm: 12, md: 6 }}>
                    <NumberInput
                      label="Offset"
                      value={offset}
                      min={0}
                      description="Offset from the beginning"
                      onChange={(value) =>
                        setOffset(parseInt(String(value), 10))
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ sm: 12, md: 6 }}>
                    <NumberInput
                      label="Limit"
                      value={limit}
                      min={0}
                      description="0 means no limit"
                      onChange={(value) =>
                        setLimit(parseInt(String(value), 10))
                      }
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
                  <Center w="100%" m="md" onClick={handleClearFilters}>
                    <Button>Clear Filters</Button>
                  </Center>
                </Grid>
              </Card>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item key="upload" value="Upload">
            <Accordion.Control icon={<IconFileTypeCsv />}>
              File Upload
            </Accordion.Control>
            <Accordion.Panel>
              <Card withBorder>
                <CsvFileInput />
              </Card>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Card withBorder>
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
        </Card>
      </Stack>
    )
  );
}
