import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "../configs/r2.configs.js";

interface UploadFileParams {
    key: string;
    body: Buffer;
    contentType: string;
}

export const uploadFileToR2 = async ({ key, body, contentType }: UploadFileParams) => {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentType: contentType
        });

        await r2Client.send(command);

        return { key };
    } catch (error) {
        console.log("!!! ERROR IN FILE UPLOAD !!!");
        console.error(error);
    }
}

export const downloadFileFromR2 = async (key: string) => {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key
        });

        const response = await r2Client.send(command);

        return response.Body;
    } catch (error) {
        console.log("!!! ERROR IN FILE DOWNLOAD !!!");
        console.error(error);
    }
}

export const deleteFileFromR2 = async (key: string) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key
        });

        await r2Client.send(command);
    } catch (error) {
        console.log("!!! ERROR IN FILE DELETION !!!");
        console.error(error);
    }
}