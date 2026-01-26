import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/handler.utils.js";
import { ApiResponse } from "../utils/response.utils.js";
import { AUTH_MESSAGE } from "../utils/messages.utils.js";
import type { CookieOptions } from "express-serve-static-core";
import { UserService } from "../services/user.services.js";

export const signUp = asyncHandler(async (req, res) => {

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return ApiResponse.error(res, 400, AUTH_MESSAGE.ALL_FIELDS_REQUIRED);
    }

    const user = await UserService.findUserByEmail(email);
    if (user != null) {
        return ApiResponse.error(res, 400, AUTH_MESSAGE.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserService.createUser({ fullName, email, password: hashedPassword });

    return ApiResponse.success(res, AUTH_MESSAGE.USER_SIGNED_UP, null, 201);
});

export const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return ApiResponse.error(res, 400, AUTH_MESSAGE.ALL_FIELDS_REQUIRED);
    }

    const user = await UserService.findUserByEmail(email);
    if (user == null) {
        return ApiResponse.error(res, 400, AUTH_MESSAGE.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return ApiResponse.error(res, 400, AUTH_MESSAGE.INVALID_CREDENTIALS);
    }

    const accessToken = jwt.sign(
        { id: user.id, verified: user.verified },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "1h" }
    );

    const options: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .json({
        success: true,
        message: "Logged in",
        accessToken
    });
});

export const signOut = asyncHandler(async (req, res) => {
    const options: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }

    res.status(200)
    .clearCookie("accessToken", options)
    .json({
        success: true,
        message: "Logged out"
    });
});