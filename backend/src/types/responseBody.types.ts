export interface ApiResponseBody<T> {
    success: boolean;
    message?: string;
    data?: T | null;
    error?: string;
}