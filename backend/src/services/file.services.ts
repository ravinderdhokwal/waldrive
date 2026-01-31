import prisma from "../configs/prisma.configs.js";
import type { File } from "../generated/prisma/client.js";

export class FileService {

    static async createFile( fileName: string, fileSize: number, fileKey: string, mimeType: string, parentFolderId: string | null, userId: string): Promise<File> {
        const createdFile = await prisma.file.create({
            data: {
                name: fileName,
                size: fileSize,
                key: fileKey,
                mimeType,
                parentFolderId: parentFolderId?.trim() || null,
                userId
            }
        });

        return createdFile;
    }

    static async findFileById(id: string): Promise<File | null> {
        return await prisma.file.findUnique({ where: { id } });
    }

    static async fetchRootFiles(userId: string): Promise<File[]> {
        return await prisma.file.findMany({ where: { AND: { userId, parentFolderId: null } }, orderBy: { name: "asc" } });
    }

    static async fetchChildFiles(parentFolderId: string): Promise<File[]> {
        return await prisma.file.findMany({ where:  { parentFolderId }, orderBy: { name: "asc" } });
    }

    static async renameFile(fileId: string, newFileName: string): Promise<File> {
        return await prisma.file.update({
            where: { id: fileId },
            data: { name: newFileName }
        });
    }

    static async deleteFile(fileId: string): Promise<File> {
        return await prisma.file.delete({ where: { id: fileId } });
    }

    static async searchForDuplicateFiles(fileName: string, parentFolderId: string | null, userId: string): Promise<File | null> {
        return await prisma.file.findFirst({
            where: {
                AND: {
                    name: fileName,
                    parentFolderId,
                    userId
                }
            }
        });
    }
}