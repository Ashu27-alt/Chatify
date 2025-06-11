import { User } from "../Models/user.model.js";
import { cookieOption } from "../Constant/constants.js";
import { uploadOnCloudinary, delFromCloudinary } from "../clodinary.js";

const generateAccessandRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found")
        }
        const accessToken = await user.generateAccessTokens()
        const refreshToken = await user.generateRefreshTokens()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    }
    catch (error) {
        console.log("Error generating tokens ", error);
    }
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new Error("All the fields are required.");
    }

    const existing = await User.findOne({ email });

    if (existing) {
        throw new Error("User already exists.");
    }

    let file;
    let profilePicture;
    let profilePictureUrl;

    if (req.file) {
        file = req.file.path;
        try {
            profilePicture = await uploadOnCloudinary(file);
            profilePictureUrl = profilePicture.url;
        } catch (error) {
            console.log("Error uploading file to cloudinary: ", error);
        }
    }

    else {
        profilePictureUrl = "https://res.cloudinary.com/dg9jziji5/image/upload/f_auto,q_auto/pgwu3ff4bacngagwzu8n";
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
            profilePicture: profilePictureUrl
        })

        const newUser = await User.findOne({ email }).select("-password");
        if (!newUser) {
            throw new Error("User not found")
        }

        console.log(newUser._id)
        const { accessToken } = await generateAccessandRefreshTokens(newUser._id)

        res.status(201)
            .cookie("accesstoken", accessToken, cookieOption)
            .json({ success: true, message: "User created successfully", newUser })

    }
    catch (error) {
        console.log("Error creating user ", error);
        if(profilePicture){
            await delFromCloudinary(profilePicture.public_id)
        }
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

        if (user.isPasswordCorrect(password)) {
            const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id)
            const userInfo = await User.findOne({ email }).select("-password");
            res.status(201)
                .cookie("accesstoken", accessToken, cookieOption)
                .cookie("refreshtoken", refreshToken, cookieOption)
                .json({ success: true, message: "User logged in successfully", userInfo })
        }
    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

const logOutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id,
            {
                $set: { refreshToken: null }
            },
            {
                new: true
            }
        )
        res
            .clearCookie("accessToken", cookieOption)
            .json({ success: true, message: "User logged out successfully" })

    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

const searchUser = async (req, res) => {
    const { q } = req.query;
    const currentUserId = req.user._id;

    if(!q){
        return null;
    }
    try {
       const data = await User.find({ name: { $regex: q, $options: "i" } })
       const users = data.filter((user) => user._id.toString() !== currentUserId.toString());
        res.status(201).json({ success: true, message: "Users found successfully", users })
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