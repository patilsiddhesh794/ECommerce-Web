import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { Checkbox, Radio } from 'antd'
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import Carousel from 'react-bootstrap/Carousel';
import '../styles/Homepage.css'


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { cart, setCart } = useCart();

  //Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      if (data?.success) {
        setProducts(data.products);
        setLoading(false);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts();
  }, [checked.length, radio.length])

  //Get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data.category);
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllCategories();
    getCount();
  }, [])

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

  //Handle Category Filter
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter(c => c !== id)
    }
    setChecked(all);
  };

  //Get Filtered Products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post('/api/v1/product/filter-products', { checked, radio, });
      if (data?.success) {
        setProducts(data?.products);
      }

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio])

  return (
    <>
      <Layout>
        <div className="container-fluid mb-3 p-3">
          <div className="row">
            <div className="corousel-image">
            <Carousel>
              <Carousel.Item>
                <div className='d-flex justify-content-center'>
                  <img src="/img1.jpg" alt="Offer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <Carousel.Caption>
                  <h3>Exclusive Summer Sale!</h3>
                  <p className='text-center'>Get amazing deals every hour.
                    Don't miss out on massive discounts.
                    Hurry! Limited stock available.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <div className='d-flex justify-content-center'>
                  <img src="/img2.jpg" alt="Offer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <Carousel.Caption>
                  <h3>Weekend Special Offers!</h3>
                  <p className='text-center'>Enjoy big savings this weekend.
                    Shop now and upgrade your style.
                    Grab your favorite items before they're gone.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <div className='d-flex justify-content-center'>
                  <img src="/img3.jpg" alt="Offer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <Carousel.Caption>
                  <h3>Flash Sale Alert!</h3>
                  <p className='text-center'>Get amazing deals every hour.
                    Don't miss out on massive discounts.
                    Hurry! Limited stock available.</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
            </div>

            <div className="col-md-2 mt-4">
              <h4>Filter By Category</h4>
              <div className="d-flex flex-column">
                {categories?.map(c => (
                  <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                    {c.name}
                  </Checkbox>
                ))}
              </div>
              {/* Price Filter */}
              <h4 className='mt-3'>Filter By Price</h4>
              <div className="d-flex flex-column">
                <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                  {Prices?.map(p => (
                    <div key={p._id}>
                      <Radio value={p.array}>{p.name}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>
              <div className="d-flex flex-column mt-3">
                <button className='btn btn-danger' onClick={() => window.location.reload()}>Clear Filters</button>
              </div>
            </div>
            <div className="col-md-10 mt-4">
              {/* <h2 className='text-center'>All Products List</h2> */}
              <div className="d-flex flex-wrap">
                {products?.map((p) => {
                  return (
                    <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top p-2"
                        alt="Product Image"
                        
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
                          {(p?.quantity) > 0 && (<>
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
              <div className='m-2 p-2'>
                {(!checked.length && !radio.length) && products && products.length < total && (
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
    </>
  )
}

export default HomePage
