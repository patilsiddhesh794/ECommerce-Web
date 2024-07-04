import React from 'react'
import Layout from '../components/Layout/Layout'

const PageNotFound = () => {
  return (
    <div>
      <Layout>
        <div className="container-fluid mt-4 p-3">
          <div className="d-flex flex-column align-items-center">
            <h1>Page Not Found</h1>
            <img src="/not-found.png" alt="404" width={'400px'} className='not-found'/>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default PageNotFound
