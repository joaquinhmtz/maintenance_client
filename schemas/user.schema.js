import { z } from "zod";

export const userSchema = z
    .object({
        name: z
            .string()
            .min(3, "El nombre es obligatorio"),

        lastname: z
            .string()
            .min(3, "El apellido paterno es obligatorio"),

        lastname2: z
            .string()
            .min(3, "El apellido materno es obligatorio"),

        speciality: z
            .string()
            .min(1, "Selecciona una especialidad"),

        email: z
            .string()
            .min(1, "El correo es obligatorio")
            .email("Correo inválido"),

        password: z
            .string()
            .min(8, "Mínimo 8 caracteres")
            .regex(/[A-Z]/, "Debe contener una mayúscula")
            .regex(/[a-z]/, "Debe contener una minúscula")
            .regex(/\d/, "Debe contener un número")
            .regex(/[^A-Za-z0-9]/, "Debe contener un carácter especial"),

        confirmPassword: z
            .string(),

        active: z.boolean()
    })
    .refine(
        data => data.password === data.confirmPassword,
        {
            message: "Las contraseñas no coinciden",
            path: ["confirmPassword"]
        }
    );