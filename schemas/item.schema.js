import { z } from "zod";

export const itemSchema = z
    .object({
        hospital: z
            .string()
            .min(1, "El hospital es obligatorio"),

        name: z
            .string()
            .min(3, "El nombre es obligatorio"),

        serie: z
            .string()
            .min(3, "El no. de serie es obligatorio"),

        brand: z
            .string()
            .min(1, "La marca es obligatoria"),
        
        model: z
            .string()
            .min(1, "El modelo es obligatorio"),

        area: z
            .string()
            .min(1, "El área es obligatorio"),

        active: z.boolean()
    })