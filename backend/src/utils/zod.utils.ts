import { z } from "zod";


// AUTH ZOD SCHEMAS
export const signupSchema = z.object({
    fullName: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long"),
    email: z.email(),
    password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character")
});

export const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long")
});


// FOLDERS ZOD SCHEMA
export const createFolderSchema = z.object({
    folderName: z.string()
    .min(2, "Folder name must be at least 2 characters long")
    .max(20, "Folder name must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9 _-]+$/, "Folder name can only contain letters, numbers, spaces, hyphens, and underscores")
});
