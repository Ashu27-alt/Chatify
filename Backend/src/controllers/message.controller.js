import { io, getReceiverSocketId } from "../app.js";
import { Message } from "../Models/message.model.js";

const sendMessage = async (req, res) => {
    const { content } = req.body;
    const { chatId } = req.params;

    try {
        const message = await Message.create({ content, chat: chatId, sender: req.user._id });

        const fullMessage = await message.populate([
            { path: "sender", select: "name _id" },
            {
                path: "chat",
                populate: {
                    path: "users",
                    select: "_id name"
                }
            }
        ]);

        fullMessage.chat.users.forEach((user) => {
            if (user._id.toString() !== req.user._id.toString()) {
                const receiverSocketId = getReceiverSocketId(user._id.toString());
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newmessage", fullMessage);
                }
            }
        });

        res.status(201).json({ success: true, message: "Message sent successfully", message: fullMessage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to send message", error: error.message });
    }
};

const getAllChatMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const messages = await Message.find({ chat: chatId })
            .sort({ createdAt: 1 })
            .populate("sender", "name _id");

        res.status(200).json({ success: true, message: "Messages retrieved", messages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to retrieve messages", error: error.message });
    }
};

export {
    sendMessage,
    getAllChatMessages
};
