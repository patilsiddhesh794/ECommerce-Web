import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js'

export const requireSignIn = (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRETE)
        req.user = decode;
        next()
    } catch (error) {
        console.log(error);
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.role !== 0) {
            next()
        }
        else {
            return res.status(404).send({
                success: false,
                message: "Unauthorised Access"
            })
        }
    } catch (error) {
        console.log(error);
    }
}