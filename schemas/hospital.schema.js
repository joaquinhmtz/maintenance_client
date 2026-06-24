import { z } from "zod";

export const hospitalSchema = z
    .object({
        name: z
            .string()
            .min(3, "El nombre es obligatorio"),
    })