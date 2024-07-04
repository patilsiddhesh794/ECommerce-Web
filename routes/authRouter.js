import express from 'express'
import { loginController, registerController, testController, forgotPasswordController, profileController, updateCartController, getOrdersController, getAllOrdersController, updateStatusController, verifyOtpController, resetPasswordController, regOtpController, getUsersController, rightsController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
const router = express.Router();

//Routing
//Register method POST
router.post('/register',registerController)

//Register OTP Validation
router.post('/reg-otp', regOtpController);

//Login 
router.post('/login',loginController)

//Forget Password
router.post('/forgot-password',forgotPasswordController)

//Verify OTP
router.post('/verify-otp', verifyOtpController);

//Change Password
router.put('/reset-password', resetPasswordController);

//Test Controller
router.get('/test',requireSignIn, isAdmin ,testController)

//protected route
router.get('/user-auth',requireSignIn, (req, res)=>{
    res.status(200).send({ok: true});
})

//Update profile
router.put('/profile', requireSignIn, profileController)

//protected Admin route
router.get('/admin-auth',requireSignIn, isAdmin,(req, res)=>{
    res.status(200).send({ok: true});
})

//update cart route
router.post('/update-cart', requireSignIn, updateCartController);

//Get Orders
router.get('/get-orders', requireSignIn, getOrdersController);

//Get Orders
router.get('/get-all-orders', requireSignIn,isAdmin ,getAllOrdersController);

//Change Order Status
router.put('/update-status/:orderId', requireSignIn, isAdmin, updateStatusController);

//Get All Users
router.get('/get-users', requireSignIn, isAdmin, getUsersController);

//Handle User Block or Unblock
router.put('/change-rights', requireSignIn, isAdmin, rightsController);

export default router;