import { useQuery } from "@tanstack/react-query";
import { Command } from "@tauri-apps/plugin-shell";
import { z } from "zod";

// For getting outdated packages
const packageSchema = z.object({
  current: z.string().optional(),
  wanted: z.string(),
  latest: z.string(),
  dependent: z.string(),
  location: z.string().optional(),
  type: z
    .enum([
      "devDependencies",
      "optionalDependencies",
      "peerDependencies",
      "dependencies",
    ])
    .optional(),
  homepage: z.string().url().optional(),
});
const dataSchema = z.record(z.string(), packageSchema);

export const useOutdatedDependencies = (directory: string) => {
  return useQuery({
    queryKey: ["dependencies", directory],
    queryFn: async () => {
      const result = await Command.create("get-outdated-packages", [
        "outdated",
        "--json",
        "--long",
        "--parseable",
        "--prefix",
        directory,
      ]).execute();

      if (result.stderr !== "") {
        throw new Error(result.stderr);
      }
      const dependenciesRaw = JSON.parse(result.stdout);
      const dependencies = dataSchema.parse(dependenciesRaw);
      return dependencies;
    },
  });
};
