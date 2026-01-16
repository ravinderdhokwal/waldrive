import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { createFolder, deleteFolder, fetchFolders, renameFolder } from "../controllers/folder.controllers.js";

const router = Router();

// create folder
router.post(`/`, verifyToken, createFolder);

// fetch folders
router.get(`/`, verifyToken, fetchFolders);

// rename folder
router.patch(`/`, verifyToken, renameFolder);

// delete folder
router.delete(`/`, verifyToken, deleteFolder);

export default router;