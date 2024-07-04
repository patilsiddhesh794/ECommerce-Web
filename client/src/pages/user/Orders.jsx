import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import axios from 'axios'
import { useAuth } from '../../context/auth'
import moment from 'moment'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { auth, setAuth } = useAuth();

  //Function to get all orders
  const getOrders = async () => {
    try {
      const { status, data } = await axios.get("http://localhost:8080/api/v1/auth/get-orders");
      if (status === 500) {
        toast.error("Try After Some Time");
        return;
      }

      setOrders(data);

    } catch (error) {
      console.log(error);
      toast.error("Try Again Later");
    }
  }

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <>
      <Layout>
        <div className="container-fluid p-3 mt-3">
          <div className="row">
            <div className="col-md-3">
              <UserMenu />
            </div>
            <div className="col-md-9">
              <h1 className='text-center'>All Orders</h1>
              <div className="container">
                {(orders.length < 1) && (<h3>You Haven't Ordered Anything Yet</h3>)}
                {orders?.map((o, i) => {
                  return (<div key={o._id}>
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
                          <td>{o?.status}</td>
                          <td>{o?.buyer?.name}</td>
                          <td>{new Date(o?.createdAt).toLocaleDateString('en-gb')}</td>
                          <td>Rs. {o?.amount}</td>
                          <td>{o?.products?.length}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="container">
                      {o?.products.map((p) => {
                        return (
                          <div className="card mb-3" key={p._id} style={{ minWidth: "100%" }}>
                            <div className="row g-0">
                              <div className="col-md-1 p-1 my-auto">
                                <div style={{ width: '90px', height: '100%', overflow: 'hidden' }}>
                                  <img src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`} className="img-fluid rounded-start" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p?.name} />
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

export default Orders
