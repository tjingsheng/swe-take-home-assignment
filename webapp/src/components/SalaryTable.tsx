import { Loader, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function SalaryTable() {
  const { isLoading, data: persons } = useQuery({
    queryKey: ["persons"],
    queryFn: async () => {
      const response = await axios.get("/api/users");
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
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Salary</Table.Th>
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
    )
  );
}
