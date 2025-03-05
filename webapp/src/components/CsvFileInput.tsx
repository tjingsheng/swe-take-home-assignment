import { Button, FileInput, Stack } from "@mantine/core";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function CsvFileInput() {
  const [value, setValue] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { isPending, mutate: uploadFile } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["persons"] });
    },
  });

  const handleSubmit = () => {
    if (value) {
      uploadFile(value);
    }
  };

  return (
    <Stack align="center">
      <FileInput
        label="Upload CSV file"
        description="We only support CSV files"
        value={value}
        onChange={setValue}
        w="100%"
      />
      <Button type="submit" onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Uploading..." : "Submit"}
      </Button>
    </Stack>
  );
}
