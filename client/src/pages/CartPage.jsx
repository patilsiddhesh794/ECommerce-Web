import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart'
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GiShoppingBag } from "react-icons/gi";
import axios from 'axios';

const CartPage = () => {
    const { cart, setCart } = useCart();
    const { auth, setAuth } = useAuth();
    const [total, setTotal] = useState();
    const navigate = useNavigate();

    //Count Total Price
    const getTotal = ()=>{
        try {
            let total = 0;
            cart.map((p)=>{
                total = total + p.price;
            })

            return total;
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(()=>{ setTotal(getTotal())}, [cart]);

    const handleRemove = (pid) => {
        try {
            let newCart = [...cart];
            let index = newCart.findIndex((item) => item._id === pid);
            newCart.splice(index, 1);
            setCart(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));

        } catch (error) {
            console.log(error);
        }

    }

    //
    const loadScript = (src) =>{
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    //Razorpay Display
    const displayRazorpay = async()=>{
        if (total < 1) {
            toast.error("Cart Is Empty");
            return;
        }

        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            toast.error("Are you online?");
            return;
        }

        // creating a new order
        const result = await axios.post("/api/v1/product/orders",{amount: total, currency: 'INR'});

        if (!result) {
            toast.error("Server error");
            console.log("Error in post request of razorpay")
            return;
        }

        // Getting the order details back
        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: "rzp_test_LRTpgV1a4NJQNy", // Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: currency,
            name: "E-Commerce Shop",
            description: "Order Payment",
            image: <GiShoppingBag />,
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                const result = await axios.post("/api/v1/product/success", {data, cart, amount: total});

                if(result.status === 400)
                    toast.error(result.data.msg);
                else{
                    toast.success(result.data.msg);
                    setCart([]);
                    localStorage.removeItem('cart');
                }
            },
            prefill: {
                name: auth?.user?.name,
                email: auth?.user?.email,
                contact: auth?.user?.phone,
            },
            notes: {
                address: "E-Commerce Office, Tondapur, Maharashtra, 424207",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    return (
        <>
            <Layout>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 mt-4">
                            <h1 className='text-center'>{`Hello ${auth?.token && auth?.user?.name}`}</h1>
                            <h4 className='text-center'>{cart?.length ? `You Have ${cart.length} Products in Your Cart. ${auth?.token ? "" : `Please Login to Checkout`}` : "Your Cart is Empty."}</h4>
                        </div>
                        <div className="col-md-8 mt-3">
                            <div className='d-flex flex-wrap gap-2 mb-5'>
                                {cart?.map((p) => (
                                    <div className="card" style={{ width: '18rem' }} key={p._id}>
                                        <img className="card-img-top p-2" src={`/api/v1/product/product-photo/${p._id}`} style={{ objectFit: 'contain', height: 200 }} alt="Card image cap" />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p.description.substring(0, 30)}...</p>
                                            <p className="card-text price">Rs. {p.price}</p>
                                            <div className="mt-auto"> {/* Use mt-auto class to push the button to the bottom */}
                                                <button href="#" className="btn btn-primary" onClick={() => handleRemove(p._id)}>Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>

                        </div>
                        <div className="col-md-4 mt-3">
                            <h2 className='text-center'>Cart Summary</h2>
                            <h6 className='text-center'>Total | Checkout | Payment</h6>
                            <hr />
                            <h4>Total: {total}</h4>
                            {auth?.user?.address ? (
                                <>
                                    <div className="mb-3">
                                        <h5>Address</h5>
                                        <h6>{auth?.user.address}</h6>
                                        <button className='btn btn-outline-warning' onClick={()=> navigate('/dashboard/user/profile')}>Update Address</button>
                                    </div>
                                </>
                            ): (
                                <div className="mb-3">
                                    {auth?.token ? (
                                        <>
                                            <button className='btn btn-outline-warning' onClick={()=> navigate('/dashboard/user/profile')}>Update Address</button>
                                        </>
                                    ): (
                                        <button className='btn btn-outline-warning' onClick={()=> navigate('/login', {state: '/cart',})}>Please Login To Checkout</button>
                                    )}
                                </div>
                            )}
                            {auth?.token && (<button className='btn btn-outline-success' onClick={displayRazorpay}>Proceed To Payment</button>)}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default CartPage
