import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { cart, setCart } = useCart();
  const category = params.slug.toUpperCase();

  //Get Products
  const getProducts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/category-product/${params.slug}`);
      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error("Some Error Occured");
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (category) getProducts();
  }, [category])

  return (
    <>
      <Layout>
        <div className="container-fluid row mt-4">
          <h3 className='text-center'>Category - {category}</h3>
          <h6 className='text-center'>Results - {products?.length}</h6>
          <div className="mt-4">
            <div className="d-flex flex-wrap mb-4">
              {products?.map((p) => {
                return (
                  <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top p-2"
                      alt="Product Image"
                      style={{ objectFit: 'contain', height: '200px' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description.substring(0, 30)}...</p>
                      <p className="card-text price">Rs. {p.price}</p>
                      <div className="mt-auto">
                        <button
                          className='btn btn-primary m-1'
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </button>
                        {(p?.quantity > 0) && (<>
                          <button
                            className='btn btn-success m-1'
                            onClick={() => {
                              setCart([...cart, p]);
                              localStorage.setItem("cart", JSON.stringify([...cart, p]));
                              toast.success("Added To Cart");
                            }}
                          >
                            Add To Cart
                          </button>
                        </>)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default CategoryProduct
