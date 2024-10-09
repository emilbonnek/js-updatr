import { useMutation } from "@tanstack/react-query";
import { open } from "@tauri-apps/plugin-dialog";

export const useSelectCurrentDirectory = () => {
  return useMutation({
    mutationKey: ["folder"],
    mutationFn: async () => {
      return open({
        multiple: false,
        directory: true,
      });
    },
  });
};
