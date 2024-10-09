import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./components/ui/button";
import { Command } from "@tauri-apps/plugin-shell";
import { z } from "zod";
import { toast } from "sonner";

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
    onSuccess: () => {
      // Make an immdiate update with the package removed, and then invalidate the cache
      const dependencies = queryClient.getQueryData(["dependencies"]) as Record<
        string,
        any
      >;
      const newDependencies = Object.fromEntries(
        Object.entries(dependencies).filter(([name]) => name !== packageName)
      );
      queryClient.setQueryData(["dependencies"], newDependencies);
      queryClient.invalidateQueries({ queryKey: ["dependencies"] });
      toast.success(`Successfully updated ${packageName} to ${version}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to update ${packageName} to ${version}`);
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
