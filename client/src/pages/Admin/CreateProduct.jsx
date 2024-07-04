import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { useNavigate } from 'react-router-dom'
import { Select } from 'antd'
import toast from 'react-hot-toast'
import axios from 'axios'

const CreateProduct = () => {
  const { Option } = Select;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState('');
  const [shipping, setShipping] = useState('');

  //Get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data.category);
      }

    } catch (error) {
      console.log(error);
      toast.error('Error in getting categories')
    }
  }

  useEffect(() => {
    getAllCategories();
  }, [])


  //Handle Create
  const handleCreate = async(e)=>{
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("name", name);

      const {data} = await axios.post("/api/v1/product/create-product", productData);
      if(data?.success){
        toast.success(data.message);
        navigate('/dashboard/admin/products');
      }else{
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error('Something Went Wrong')
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
              <h1>Create Product</h1>
              <div className="m-1 w-75">
                <Select variant='borderless' placeholder='Select a category' size='large' showSearch className='form-select mb-3' onChange={(value) => {
                  setCategory(value);
                }} >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>{c.name}</Option>
                  )
                  )}
                </Select>

                <div className="mb-3">
                  <label className='btn btn-outline-secondary col-md-12'>
                    {photo ? photo.name : "Upload Image"}
                    <input type="file" name="photo" accept='image/*' onChange={(e) => {
                      setPhoto(e.target.files[0]);
                    }} hidden />
                  </label>
                </div>
                <div className="mb-3">
                  {photo && (
                    <div className="text-center">
                      <img src={URL.createObjectURL(photo)} alt="Product Image" height="200px" className='img img-responsive' />
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <input type="text" placeholder='Product Name' value={name} className='form-control' onChange={(e) => {
                    setName(e.target.value);
                  }} />
                </div>
                <div className="mb-3">
                  <textarea type="text" placeholder='Product Description' value={description} className='form-control' onChange={(e) => {
                    setDescription(e.target.value);
                  }} />
                </div>
                <div className="mb-3">
                  <input type="number" placeholder='Price' value={price} className='form-control' onChange={(e) => {
                    setPrice(e.target.value);
                  }} />
                </div>
                <div className="mb-3">
                  <input type="number" placeholder='Product Quantity' value={quantity} className='form-control' onChange={(e) => {
                    setQuantity(e.target.value);
                  }} />
                </div>
                <div className="mb-3">
                  <Select
                    variant='borderless'
                    placeholder="Select Shipping "
                    size="large"
                    showSearch
                    className="form-select mb-3"
                    onChange={(value) => {
                      setShipping(value);
                    }}
                  >
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>
                <div className="mb-3">
                  <button className='btn btn-primary' onClick={handleCreate}>Create Product</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

    </>
  )
}

export default CreateProduct
