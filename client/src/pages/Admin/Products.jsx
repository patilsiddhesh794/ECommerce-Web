import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //Get Count of products
  const getCount = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/product-count')
      setTotal(data?.total);

    } catch (error) {
      console.log(error);
    }
  }

  //Load Products
  const loadProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (page === 1) return;
    loadProduct();
  }, [page])

    //Get all products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/get-products');
            if (data?.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        }
    }

    useEffect(() => {
        getAllProducts();
        getCount();
    }, [])

    return (
        <Layout>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className='text-center'>Products List</h1>
                        <div className='d-flex flex-wrap mb-4'>
                            {products?.map((p) => {
                                return (
                                    <Link to={`/dashboard/admin/product/${p.slug}`} key={p._id} className='product-link'>
                                    <div className="card m-2" style={{ width: '18rem' }}>
                                        <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top p-2" alt={p?.name} style={{objectFit: 'contain', height: '200px'}} />
                                        <div className="card-body">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p.description.substring(0, 30)}...</p>
                                        </div>
                                    </div>
                                    </Link>
                                )
                            })}
                        </div>
                        <div className='m-2 p-2'>
                {products && products.length < total && (
                  <button className='btn btn-warning' onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}>
                    {loading ? "Loading..." : "Load More"}
                  </button>
                )}
              </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Products
