import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = Router();

// signup 
router.post("/signup", signUp);

// signin
router.post("/signin", signIn);

// signout
router.post("/signout", verifyToken, signOut);

export default router;