import { z } from "zod";

export const requestSchema = z
    .object({
        hospital: z
            .string()
            .min(1, "El hospital es obligatorio"),

        item: z
            .string()
            .min(3, "El equipo es obligatorio"),

        priority: z
            .string()
            .min(3, "La prioridad es obligatoria"),

        typeService: z
            .string()
            .min(3, "El tipo de servicio es obligatorio"),

        description: z
            .string()
            .min(1, "La descripción es obligatoria"),
        
        responsible: z
            .string()
            .min(1, "El responsable es obligatorio"),
    })