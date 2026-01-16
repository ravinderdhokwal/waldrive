import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { asyncHandler } from "../utils/handler.utils.js";
import { AUTH_MESSAGE } from "../utils/messages.utils.js";
import { ApiResponse } from "../utils/response.utils.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
    
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) {
        return ApiResponse.error(res, 401, AUTH_MESSAGE.UNAUTHORIZED);
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
        req.user = {
            id: decoded.id,
            verified: decoded.verified
        };
    } catch (error) {
        return ApiResponse.error(res, 401, AUTH_MESSAGE.UNAUTHORIZED);
    }
    
    next();
})