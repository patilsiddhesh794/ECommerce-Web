import React from 'react'
import { useState } from 'react'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import '../../styles/Login.css'
import { useAuth } from '../../context/auth'
import { useCart } from '../../context/cart'

const Login = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();
    const {auth, setAuth} = useAuth();
    const {cart, setCart} = useCart();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!email || !password){
                toast.error("Enter Valid Credentials");
                return;
            }
            
            const res = await axios.post("/api/v1/auth/login", {
                email,
                password,
                localCart: cart,
            });

            if(res && res.data.success){
                toast.success(res.data.message)
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });
                localStorage.setItem("auth",JSON.stringify(res.data));
                setCart(res.data?.user?.cart)
                navigate( location.state || "/")
            }else if(res && !res.data.success){
                toast.error("Invalid Username or Password")
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 404 || error.response.status === 401) {
                    toast.error('Invalid Username or Password');
                } else if(error.response.status === 400){
                    toast.error(error.response.data.message);
                }else {
                    toast.error("Try Again Later");
                }
            } else {
                console.log(error);
                toast.error("Something Went Wrong");
            }
        }
    }

    return (
        <div className='loginbg'>
            <Layout>
                <form className='lform' onSubmit={handleSubmit}>
                    <div className="container">
                        <h1>Login</h1>
                        <p>Fill Login Credentials</p>
                        
                        <div className="detail">
                        <label htmlFor="email"><b>Email</b></label>
                        <input type="text" placeholder="Enter Email" value={email} onChange={(e) => { setemail(e.target.value) }} id='email' required />
                        <label htmlFor="psw"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" value={password} onChange={(e) => { setpassword(e.target.value) }} id='psw' required />
                        </div>
                    <hr />
                    <button type="submit" className="loginbtn btn btn-primary">Login</button>
                    </div>
                    <div style={{display: 'flex', justifyContent:"center", marginTop: '10px'}}>
                        <NavLink to="/forgot-password">Forgot Password</NavLink>
                    </div>
                    <div className="container signun">
                        <p>Don't have an account? <NavLink to="/Register">Register</NavLink>.</p>
                    </div>
                </form >
            </Layout>
        </div>
    )
}

export default Login
