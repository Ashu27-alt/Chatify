import { registerUser, loginUser, logOutUser, searchUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/aut.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(
    upload.single("photo")
    , registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post( verifyJWT, logOutUser);


export default router