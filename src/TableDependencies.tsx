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
import { Skeleton } from "./components/ui/skeleton";

export const TableDependencies = ({
  currentDirectory,
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
    return (
      <div className="container mx-auto py-10 w-full">
        <Skeleton className="w-full h-10 mb-2" />
        <Skeleton className="w-full h-10 mb-2" />
        <Skeleton className="w-full h-10 mb-2" />
      </div>
    );
  }

  if (isError) {
    return <InternalErrorPage errorMessage={error.message} />;
  }

  if (!isSuccess) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
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
                  version={packageData.latest}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
