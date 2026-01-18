import prisma from "../configs/prisma.configs.js";
import { asyncHandler } from "../utils/handler.utils.js";
import { FOLDER_MESSAGE } from "../utils/messages.utils.js";
import { ApiResponse } from "../utils/response.utils.js";

export const createFolder = asyncHandler(async (req, res) => {
    const { folderName, parentFolderId } = req.body;
    const userId = req.user?.id as string;
    
    if (!folderName) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NAME_REQUIRED);
    }

    if (parentFolderId !== undefined && parentFolderId !== null) {
        const parentFolder = await prisma.folder.findUnique({ where: { id: parentFolderId } });
        if (!parentFolder) {
            return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NOT_FOUND);
        }
    }

    const folder = await prisma.folder.findMany({ where: { AND: { name: folderName, parentFolderId: parentFolderId?.trim() || null }} });
    if (folder.length > 0) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_ALREADY_EXISTS);
    }

    const newFolder = await prisma.folder.create({
        data: {
            name: folderName,
            parentFolderId: parentFolderId?.trim() || null,
            userId
        }
    });

    return ApiResponse.success(res, FOLDER_MESSAGE.FOLDER_CREATED, newFolder, 201);
});

export const fetchRootFolders = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string;

    const folders = await prisma.folder.findMany({ where: { AND: { userId, parentFolderId: null } }, orderBy: { name: "asc" } });

    return ApiResponse.success(res, FOLDER_MESSAGE.FOLDERS_FETCHED, folders);
});

export const fetchFolders = asyncHandler(async (req, res) => {
    const parentFolderId = req.params.id as string;

    const parentFolder = await prisma.folder.findUnique({ where: { id: parentFolderId } });
    if (!parentFolder) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NOT_FOUND);
    }

    const folders = await prisma.folder.findMany({ where: { parentFolderId }, orderBy: { name: "asc" } });

    return ApiResponse.success(res, FOLDER_MESSAGE.FOLDERS_FETCHED, folders);
});

export const renameFolder = asyncHandler(async (req, res) => {
    const folderId = req.params.id as string;
    const { newFolderName } = req.body;
    
    if (!newFolderName) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NAME_REQUIRED);
    }

    const folder = await prisma.folder.findUnique({ where: { id: folderId } });
    if (!folder) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NOT_FOUND);
    }

    const existingFolder = await prisma.folder.findMany({ where: { AND: { name: newFolderName, parentFolderId: folder.parentFolderId }} });
    if (existingFolder.length > 0) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_ALREADY_EXISTS);
    }

    const updatedFolder = await prisma.folder.update({
        where: { id: folderId },
        data: { name: newFolderName }
    });

    return ApiResponse.success(res, FOLDER_MESSAGE.FOLDER_RENAMED, updatedFolder);
});

export const deleteFolder = asyncHandler(async (req, res) => {
    const folderId = req.params.id as string;

    if (!folderId) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NOT_FOUND);
    }

    const deleteFolderContent = async (folderId: string) => {
        const subFolders = await prisma.folder.findMany({ where: { parentFolderId: folderId } });

        for (const subFolder of subFolders) {
            await deleteFolderContent(subFolder.id);
        }

        await prisma.folder.delete({ where: { id: folderId } });
    }

    await deleteFolderContent(folderId);

    return ApiResponse.success(res, FOLDER_MESSAGE.FOLDER_DELETED);
});