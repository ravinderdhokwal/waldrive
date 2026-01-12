import type { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler = 
    <T extends RequestHandler>(handler: T) => 
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await handler(req, res, next);
    } catch (error) {
        console.log("!!! ERROR OCCURED !!!");
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}