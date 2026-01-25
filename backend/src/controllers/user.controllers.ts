import prisma from "../configs/prisma.configs.js";
import { asyncHandler } from "../utils/handler.utils.js";
import { AUTH_MESSAGE, USER_MESSAGE } from "../utils/messages.utils.js";
import { ApiResponse } from "../utils/response.utils.js";

export const fetchUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return ApiResponse.error(res, 404, AUTH_MESSAGE.USER_NOT_FOUND);
    }

    return ApiResponse.success(res, USER_MESSAGE.USER_PROFILE_FETCHED, {
        name: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
    });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string;
    const { name } = req.body;

    if (!name) {
        return ApiResponse.error(res, 400, USER_MESSAGE.NAME_REQUIRED);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return ApiResponse.error(res, 404, AUTH_MESSAGE.USER_NOT_FOUND);
    }

    await prisma.user.update({
        where: { id: userId },
        data: { fullName: name },
    });

    return ApiResponse.success(res, USER_MESSAGE.USER_PROFILE_UPDATED);
});

export const fetchStorageInfo = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return ApiResponse.error(res, 404, AUTH_MESSAGE.USER_NOT_FOUND);
    }

    return ApiResponse.success(res, USER_MESSAGE.STORAGE_INFO_FETCHED, {
        usedStorage: user.usedStorage,
        totalStorage: user.totalStorage,
    });
});