import {User} from "../Models/user.model.js";
import { cookieOption } from "../Constant/constants.js";

const generateAccessandRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found")
        }
        const accessToken = await user.generateAccessTokens()
        const refreshToken = await user.generateRefreshTokens()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { accessToken, refreshToken }
    }
    catch (error) {
        console.log("Error generating tokens ", error);
    }
}

const registerUser = async (req,res) => {
    const { name, email, password } = req.body

    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new Error("All the fields are required.");
    }

    const existing = await User.findOne({ email });

    if (existing) {
        throw new Error("User already exists.");
    }

    try {
        const user = await User.create({
            name,
            email,
            password
        })

        const newUser = await User.findOne({ email }).select("-password");
        if (!newUser) {
            throw new Error("User not found")
        }
        
        console.log(newUser._id)
        const {accessToken} = await generateAccessandRefreshTokens(newUser._id)
        
        res.status(201)
            .cookie("accesstoken", accessToken, cookieOption)
            .json({ success: true, message: "User created successfully",newUser})

    }
    catch (error) {
        console.log("Error creating user ", error);
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === "")) {
        throw new Error("All the fields are required.");
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        
        if(user.isPasswordCorrect(password)){
            const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id)
            const userInfo = await User.findOne({ email }).select("-password");
            res.status(201)
            .cookie("accesstoken", accessToken, cookieOption)
            .cookie("refreshtoken", refreshToken, cookieOption)
            .json({ success: true, message: "User logged in successfully",userInfo })
        }
    }
    catch(error){
        console.log(error)
        throw new Error(error)
    }
}

const logOutUser = async (req, res) => {
    try{await User.findByIdAndUpdate(req.user._id,
        {
            $set: { refreshToken: null }
        },
        {
            new: true
        }
    )
    res
        .clearCookie("accesstoken", cookieOption)
        .clearCookie("refreshtoken", cookieOption)
        .json({ success: true, message: "User logged out successfully" })

    }
    catch(error){
        console.log(error)
        throw new Error(error)
    }
}

const searchUser = async (req, res) => {
    const {name} = req.body;

    if (name.trim() === "") {
        throw new Error("All the fields are required.");
    }

    try {
        const user = await User.findOne({ name });
        if (!user) {
            throw new Error("User not found");
        }
        res.status(201)
            .json({ success: true, message: "User found successfully",user})
    }
    catch (error) {
        console.log("Error creating user ", error);
    }

}

export {
    generateAccessandRefreshTokens,
    registerUser,
    loginUser,
    logOutUser,
    searchUser
}