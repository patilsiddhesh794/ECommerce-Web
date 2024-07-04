import Layout from '../components/Layout/Layout'
import React from 'react'
import { useSearch } from '../context/search'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart'

const Search = () => {
  const { values, setValues } = useSearch();
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  return (
    <>
      <Layout>
        <div className="container">
          <div className="text-center">
            <h1>Search Results</h1>
            <h5> {values?.results.length < 1 ? "No Results Found" : `Found ${values?.results.length}`}</h5>
          </div>
          <div className="d-flex flex-wrap mb-4">
            {values.results?.map((p) => {
              return (
                <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                  <img
                    src={`/api/v1/product/product-photo/${p?._id}`}
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
      </Layout>
    </>
  )
}

export default Search
