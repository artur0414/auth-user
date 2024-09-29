import { z } from "zod";

const userAuth = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres."),
  password: z
    .string()
    .min(3, "La contraseña debe tener al menos 3 caracteres."),
});

export const validateApi = (input) => {
  return userAuth.safeParse(input);
};
