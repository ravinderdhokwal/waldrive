import { Router } from "express"
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { deleteFile, fetchFiles, fetchRootFiles, renameFile, streamFile, uploadFile } from "../controllers/file.controllers.js";

const router = Router();

// upload file
router.post(`/`, verifyToken, upload.single("file"), uploadFile);

// fetch root files
router.get(`/`, verifyToken, fetchRootFiles);

// fetch files
router.get(`/:parentFolderId`, verifyToken, fetchFiles);

// stream file
router.get(`/stream/:id`, verifyToken, streamFile);

// rename file
router.patch(`/:id`, verifyToken, upload.none(), renameFile);

// delete file
router.delete(`/:id`, verifyToken, deleteFile);

export default router;