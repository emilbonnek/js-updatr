import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./components/ui/button";
import { Command } from "@tauri-apps/plugin-shell";
import { z } from "zod";

const vulnerabilitiesSchema = z.object({
  info: z.number(),
  low: z.number(),
  moderate: z.number(),
  high: z.number(),
  critical: z.number(),
  total: z.number(),
});

const dependenciesSchema = z.object({
  prod: z.number(),
  dev: z.number(),
  optional: z.number(),
  peer: z.number(),
  peerOptional: z.number(),
  total: z.number(),
});

const auditSchema = z.object({
  vulnerabilities: vulnerabilitiesSchema,
  dependencies: dependenciesSchema,
});

const responseSchema = z.object({
  added: z.number(),
  removed: z.number(),
  changed: z.number(),
  audited: z.number(),
  funding: z.number(),
  audit: auditSchema,
});

export const ButtonUpdate = ({
  packageName,
  version,
}: {
  packageName: string;
  version: string;
}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-dependency", packageName, version],
    mutationFn: async ({
      packageName,
      version,
    }: {
      packageName: string;
      version: string;
    }) => {
      const result = await Command.create("install-package", [
        "install",
        `${packageName}@${version}`,
      ]).execute();

      if (result.stderr !== "") {
        throw new Error(result.stderr);
      }

      const responseRaw = JSON.parse(result.stdout);
      const response = responseSchema.parse(responseRaw);
      return response;
    },
    // Optimistic update (it should be removed from the dependencies list)
    onMutate: async ({ packageName }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["dependencies"] });

      // Snapshot the previous value
      const previousDependencies = queryClient.getQueryData([
        "dependencies",
      ]) as Record<string, any>;

      // The new dependencies, should just have remoced the key with the packageName
      const newDependencies = Object.fromEntries(
        Object.entries(previousDependencies).filter(
          ([key]) => key !== packageName
        )
      );

      // Optimistically update to the new value
      queryClient.setQueryData(["dependencies"], newDependencies);

      // Return a context object with the snapshotted value
      return { previousDependencies };
    },
    // If the mutation fails, use the context to roll back
    onError: (_err, _variables, context) => {
      if (context)
        queryClient.setQueryData(
          ["dependencies"],
          context.previousDependencies
        );
    },
    // On success, invalidate the dependencies query
    onSuccess: () => {
      // On success, remove the dependency from the list
      queryClient.invalidateQueries({ queryKey: ["dependencies"] });
    },
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
