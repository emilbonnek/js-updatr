import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Command } from "@tauri-apps/plugin-shell";
import { toast } from "sonner";
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

export function useUpdateDependency({
  directory,
  packageName,
  version,
}: {
  directory: string;
  packageName: string;
  version: string;
}) {
  const queryClient = useQueryClient();

  return useMutation({
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
        "--json",
        "--parseable",
        "--prefix",
        directory,
      ]).execute();

      if (result.stderr !== "") {
        throw new Error(result.stderr);
      }

      const responseRaw = JSON.parse(result.stdout);
      const response = responseSchema.parse(responseRaw);
      return response;
    },
    onSuccess: () => {
      const dependencies = queryClient.getQueryData([
        "dependencies",
        directory,
      ]) as Record<string, any>;
      const newDependencies = Object.fromEntries(
        Object.entries(dependencies).filter(([name]) => name !== packageName)
      );
      queryClient.setQueryData(["dependencies", directory], newDependencies);
      queryClient.invalidateQueries({ queryKey: ["dependencies", directory] });
      toast.success(`Successfully updated ${packageName} to ${version}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to update ${packageName} to ${version}`);
    },
  });
}
