import { registerUser, loginUser, logOutUser,searchUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/aut.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logOutUser);
router.route("/searchUser").post(verifyJWT,searchUser);


export default router