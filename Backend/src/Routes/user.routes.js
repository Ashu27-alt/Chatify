import { registerUser, loginUser, logOutUser, toggleTheme,getCurrentUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/aut.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(
    upload.single("photo")
    , registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post( verifyJWT,logOutUser);
router.route("/toggleTheme").post(verifyJWT, toggleTheme);
router.route("/currentuser").get(verifyJWT, getCurrentUser);


export default router