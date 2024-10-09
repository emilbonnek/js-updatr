import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { ButtonUpdate } from "./ButtonUpdate";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { InternalErrorPage } from "./components/internal-error-page";
import { useOutdatedDependencies } from "./useOutdatedDependencies";
import { Button } from "./components/ui/button";

export const TableDependencies = ({
  currentDirectory,
  selectCurrentDirectory,
}: {
  currentDirectory: string;
  selectCurrentDirectory: () => void;
}) => {
  const [animationParent] = useAutoAnimate();
  const {
    data: dependencies,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useOutdatedDependencies(currentDirectory);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <InternalErrorPage errorMessage={error.message} />;
  }

  if (!isSuccess) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Button onClick={selectCurrentDirectory}>Select Folder</Button>
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
        <TableBody ref={animationParent}>
          {Object.entries(dependencies).map(([name, packageData]) => (
            <TableRow key={name}>
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell>{packageData.current}</TableCell>
              <TableCell>{packageData.wanted}</TableCell>
              <TableCell>{packageData.latest}</TableCell>
              <TableCell className="text-right">
                <ButtonUpdate
                  directory={currentDirectory}
                  packageName={name}
                  version={packageData.wanted}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
