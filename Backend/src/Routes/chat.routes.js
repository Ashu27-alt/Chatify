import { createChat, deleteChat,getAllChats} from "../controllers/chat.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/aut.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/createChat").post(createChat)
router.route('/deletechat').delete(deleteChat)
router.route('/').get(getAllChats)

export default router