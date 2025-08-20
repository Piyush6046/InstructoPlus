import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "educator"],
    default: "student",
    required: true,
  },
  photoUrl:{
    type: String,
    default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  resetOtp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  isOtpVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model("User", userSchema);
