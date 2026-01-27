import prisma from "../configs/prisma.configs.js";
import { FolderService } from "../services/folder.services.js";
import { asyncHandler } from "../utils/handler.utils.js";
import { FOLDER_MESSAGE } from "../utils/messages.utils.js";
import { ApiResponse } from "../utils/response.utils.js";

export const createFolder = asyncHandler(async (req, res) => {
    const folderName = req.body?.folderName as string;
    const parentFolderId = req.body?.parentFolderId as string | null;
    const userId = req.user?.id as string;
    
    if (!folderName) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NAME_REQUIRED);
    }

    if (parentFolderId) {
        const parentFolder = await FolderService.findFolderById(parentFolderId);
        if (!parentFolder) {
            return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NOT_FOUND);
        }
    }

    const folder = await FolderService.findFoldersByNameAndParent(folderName, parentFolderId);
    if (folder.length > 0) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_ALREADY_EXISTS);
    }

    const newFolder = await FolderService.createFolder(folderName, parentFolderId, userId);

    return ApiResponse.success(res, FOLDER_MESSAGE.FOLDER_CREATED, newFolder, 201);
});

export const fetchRootFolders = asyncHandler(async (req, res) => {
    const userId = req.user?.id as string;

    const folders = await FolderService.fetchRootFolders(userId);

    return ApiResponse.success(res, FOLDER_MESSAGE.FOLDERS_FETCHED, folders);
});

export const fetchFolders = asyncHandler(async (req, res) => {
    const parentFolderId = req.params.id as string;

    const parentFolder = await FolderService.findFolderById(parentFolderId);
    if (!parentFolder) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NOT_FOUND);
    }

    const folders = await FolderService.fetchFoldersByParentFolderId(parentFolderId);

    return ApiResponse.success(res, FOLDER_MESSAGE.FOLDERS_FETCHED, folders);
});

export const renameFolder = asyncHandler(async (req, res) => {
    const folderId = req.params.id as string;
    const { newFolderName } = req.body;
    
    if (!newFolderName) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NAME_REQUIRED);
    }

    const folder = await FolderService.findFolderById(folderId);
    if (!folder) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NOT_FOUND);
    }

    const existingFolder = await FolderService.findFoldersByNameAndParent(newFolderName, folder.parentFolderId);
    if (existingFolder.length > 0) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_ALREADY_EXISTS);
    }

    const renamedFolder = await FolderService.renameFolder(folderId, newFolderName);

    return ApiResponse.success(res, FOLDER_MESSAGE.FOLDER_RENAMED, renamedFolder);
});

export const deleteFolder = asyncHandler(async (req, res) => {
    const folderId = req.params.id as string;

    if (!folderId) {
        return ApiResponse.error(res, 400, FOLDER_MESSAGE.FOLDER_NOT_FOUND);
    }

    const deleteFolderContent = async (folderId: string) => {
        const subFolders = await FolderService.fetchFoldersByParentFolderId(folderId);

        for (const subFolder of subFolders) {
            await deleteFolderContent(subFolder.id);
        }

        await FolderService.deleteFolder(folderId);
    }

    await deleteFolderContent(folderId);

    return ApiResponse.success(res, FOLDER_MESSAGE.FOLDER_DELETED);
});