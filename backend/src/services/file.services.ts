import prisma from "../configs/prisma.configs.js";
import type { File } from "../generated/prisma/client.js";

export class FileService {

    static async createFile(
        fileName: string,
        fileSize: number,
        fileKey: string,
        mimeType: string,
        parentFolderId: string | null,
        userId: string
    ): Promise<File> {
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
}