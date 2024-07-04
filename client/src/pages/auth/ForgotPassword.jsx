import React from 'react'
import { useState } from 'react'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import '../../styles/ForgotPassword.css'

const ForgotPassword = () => {

    const [email, setemail] = useState("");
    const [newPassword, setnewpassword] = useState("");
    const [otp, setOtp] = useState("");
    const [hashedOtp, setHashedOtp] = useState("");
    const [visibleOtp, setVisibleOtp] = useState(false);
    const [VisibleNP, setVisibleNP] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!email) {
                toast.error("Enter Valid Credentials");
                return;
            }
            const res = await axios.post("/api/v1/auth/forgot-password", {
                email,
            });

            toast.success(res.data.message)
            setHashedOtp(res.data.hashedOtp);
            setVisibleOtp(true);

        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something Went Wrong");
                }
            } else {
                console.log(error);
                toast.error("Something Went Wrong");
            }
        }
    }

    //Handle OTP Verification
    const handleOtp = async () => {
        try {
            const { status, data } = await axios.post("/api/v1/auth/verify-otp", { otp, hashedOTP: hashedOtp });
    
            if (data.success) {
                setVisibleNP(true);
                setVisibleOtp(false);
                toast.success('OTP Verified Successfully');
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 406) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Try Again Later");
                }
            } else {
                console.log(error);
                toast.error("Try Again Later");
            }
        }

    }

    //Handle New Password
    const handleSetPassword = async () => {
        try {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                toast.error('Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.');
                return;
            }
            const { status, data } = await axios.put("/api/v1/auth/reset-password", { email, newPassword });
            if (status === 201) {
                toast.success("Password Reset Successfully");
                navigate(location.state || "/login")
            }

        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        }
    }

    return (
        <>
            <div className='forgotPass-bg'>
                <Layout>
                    <form className='fform' onSubmit={handleSubmit}>
                        <div className="f_container">
                            <h1>Reset Password</h1>

                            <hr />
                            <div className="detail">
                                <label htmlFor="email"><b>Email</b></label>
                                <input type="text" placeholder="Enter Email" value={email} onChange={(e) => { setemail(e.target.value) }} required />
                                {visibleOtp && (<>
                                    <label htmlFor="answer"><b>Enter OTP</b></label>
                                    <input type="text" placeholder="OTP" autocomplete="off" value={otp} onChange={(e) => { setOtp(e.target.value) }} required />
                                    <button type='button' className='btn btn-outline-success my-2' onClick={handleOtp}>Verify OTP</button>
                                </>)}
                                {VisibleNP && (
                                    <>
                                        <label htmlFor="newpsw"><b>New Password</b></label>
                                        <input type="password" placeholder="Enter New Password" value={newPassword} onChange={(e) => { setnewpassword(e.target.value) }} id='newpsw' required />
                                        <button type='button' className='btn btn-success my-2' onClick={handleSetPassword}>Submit</button>
                                    </>
                                )}
                            </div>
                            <hr />
                            {(!visibleOtp && !VisibleNP) && (<>
                                <button type="submit" className="f_submit btn btn-primary">Submit</button>
                            </>)}
                        </div>
                    </form >
                </Layout>
            </div>
        </>
    )
}

export default ForgotPassword
