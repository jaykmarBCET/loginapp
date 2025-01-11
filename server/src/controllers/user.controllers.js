import { asyncHandler } from '../util/asyncHandler.js';
import { ApiError } from '../util/ApiError.js';
import { ApiResponse } from '../util/ApiResponse.js';
import { uploadOnCloudinary } from '../util/cloudinary.js';
import { User } from '../model/user.model.js';
import jwt from 'jsonwebtoken'
import  bcrypt from 'bcrypt'


const generateAcceAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).json(ApiResponse(404, {},"User not found"))
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};

const register = asyncHandler(async (req, res) => {
    const { name, email, username, password } = req.body;
    if ([name, email, username, password].some(field => typeof field !== 'string' || field.trim() === '')) {
        return res.status(400).
        json(new ApiResponse(400,{message:"All field are required"}, 'Please fill all fields'))
        
    }
   
    const existeUser = await User.findOne({ $or: [{ username }, { email }] });
    
    if (existeUser) {
        return res.status(400).json( new ApiResponse(400,{message:"User already exists"}, 'User already exists'))
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        return res.status(400).json( new ApiResponse(400,{message:"Please  upload an avatar"}, 'Please upload an avatar'))

    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;
    if (!avatar?.url) {
        return res.status(400).json( new ApiResponse(400,{message:"avatar upload failed"}, 'Avatar upload failed'))
    }
    const user = await User.create({
        name,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password,
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        return res.status(400).json(new ApiResponse(400,{massage:"Something went wrong while registering user"}, 'Something went wrong while registering user'))
    }
    return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));
});

const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    
    if (!password && (!email || !username)) {
        return res.status(401).json(ApiResponse(400, 'Please fill in email or username and password fields'))
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
        return res.status(401).json(ApiResponse(400,{}, 'User not found'))
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json(ApiResponse(400,{}, 'Password is incorrect'))
    }
    const options = {
        httpOnly: true,
        secure: true,
    };
    const { accessToken, refreshToken } = await generateAcceAndRefreshToken(user._id);
    const userfind = await User.findById(user._id).select("-password -refreshToken");
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, userfind, "User logged in successfully"));
});

const logout = asyncHandler(async(req,res)=>{
   const option = {
        httpOnly: true,
        secure: true,
    }
    return res
    .status(200)
    .clearCookie("accessToken" ,option)
    .clearCookie("refreshToken",option)
    .json(new ApiResponse(200,{},"User logout  successfully"))
})

const currentUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req?.user._id).select("-password -refreshToken")
    if(!user){
        return res.status(401).json(ApiResponse(404,{},"User not found"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,user,"current user"))
})
const refreshAndAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    
    if (!incomingRefreshToken) {
        return res.status(401).json(ApiResponse(401,{}, "Unauthorized request"))
    }

    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    if (!decoded) {
        return res.status(401).json(ApiResponse(401,{}, "Unauthorized request"))
    }

    const user = await User.findById(decoded._id);
    if (!user) {
        return res.status(401).json(ApiResponse(404,{}, "User not found"))
    }

    if (incomingRefreshToken !== user.refreshToken) {
        return res.status(401).json(ApiResponse(401,{}, "Refresh Token expired"))
    }

    const { accessToken, refreshToken } = await generateAcceAndRefreshToken(user._id);
    if (!accessToken || !refreshToken) {
        return res.status(401).json(ApiResponse(500,{},"Error generating tokens"))
    }

    await User.findByIdAndUpdate(
        user._id,
        {
            $set: { refreshToken: refreshToken }
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ accessToken, refreshToken });
});

const changeNameAndEmail = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(401).json(ApiResponse(400,{}, "Both name and email are required."))
    }

    if (!req?.user) {
        return res.status(401).json(ApiResponse(404,{}, "User not found."))
    }

    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $set: {
                name: name,
                email: email
            }
        },
        { new: true } 
    ).select("-password -refreshToken");

    if (!user) {
        return res.status(401).json(ApiResponse(500,{}, "Error while updating your name and email."))
    }

    return res.status(200).json(new ApiResponse(200, user, "Your name and email were successfully updated."));
});

const changeName = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name } = req.body; // Corrected from req.param to req.body

    if (!name) {
        return res.status(400).json(new ApiResponse(400, {}, "Name is a required field"));
    }
    if (!req?.user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name: name },
        {
            new: true,
            select: "-password -refreshToken"
        }
    );

    if (!user) {
        return res.status(500).json(new ApiResponse(500, {}, "Error updating your name"));
    }

    return res.status(200).json(new ApiResponse(200, user, "Your name has been updated"));
});


const changeAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    console.log(req.file);

    if (!avatarLocalPath) {
        return res.status(400).json(new ApiResponse(400, {}, "Avatar image is required"));
    }
    if (!req?.user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    let avatar;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath);
    } catch (error) {
        return res.status(502).json(new ApiResponse(502, {}, "Error uploading avatar to Cloudinary"));
    }

    if (!avatar) {
        return res.status(500).json(new ApiResponse(500, {}, "Failed to upload avatar to Cloudinary"));
    }

    const user = await User.findByIdAndUpdate(
        req?.user._id,
        {
            avatar: avatar.url
        },
        {
            new: true,
            select: "-password -refreshToken"
        }
    );

    if (!user) {
        return res.status(400).json(new ApiResponse(400, {}, "Failed to update avatar image"));
    }

    return res.status(200).json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const changeCoverImage = asyncHandler(async (req, res) => {
     const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        return res.status(400).json(new ApiResponse(400, {}, "Cover image is required"));
    }
    if (!req?.user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    let coverImage;
    try {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    } catch (error) {
        return res.status(502).json(new ApiResponse(502, {}, "Error uploading image to Cloudinary"));
    }

    if (!coverImage) {
        return res.status(500).json(new ApiResponse(500, {}, "Failed to upload cover image to Cloudinary"));
    }

    const user = await User.findByIdAndUpdate(
        req?.user._id,
        {
            coverImage: coverImage.url
        },
        {
            new: true,
            select: "-password -refreshToken"
        }
    );

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    return res.status(200).json(new ApiResponse(200, user, "Cover image changed successfully"));
});

const isValidUserName = asyncHandler(async (req, res) => {
    const { username } = req.body;
   

    try {
        const user = await User.findOne({ username });
        
        

        if (user) {
            return res.status(201).json(new ApiResponse(201, { isValid: false }, "Username is already taken"));
        }

        return res.status(200).json(new ApiResponse(200, { isValid: true }, "Username is available"));
    } catch (error) {
        console.error("Error checking username:", error);
        return res.status(500).json(new ApiResponse(500, { isValid: false }, "Internal Server Error"));
    }
});

export { 
    register,
     login,
     logout ,
     currentUser,
     refreshAndAccessToken,
     changeNameAndEmail,
     changeName,
     changeAvatar,
     changeCoverImage,
     isValidUserName
    };
