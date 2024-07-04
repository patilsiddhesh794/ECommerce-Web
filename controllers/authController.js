import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import { getOtp, sendOTP } from "../utils/OTPService.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'


//REgISter otp send
export const regOtpController = async(req, res)=>{
    try {
        const {name, email, phone, password, address} = req.body;
        if(!name || !email || !phone || !password || !address){
            return res.send({message: 'All Fiels Are Mandatory'});
        }

        const otp = getOtp();
        const hashedOTP = await bcrypt.hash(otp.toString(), 10);
        const sub = 'Verify Email';
        const pur = 'Email Verification';
        await sendOTP(otp,email,sub, pur)

        return res.status(200).send({
            success: true,
            message: "OTP Sent Successfully",
            hashedOTP
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Error In Reg OTP API'
        })
    }
}

//REGISTER Controller
export const registerController = async(req, res)=>{
    try {
        const {name, email, phone, password, address} = req.body;
        //validation
        if(!name){
            return res.send({error: 'Name is Required'});
        }
        if(!email){
            return res.send({error: 'Email is Required'});
        }
        if(!phone){
            return res.send({error: 'Phone is Required'});
        }
        if(!password){
            return res.send({error: 'Password is Required'});
        }
        if(!address){
            return res.send({error: 'Address is Required'});
        }

        const existingUser = await userModel.findOne({email});
        //Existing user
        if(existingUser){
            return res.status(200).send({
                success: true,
                message: 'User already Exist. Please Login!'
            })
        }

        //Register user
        const hashedPassword = await hashPassword(password)
        //Save user
        const user = await new userModel({name, email, phone, password:hashedPassword, address}).save();

        return res.status(201).send({
            success:true,
            message: 'User registered successfully!',
            user
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        })
    }
}

//LOGIN Controller
export const loginController = async(req,res)=>{
    try {
        const {email, password} = req.body;
        const localCart = req.body.localCart || [];
        //Validation
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: 'Invalid Email or Password'
            })
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'User Does Not Exist'
            })
        }
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(401).send({
                success: false,
                message: 'Invalid Password'
            })
        }

        if(user.blocked === "Blocked"){
            return res.status(400).send({
                success: false,
                message: "You Are Temporarily Blocked. Contact The Customer Service."
            })
        }

        //token
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRETE, {expiresIn: '7d',});
        const userCart = user.cart || [];

        const newCart = [...userCart];

        localCart.forEach(element => {
            newCart.push(element);
        });
        
        user.cart = newCart;
        await user.save();
        return res.status(200).send({
            success: true,
            message: 'Login Successfull',
            user:{
                name: user.name,
                email,
                password: user.password,
                address: user.address,
                role: user.role,
                phone: user.phone,
                cart: user.cart
            },
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Login Failed! Try after some time.',
            error
        })
    }
}

//Forgot Password Controller
export const forgotPasswordController = async(req, res)=>{
    try {
        const {email} = req.body;
        if(!email){
            return res.send({message: 'Email is required'})
        }

        //Check if user exist
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'Invalid Email'
            })
        }
        
        const otp = getOtp();
        const hashedOtp = await bcrypt.hash(otp.toString(),10);
        const sub = 'Reset Paswword';
        const pur = 'Resetting Your Password';
        await sendOTP(otp, email, sub, pur);
        res.status(200).send({
            success: true,
            message: 'OTP Sent Successfully',
            hashedOtp
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Cannot Send Otp'
        })
    }

}

//Verify OTP Controller
export const verifyOtpController = async(req, res)=>{
    try {
        const {otp, hashedOTP} = req.body;
        if(!otp || !hashedOTP){
            return res.status(401).send({
                success: false,
                message: 'OTP or Hashed OTP not received'
            })
        }

        const otpMatch = await bcrypt.compare(otp.toString(), hashedOTP);

        if(!otpMatch){
            return res.status(406).send({
                success: false,
                message: 'Incorrect OTP'
            })
        }

        return res.status(200).send({
            success: true
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Error In Verify OTP API'
        })
    }
}

//Reset Password Controller
export const resetPasswordController = async(req, res)=>{
    try {
        const {email, newPassword} = req.body;
        const hashedPassword = await hashPassword(newPassword);
        const user = await userModel.findOne({email})
        await userModel.findByIdAndUpdate(user._id,{password: hashedPassword});
        return res.status(201).send({
            success: true,
            message: 'Password Updated Successfully'
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Error in reset api'
        })
    }
}

//Test Controller

export const testController = (req, res)=>{
    res.send('Verified test route');
}

//Profile Controller
export const profileController = async(req, res)=>{
    try {
        const {name, email, phone, address, password} = req.body;
        const user = await userModel.findById(req.user._id);

        //password
        if(password && password.length < 6){
            return res.json({message: 'Password Is Required and Must be Greater Than 8 Characters'});
        }

        const hashedPassword = password? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                phone: phone || user.phone,
                password: hashedPassword || user.password,
                address: address || user.password
            },
            {new: true}
        );
        res.status(200).send({
            success: true,
            message: 'Profile Updated Successfully',
            updatedUser
        })
        
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Error Occured While Updating User',
            error
        });
    }
}

//Update Cart Controller
export const updateCartController = async(req, res)=>{
    try {
        const localCart = req.body.localCart || [];

        const user = await userModel.findById(req.user._id);

        user.cart = localCart;
        await user.save();
        return res.status(200).send({
            success: true
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Error Occured"
        })
    }
}

//Get Orders
export const getOrdersController = async(req, res)=>{
    try {
        const orders = await orderModel.find({buyer: req.user._id}).populate('products', '-photo').populate('buyer', 'name');
        res.json(orders);
        
    } catch (error) {
        return res.status(500).send({ 
            message: "Error while getting ordders"
        })
    }
}

//Getall orders
export const getAllOrdersController = async(req, res)=>{
    try {
        const orders = await orderModel.find({}).populate('products', '-photo').populate('buyer', 'name');
        res.json(orders);
        
    } catch (error) {
        return res.status(500).send({ 
            message: "Error while getting ordders"
        })
    }
}

//Update Order Status Controller
export const updateStatusController = async(req, res)=>{
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const order = await orderModel.findByIdAndUpdate(orderId, {status},{new: true});
        res.json(order);
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in update status api",
            error
        })
    }
}

//Get All Users
export const getUsersController = async(req, res)=>{
    try {
        const users = await userModel.find({role: 0});
        if(!users){
            return res.status(404).send({
                success: false,
                message: "No Users Found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Got Users",
            users
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error In API",
            error
        })
    }
}

//Rights Controller
export const rightsController = async(req, res)=>{
    try {
        const {UserId, right} = req.body;
        await userModel.findByIdAndUpdate({_id: UserId}, {blocked: right}, {new: true});
        return res.status(201).send({
            success: true,
            message: "Changed The Rights Of User"
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error In API",
            error
        })
    }
}