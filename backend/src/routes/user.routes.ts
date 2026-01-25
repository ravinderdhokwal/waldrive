import { Router } from "express";
import { fetchStorageInfo, fetchUserProfile, updateUserProfile } from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = Router();

// fetch user profile
router.get(`/profile`, verifyToken, fetchUserProfile);

// update user profile 
router.put(`/profile`, verifyToken, updateUserProfile);

// fetch storage info
router.get(`/storage-info`, verifyToken, fetchStorageInfo);

export default router;