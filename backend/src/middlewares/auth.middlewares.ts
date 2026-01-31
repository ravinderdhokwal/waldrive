import jwt, { type JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/handler.utils.js";
import { AUTH_MESSAGE } from "../utils/messages.utils.js";
import { ApiResponse } from "../utils/response.utils.js";
import { UserService } from "../services/user.services.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
    
    const token = req.cookies?.accessToken ?? req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return ApiResponse.error(res, 401, AUTH_MESSAGE.UNAUTHORIZED);
    }

    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
    } catch (error) {
        return ApiResponse.error(res, 401, AUTH_MESSAGE.UNAUTHORIZED);
    }

    const user = await UserService.findUserById(decoded.id);
    if (!user) {
        return ApiResponse.error(res, 401, AUTH_MESSAGE.UNAUTHORIZED);
    }

    req.user = {
        id: user.id,
        verified: user.verified
    };
    
    next();
});