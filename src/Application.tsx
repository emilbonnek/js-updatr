import { Button } from "./components/ui/button";
import { TableDependencies } from "./TableDependencies";
import { useSelectCurrentDirectory } from "./useSelectCurrentDirectory";

export const Application = () => {
  const { mutate: selectCurrentDirectory, data: currentDirectory } =
    useSelectCurrentDirectory();

  if (currentDirectory) {
    return (
      <TableDependencies
        currentDirectory={currentDirectory}
        selectCurrentDirectory={selectCurrentDirectory}
      />
    );
  }

  return (
    <Button
      onClick={() => {
        selectCurrentDirectory();
      }}
    >
      Select Folder
    </Button>
  );
};
