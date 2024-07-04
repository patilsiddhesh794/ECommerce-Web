import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/cart';

const ProductDetail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [product, setProduct] = useState({});
    const [similar, setSimilar] = useState([]);
    const { cart, setCart } = useCart();

    //Get product
    const getProduct = async (req, res) => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-products/${params.slug}`);
            setProduct(data?.product);
            getSimilar(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug]);

    //Get Similar Products
    const getSimilar = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/similar-product/${pid}/${cid}`);
            setSimilar(data?.products);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Layout>
                <div className="container-fluid row mt-4">
                    <div className="col-md-6 text-center">
                        <img src={`/api/v1/product/product-photo/${product?._id}`} className="card-img-top" alt={product?.name} style={{ maxHeight: '400px', width: 'auto' }} />
                    </div>
                    <div className="col-md-6">
                        <h1 className='text-center'>Product Details</h1>
                        <h6>Name: {product?.name}</h6>
                        <h6>Description: {product?.description}</h6>
                        <h6>Category: {product?.category?.name}</h6>
                        <h6>Price: {product?.price}</h6>
                        <hr />
                        {(product?.quantity < 15 && product?.quantity > 0) && (<h5>Hurry Up! Only {product?.quantity} products left.</h5>)}
                        
                        {(product?.quantity > 0)? (<>
                        <button className='btn btn-primary' onClick={() => {
                            setCart([...cart, product]);
                            localStorage.setItem("cart", JSON.stringify([...cart, p]));
                            toast.success("Added To Cart");
                        }}>Add to Cart</button>
                        </>): (<h4>Currently Out of Stock</h4>)}
                    </div>
                </div>
                <hr />
                <div className='container-fluid row mb-5'>
                    <h3 className='text-center'>Similar Products</h3>
                    {similar.length < 1 && <h4 className='text-center'>No Similar Products Available</h4>}
                    <div className="d-flex flex-wrap">
                        {similar.map((p) => {
                            return (
                                <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                    <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top p-2" alt="Product Image" />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description.substring(0, 30)}...</p>
                                        <p className="card-text price">Rs. {p.price}</p>
                                        <button className='btn btn-primary m-1' onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                        {(p?.quantity > 0) && (<>
                                        <button className='btn btn-success m-1' onClick={() => {
                                            setCart([...cart, p]);
                                            localStorage.setItem("cart", JSON.stringify([...cart, p]));
                                            toast.success("Added To Cart");
                                        }}>Add To Cart</button>
                                        </>)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default ProductDetail
