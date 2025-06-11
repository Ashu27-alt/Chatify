import { createChat, deleteChat,getAllChats,getSingleChat} from "../controllers/chat.controller.js";
import { searchUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/aut.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/createChat").post(createChat)
router.route('/deletechat').delete(deleteChat)
router.route('/search').get(searchUser)
router.route("/:chatId").get(getSingleChat);
router.route('/').get(getAllChats)

export default router