import type { Response } from "express";
import type { ApiResponseBody } from "../types/responseBody.types.js";


const ApiResponseHandler = <T>(
    res: Response,
    statusCode: number,
    success: boolean,
    message?: string | null,
    data?: T | null,
    error?: string
) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
        error
    })
}

export class ApiResponse {
    static success<T>(
        res: Response,
        message?: string | null, 
        data?: T | null,
        statusCode: number = 200
    ): Response<ApiResponseBody<T>> {
        return ApiResponseHandler<T>(res, statusCode, true, message, data);
    }

    static error<T>(
        res: Response, 
        statusCode: number, 
        message: string, 
        error?: string
    ): Response<ApiResponseBody<T>> {
        return ApiResponseHandler<T>(res, statusCode, false, message, null, error);
    }
}