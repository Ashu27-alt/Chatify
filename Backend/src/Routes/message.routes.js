import Router from "express";
import {verifyJWT} from "../middleware/aut.middleware.js"
import { sendMessage,getAllChatMessages } from "../controllers/message.controller.js";

const router = Router();

router.use(verifyJWT)

router.route('/:chatId').post(sendMessage)
router.route('/:chatId').get(getAllChatMessages)
export default router