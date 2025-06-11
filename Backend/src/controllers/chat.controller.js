import { Chat } from "../Models/chat.model.js";
import { User } from "../Models/user.model.js";

const createChat = async (req, res) => {
    const { name } = req.body;

    try {
        const user2 = await User.findOne({ name });
        if (!user2) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const existingChat = await Chat.findOne({
            "users._id": { $all: [req.user._id, user2._id] },
            users: { $size: 2 }
        });

        if (existingChat) {
            return res.status(200).json({ success: true, message: "Chat already exists", chat: existingChat });
        }

        const chat = await Chat.create({ users: [req.user, user2] });
        res.status(201).json({ success: true, message: "Chat created successfully", chat });

    } catch (error) {
        console.error("Error creating chat", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteChat = async (req, res) => {
    const { chatId } = req.body;

    try {
        await Chat.findByIdAndDelete(chatId);
        res.status(201).json({ success: true, message: "Chat deleted successfully" });
    } catch (error) {
        console.log("Error deleting chat ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find({ "users._id": req.user._id });
        res.status(201).json({ success: true, message: "Chats found successfully", chats });
    } catch (error) {
        console.log("Error getting chats ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getSingleChat = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.status(200).json({ success: true, chat });
    } catch (error) {
        console.error("Error getting chat:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { createChat, deleteChat, getAllChats, getSingleChat };
