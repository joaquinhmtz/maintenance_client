import { z } from "zod";

const baseRequestSchema = z
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
            .min(1, "El coordinador es obligatorio"),
        visitDate: z.string().optional(),
        visitManager: z.string().optional(),
        action: z.string().optional()
    });

export const requestSchema = baseRequestSchema.superRefine((data, ctx) => {
    if (data.action && data.action === "programar") {
        if (!data.visitDate || data.visitDate === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["visitDate"],
                message: "La fecha de visita es obligatoria",
            });
        }
        if (!data.visitManager || data.visitManager === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["visitManager"],
                message: "El responsable de visita es obligatorio",
            });
        }
    }
});