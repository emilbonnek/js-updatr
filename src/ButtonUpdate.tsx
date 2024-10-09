import { Button } from "./components/ui/button";
import { useUpdateDependency } from "./useUpdateDependency";

export const ButtonUpdate = ({
  directory,
  packageName,
  version,
}: {
  directory: string;
  packageName: string;
  version: string;
}) => {
  const { mutate, isPending } = useUpdateDependency({
    directory,
    packageName,
    version,
  });

  return (
    <Button
      onClick={() => {
        mutate({
          packageName,
          version,
        });
      }}
      disabled={isPending}
    >
      Update
    </Button>
  );
};
