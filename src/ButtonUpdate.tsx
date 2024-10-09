import { Loader2, CloudDownload } from "lucide-react";
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
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CloudDownload className="mr-2 h-4 w-4" />
      )}
      Update
    </Button>
  );
};
