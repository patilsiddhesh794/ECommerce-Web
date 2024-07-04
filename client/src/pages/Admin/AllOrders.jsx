import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/auth'
import moment from 'moment'
import { Select } from 'antd'

const AllOrders = () => {
    const [order, setOrders] = useState([]);
    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Deliverd", "Cancel"]);
    const [changeStatus, setChangeStatus] = useState("");
    const { auth, setAuth } = useAuth();
    const {Option} = Select;

    //Get All Orders
    const getAllOrders = async (req, res) => {
        try {
            const { status, data } = await axios.get('/api/v1/auth/get-all-orders');
            if (status === 500) {
                toast.error("Try After Some Time");
            }
            setOrders(data);

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (auth?.token) getAllOrders();
    }, [auth?.token]);

    //Handle Change for status changing
    const handleChange = async(orderId, value)=>{
        try {
            const {status, data} = await axios.put(`/api/v1/auth/update-status/${orderId}`, {status: value});
            if(status === 500){
                toast.error("Failed to change the status");
            }
            toast.success(`Status Changed to ${value}`);
            
        } catch (error) {
            console.log(error);
            toast.error('Try Again Later');
        }
    }

    return (
        <>
            <Layout>
                <div className="container-fluid mt-3 p-3">
                    <div className="row">
                        <div className="col-md-3">
                            <AdminMenu />
                        </div>
                        <div className="col-md-9 mb-4">
                            <h1 className='text-center'>All Orders</h1>
                            <div className="container">
                                {order?.map((o, i) => {
                                    return (
                                        <div key={o._id}>
                                            <table className="table" key={o?._id}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Status</th>
                                                        <th scope="col">Buyer</th>
                                                        <th scope="col">Date</th>
                                                        <th scope="col">Payment Amount</th>
                                                        <th scope="col">Quantity</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th scope="row">{i + 1}</th>
                                                        <td>
                                                            <Select variant='borderless' onChange={(value)=> handleChange(o._id, value)} defaultValue={o?.status}>
                                                                {status.map((s, i)=>{
                                                                    return (
                                                                        <Option key={i} value={s}>{s}</Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </td>
                                                        <td>{o?.buyer?.name}</td>
                                                        <td>{new Date(o?.createdAt).toLocaleDateString('en-gb')}</td>
                                                        <td>Rs. {o?.amount}</td>
                                                        <td>{o?.products?.length}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="container">
                                                {o?.products?.map((p, i) => {
                                                    return (
                                                        <div className="card mb-3" key={p._id} style={{ minWidth: "100%" }}>
                                                            <div className="row g-0">
                                                                <div className="col-md-1 p-1 my-auto">
                                                                    <div style={{ width: '90px', height: '100%', overflow: 'hidden' }}>
                                                                        <img src={`/api/v1/product/product-photo/${p._id}`} className="img-fluid rounded-start" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p?.name} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-9">
                                                                    <div className="card-body">
                                                                        <h5 className="card-title">{p.name}</h5>
                                                                        <p className="card-text" style={{ height: '80%', overflow: 'hidden' }}>{p.description.substring(0, 250)}</p>
                                                                        <p className="card-text"><small className="text-body-secondary">Price: Rs. {p?.price}</small></p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default AllOrders
