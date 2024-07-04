import React from 'react'
import Layout from '../components/Layout/Layout'
import useCategory from '../hooks/useCategory'
import { Link } from 'react-router-dom';

const Category = () => {
    const categories = useCategory();

  return (
    <>
      <Layout>
        <div className="container-fluid row my-5 p-3">
            <h1 className='text-center'>All Categories</h1>
            <div className='mt-3 row flex-column align-items-center mb-4'>
            {categories.map((c)=>(
                <Link to={`/category/${c.slug}`} className="w-50" key={c._id} style={{textDecoration:"none"}}>
                <div class="card">
                <div class="card-body">
                  {c.name}
                </div>
                </div>
                </Link>
            ))}
            </div>
        </div>
      </Layout>
    </>
  )
}

export default Category
