import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { createFolder, deleteFolder, fetchFolders, fetchRootFolders, renameFolder } from "../controllers/folder.controllers.js";
import { validate } from "../middlewares/zod.middlewares.js";
import { createFolderSchema } from "../utils/zod.utils.js";

const router = Router();

// create folder
router.post(`/`, verifyToken, validate(createFolderSchema), createFolder);

// fetch root folders
router.get(`/`, verifyToken, fetchRootFolders);

// fetch folders
router.get(`/:id`, verifyToken, fetchFolders);

// rename folder
router.patch(`/:id`, verifyToken, validate(createFolderSchema), renameFolder);

// delete folder
router.delete(`/:id`, verifyToken, deleteFolder);

export default router;