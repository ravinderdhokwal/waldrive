import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { ApiResponse } from "../utils/response.utils.js";

export const validate = (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message
        }));

        return ApiResponse.error(res, 400, "Validation Error", errors);
    }
    
    next();
}