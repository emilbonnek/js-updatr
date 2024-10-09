import { useMutation } from "@tanstack/react-query";
import { open } from "@tauri-apps/plugin-dialog";

export const useSelectCurrentDirectory = () => {
  return useMutation({
    mutationKey: ["folder"],
    mutationFn: async () => {
      const result = open({
        multiple: false,
        directory: true,
      });

      if (result === null) {
        return undefined;
      }

      return result;
    },
  });
};
