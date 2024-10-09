import { useQuery } from "@tanstack/react-query";
import { Command } from "@tauri-apps/plugin-shell";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { ButtonUpdate } from "./ButtonUpdate";

// For getting outdated packages
const packageSchema = z.object({
  current: z.string(),
  wanted: z.string(),
  latest: z.string(),
  dependent: z.string(),
  location: z.string(),
});
const dataSchema = z.record(z.string(), packageSchema);

export const TableDependencies = () => {
  // const queryClient = useQueryClient(); // use later for optimistic updates
  const {
    data: dependencies,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["dependencies"],
    queryFn: async () => {
      const result = await Command.create("get-outdated-packages").execute();

      if (result.stderr !== "") {
        throw new Error(result.stderr);
      }
      const dependenciesRaw = JSON.parse(result.stdout);
      const dependencies = dataSchema.parse(dependenciesRaw);
      return dependencies;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isSuccess) {
    return <div>Error</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Outdated Dependencies</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Current Version</TableHead>
            <TableHead>Wanted Version</TableHead>
            <TableHead>Latest Version</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(dependencies).map(([name, packageData]) => (
            <TableRow key={name}>
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell>{packageData.current}</TableCell>
              <TableCell>{packageData.wanted}</TableCell>
              <TableCell>{packageData.latest}</TableCell>
              <TableCell className="text-right">
                <ButtonUpdate packageName={name} version={packageData.wanted} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
