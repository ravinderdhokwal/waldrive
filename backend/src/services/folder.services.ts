import prisma from "../configs/prisma.configs.js"

export class FolderService {

    static async createFolder(folderName: string, parentFolderId: string | null, userId: string) {
        return await prisma.folder.create({
            data: {
                name: folderName,
                parentFolderId,
                userId
            }
        });
    }

    static async findFolderById(id: string) {
        return await prisma.folder.findUnique({ where: { id } });
    }

    static async fetchRootFolders(userId: string) {
        return await prisma.folder.findMany({ where: { AND: { userId, parentFolderId: null } }, orderBy: { name: "asc" } });
    }

    static async fetchChildFolders(parentFolderId: string) {
        return await prisma.folder.findMany({ where: { parentFolderId }, orderBy: { name: "asc" } });
    }

    static async renameFolder(folderId: string, newFolderName: string) {
        return await prisma.folder.update({
            where: { id: folderId },
            data: { name: newFolderName }
        });
    }

    static async deleteFolder(folderId: string) {
        return await prisma.folder.delete({ where: { id: folderId } });
    }

    static async searchForDuplicateFolder(folderName: string, parentFolderId: string | null, userId: string) {
        return await prisma.folder.findFirst({
            where: {
                AND: {
                    name: folderName,
                    parentFolderId,
                    userId
                }
            }
        });
    }
}