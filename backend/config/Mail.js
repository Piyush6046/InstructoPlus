import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const sendMail = async (to, otp) => {
    try {
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: to,
            subject: "Reset Your Password",
            html: `<p>Your OTP for Password Reset is <b>${otp}</b>.
            It expires in 5 minutes.</p>`
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        return result;
    } catch (error) {
        console.error("Email sending error:", error.message);
        throw new Error("Failed to send email");
    }
}

export default sendMail