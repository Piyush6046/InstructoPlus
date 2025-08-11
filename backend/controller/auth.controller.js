import User from '../model/user.Model.js'
import validator from "validator"
import genToken from "../config/token.js"
import cookieParser from 'cookie-parser'
import bcrypt from "bcryptjs"
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 5 characters long",
      });
    }
    let hashPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while signing up",
    });
    console.log(error);
  }
};

export const login=async(req,res)=>{
  try {
    const {email,password}=req.body
    let user=await User.findOne({email})
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      })
    }
    let isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(400).json({
        success:false,
        message:"Invalid credentials"
      })
    }
    let token=await genToken(user._id);
    res.status(200).json({
      success:true,
      message:"User logged in successfully",
      user,
      token
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"error while login",
      error
    })
  }
}

export const logout=async(req,res)=>{
  try {
    await res.clearCookie("token")
    res.status(200).json({
      success:true,
      message:"User logged out successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"error while logout",
    })
  }
}