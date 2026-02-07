import { Router } from "express";
import { refreshToken, signIn, signOut, signUp, verifyTokenHandler } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/zod.middlewares.js";
import { signinSchema, signupSchema } from "../utils/zod.utils.js";

const router = Router();

// signup 
router.post("/signup", validate(signupSchema), signUp);

// signin
router.post("/signin", validate(signinSchema), signIn);

// verify token
router.get("/verify-token", verifyToken, verifyTokenHandler);

// refresh token
router.post("/refresh-token", verifyToken, refreshToken);

// signout
router.post("/signout", verifyToken, signOut);

export default router;