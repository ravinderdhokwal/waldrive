import { UserService } from "../services/user.services.js";
import { asyncHandler } from "../utils/handler.utils.js";
import { AUTH_MESSAGE, USER_MESSAGE } from "../utils/messages.utils.js";
import { ApiResponse } from "../utils/response.utils.js";

export const fetchUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string;

    const user = await UserService.findUserById(userId);
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

    const user = await UserService.findUserById(userId);
    if (!user) {
        return ApiResponse.error(res, 404, AUTH_MESSAGE.USER_NOT_FOUND);
    }

    await UserService.updateUserProfile(userId, name);

    return ApiResponse.success(res, USER_MESSAGE.USER_PROFILE_UPDATED);
});

export const fetchStorageInfo = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string;

    const user = await UserService.findUserById(userId);
    if (!user) {
        return ApiResponse.error(res, 404, AUTH_MESSAGE.USER_NOT_FOUND);
    }

    return ApiResponse.success(res, USER_MESSAGE.STORAGE_INFO_FETCHED, {
        usedStorage: user.usedStorage,
        totalStorage: user.totalStorage,
    });
});