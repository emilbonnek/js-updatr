import { CoolTopMenu } from "./components/cool-top-menu";
import { Button } from "./components/ui/button";
import { TableDependencies } from "./TableDependencies";
import { useSelectCurrentDirectory } from "./useSelectCurrentDirectory";

export const Application = () => {
  const { mutate: selectCurrentDirectory, data: currentDirectory } =
    useSelectCurrentDirectory();

  if (currentDirectory) {
    return (
      <div>
        <CoolTopMenu
          currentDirectory={currentDirectory}
          selectCurrentDirectory={selectCurrentDirectory}
        />
        <TableDependencies
          currentDirectory={currentDirectory}
          selectCurrentDirectory={selectCurrentDirectory}
        />
      </div>
    );
  }

  return (
    <div>
      <CoolTopMenu
        currentDirectory={currentDirectory}
        selectCurrentDirectory={selectCurrentDirectory}
      />
      <div className="container grid place-items-center h-[calc(100vh-64px)]">
        <Button
          onClick={() => {
            selectCurrentDirectory();
          }}
        >
          Select Folder
        </Button>
      </div>
    </div>
  );
};
