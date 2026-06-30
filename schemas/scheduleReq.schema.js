import { z } from "zod";

export const scheduleSchema = z.object({
    visitDate: z.string().min(1, "La fecha de visita es obligatoria"),
    visitManager: z.string().min(1, "El responsable es obligatorio"),
    action: z.string().optional()
});