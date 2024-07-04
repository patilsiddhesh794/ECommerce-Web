import otpGenerator from 'otp-generator'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

export const getOtp = () => {
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    return otp;
}

export const sendOTP = async (otp, email, sub, pur) => {
    try {
        const mailConfigurations = {
            from: process.env.EMAIL,
            to: email,
            subject: sub,
            html: `OTP For ${pur}: ${otp}. Don't Share With Anyone.`
        };
        await transporter.sendMail(mailConfigurations, function (error, info) {
            if (error) throw Error(error);
            console.log('Email Sent Successfully');
        });
    } catch (error) {
        console.log(error);
    }
}
