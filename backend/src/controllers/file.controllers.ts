import fs from "fs";
import prisma from "../configs/prisma.configs.js";
import { asyncHandler } from "../utils/handler.utils.js";
import { AUTH_MESSAGE, FILE_MESSAGE, FOLDER_MESSAGE } from "../utils/messages.utils.js";
import { ApiResponse } from "../utils/response.utils.js";
import { deleteFileFromR2, downloadFileFromR2, uploadFileToR2 } from "../services/r2.services.js";


export const uploadFile = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string;
    const parentFolderId = req.body?.parentFolderId;

    const file = req.file;
    if (!file) {
        return ApiResponse.error(res, 400, FILE_MESSAGE.FILE_NOT_FOUND);
    }
    
    if (parentFolderId !== undefined) {
        const parentFolder = await prisma.folder.findUnique({ where: { id: parentFolderId } });
        if (!parentFolder) {
            fs.unlinkSync(file.path);
            return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NOT_FOUND);
        }
    }
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        fs.unlinkSync(file.path);
        return ApiResponse.error(res, 404, AUTH_MESSAGE.USER_NOT_FOUND);
    }
    
    const availableStorage = user?.totalStorage - user?.usedStorage;
    if (file.size > availableStorage) {
        fs.unlinkSync(file.path);
        return ApiResponse.error(res, 400, FILE_MESSAGE.INSUFFICIENT_STORAGE);
    }

    const key = `users/${userId}/${Date.now()}-${file.originalname}`;
    const body = fs.readFileSync(file.path);
    const contentType = file.mimetype;

    await uploadFileToR2({key, body, contentType});

    await prisma.user.update({
        where: { id: userId },
        data: { usedStorage: { increment: file.size } }
    });

    const fileInDB = await prisma.file.create({
        data: {
            name: file.originalname,
            size: file.size,
            key,
            mimeType: file.mimetype,
            parentFolderId: parentFolderId?.trim() || null,
            userId
        }
    });

    fs.unlinkSync(file.path);
    return ApiResponse.success(res, FILE_MESSAGE.FILE_UPLOADED, fileInDB, 201);
});

export const fetchRootFiles = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string;

    const files = await prisma.file.findMany({ where: { AND: { userId, parentFolderId: null } }, orderBy: { name: "asc" } });
    
    return ApiResponse.success(res, FILE_MESSAGE.FILES_FETCHED, files);
});

export const fetchFiles = asyncHandler(async (req, res) => {
    const parentFolderId = req.params?.parentFolderId as string;

    const parentFolder = await prisma.folder.findUnique({ where: { id: parentFolderId } });
    if (!parentFolder) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NOT_FOUND);
    }

    const files = await prisma.file.findMany({ where: { parentFolderId }, orderBy: { name: "asc" } });
    if (files.length === 0) {
        return ApiResponse.success(res, FILE_MESSAGE.NO_FILES_FOUND);
    }

    return ApiResponse.success(res, FILE_MESSAGE.FILES_FETCHED, files);
});

export const streamFile = asyncHandler(async (req, res) => {
    const id = req.params?.id as string;

    if (!id) {
        return ApiResponse.error(res, 400, FILE_MESSAGE.FILE_NOT_FOUND);
    }

    const file = await prisma.file.findUnique({ where: { id }});
    if (!file) {
        return ApiResponse.error(res, 404, FILE_MESSAGE.FILE_NOT_FOUND);
    }

    const fileStream = await downloadFileFromR2(file.key);
    if (!fileStream) {
        return ApiResponse.error(res, 500, FILE_MESSAGE.FILE_DOWNLOAD_ERROR);
    }

    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
    res.setHeader("Content-Type", file.mimeType);

    (fileStream as NodeJS.ReadableStream).pipe(res);
});

export const renameFile = asyncHandler(async (req, res) => {
    const id = req.params?.id as string;
    const newName = req.body?.name as string;

    if (!id) {
        return ApiResponse.error(res, 400, FILE_MESSAGE.FILE_NOT_FOUND);
    }

    const file = await prisma.file.findUnique({ where: { id }});
    if (!file) {
        return ApiResponse.error(res, 404, FILE_MESSAGE.FILE_NOT_FOUND);
    }

    const updatedFile = await prisma.file.update({
        where: { id },
        data: { name: newName }
    });

    return ApiResponse.success(res, FILE_MESSAGE.FILE_RENAMED, updatedFile);
});

export const deleteFile = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string;
    const id = req.params?.id as string;

    if (!id) {
        return ApiResponse.error(res, 400, FILE_MESSAGE.FILE_NOT_FOUND);
    }

    const file = await prisma.file.findUnique({ where: { id }});
    if (!file) {
        return ApiResponse.error(res, 404, FILE_MESSAGE.FILE_NOT_FOUND);
    }

    await deleteFileFromR2(file.key);

    await prisma.user.update({
        where: { id: userId },
        data: { usedStorage: { decrement: file.size } }
    });

    await prisma.file.delete({ where: { id }});

    return ApiResponse.success(res, FILE_MESSAGE.FILE_DELETED);
});