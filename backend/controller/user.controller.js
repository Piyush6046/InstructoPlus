import User from "../model/user.Model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password").populate("enrolledCourses");
    res.status(200).json({
      success: true,
      user,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while getting user",
      error,
    });
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { description, name } = req.body;
    let photoUrl;
    if (req.file) {
      const uploadedPhoto = await uploadOnCloudinary(req.file.path);
      if (uploadedPhoto && uploadedPhoto.url) {
        photoUrl = uploadedPhoto.url;
      }
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { description, name, photoUrl },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while updating profile",
      error,
    });
  }
};
