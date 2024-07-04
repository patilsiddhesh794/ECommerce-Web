import React from 'react'
import Layout from '../../components/Layout/Layout'
import '../../styles/Register.css'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

const Register = () => {
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [phone, setphone] = useState("")
    const [address, setaddress] = useState("")
    const [password, setpassword] = useState("")
    const [otp, setOtp] = useState("")
    const [hashedOtp, setHashedOtp] = useState("")
    const [disable, setDisabled] = useState(true)
    const [visibleSend, setVisibleSend] = useState(true)
    const navigate = useNavigate()

    //Validation
    const validateInputs = () => {
        if (!name || !address) {
            toast.error("All Fields Are Mandatory");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Invalid email address');
            return false;
        }
        
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            toast.error('Phone number must be 10 digits and contain only numbers');
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            toast.error('Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long');
            return false;
        }

        return true;
    }

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (!validateInputs()) {
                return;
            }

            const res = await axios.post('/api/v1/auth/register', {
                name,
                email,
                phone,
                password,
                address,
            });


            if (res && res.data.success) {
                toast.success(res.data.message)
                navigate("/Login")
            } else {
                toast.error(res.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error("Something Went Wrong")
        }
    }

    //Handle Otp send
    const handleOtp = async()=>{
        try {
            if(!validateInputs()) return;

            const {status, data} = await axios.post('/api/v1/auth/reg-otp', {name, email, phone, password, address});
            if(status === 200){
                setHashedOtp(data.hashedOTP);
                setVisibleSend(false);
                toast.success(data.message);
            }
            
        } catch (error) {
            console.log(error);
            toast.error("Try Again Later");
        }
    }

    //Verify OTP
    const handleVerify = async()=>{
        try {
            const { status, data } = await axios.post("/api/v1/auth/verify-otp", { otp, hashedOTP: hashedOtp });
    
            if (data.success) {
                setDisabled(false);
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

    return (
        <div className='background'>
            <Layout>
                <form className='r_form' onSubmit={handleSubmit}>
                    <div className="container">
                        <h1>Register</h1>
                        <p>Please fill in this form to create an account.</p>
                        
                        <div className="detail">
                            <label htmlFor="name"><b>Name</b></label>
                            <input type="text" placeholder="Enter Name" value={name} onChange={(e) => { setname(e.target.value) }} required />
                            <label htmlFor="email"><b>Email</b></label>
                            <input type="text" placeholder="Enter Email" value={email} onChange={(e) => { setemail(e.target.value) }} required />
                            <label htmlFor="phone"><b>Phone</b></label>
                            <input type="text" placeholder="Enter Phone" value={phone} onChange={(e) => { setphone(e.target.value) }} required />
                            <label htmlFor="address"><b>Address</b></label>
                            <input type="text" placeholder="Enter Address" value={address} onChange={(e) => { setaddress(e.target.value) }} required />
                            <label htmlFor="psw"><b>Password</b></label>
                            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => { setpassword(e.target.value) }} required />
                            <label htmlFor="answer"><b>Enter OTP</b></label>
                            <div className="d-flex gap-2">
                                <input type="text" placeholder="OTP" autoComplete="off" value={otp} onChange={(e) => { setOtp(e.target.value) }} required style={{width: '225px'}}/>
                                {visibleSend && (<>
                                    <button type='button' className='btn btn-outline-success' onClick={handleOtp}>Get OTP</button>
                                </>)}
                                {!visibleSend && (<>
                                    <button type='button' className='btn btn-outline-success' onClick={handleVerify}>Verify</button>
                                </>)}
                            </div>
                        </div>
                        <hr />
                        <p>By creating an account you agree to our <NavLink to="/Policy">Terms &amp; Privacy</NavLink>.</p>
                        <button type="submit" className="registerbtn btn btn-primary" disabled={disable}>Register</button>
                    </div>
                    <div className="container signin">
                        <p>Already have an account? <NavLink to="/Login">Sign in</NavLink>.</p>
                    </div>
                </form>
            </Layout>
        </div>
    )
}

export default Register
