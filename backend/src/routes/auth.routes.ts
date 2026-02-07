import { Router } from "express";
import { refreshToken, signIn, signOut, signUp, verifyTokenHandler } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = Router();

// signup 
router.post("/signup", signUp);

// signin
router.post("/signin", signIn);

// verify token
router.get("/verify-token", verifyToken, verifyTokenHandler);

// refresh token
router.post("/refresh-token", verifyToken, refreshToken);

// signout
router.post("/signout", verifyToken, signOut);

export default router;