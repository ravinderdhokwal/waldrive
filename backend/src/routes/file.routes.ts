import { Router } from "express"
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middelwares.js";
import { deleteFile, fetchFiles, fetchRootFiles, renameFile, uploadFile } from "../controllers/file.controllers.js";

const router = Router();

// upload file
router.post(`/`, verifyToken, upload.single("file"), uploadFile);

// fetch root files
router.get(`/`, verifyToken, fetchRootFiles);

// fetch files
router.get(`/:parentFolderId`, verifyToken, fetchFiles);

// rename file
router.patch(`/:id`, verifyToken, upload.none(), renameFile);

// delete file
router.delete(`/:id`, verifyToken, deleteFile);

export default router;