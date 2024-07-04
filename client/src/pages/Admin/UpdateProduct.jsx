import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { useNavigate, useParams } from 'react-router-dom'
import { Select } from 'antd'
import toast from 'react-hot-toast'
import axios from 'axios'

const UpdateProduct = () => {
    const params = useParams();
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
    const [id, setId] = useState('')


    //Get Single Product
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-products/${params.slug}`)
            if (data?.success) {
                setName(data.product.name);
                setDescription(data.product.description);
                setPrice(data.product.price);
                setQuantity(data.product.quantity);
                setShipping(data.product.shipping);
                setCategory(data.product.category._id);
                setId(data.product._id);
            }

        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong');
        }
    }

    useEffect(() => {
        getSingleProduct();
    }, [])

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


    //Handle Update
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            photo && productData.append("photo", photo);
            productData.append("category", category);
            productData.append("name", name);

            const { data } = await axios.put(`/api/v1/product/update-product/${id}`, productData);
            if (data?.success) {
                toast.success(data.message);
                navigate('/dashboard/admin/products');
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong')
        }
    }

    //Handle Delete
    const handleDelete = async () => {
        try {
            let answer = window.prompt('Are you sure to delete this product? Press 1 to confirm.');
            if (answer == 1) {
                const { data } = await axios.delete(`/api/v1/product/product-delete/${id}`);
                if (data?.success) {
                    navigate('/dashboard/admin/products');
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong');
        }
    }

    return (
        <>
            <Layout>
                <div className="container-fluid m-3 p-3">
                    <div className="row">
                        <div className="col-md-3">
                            <AdminMenu />
                        </div>
                        <div className="col-md-9">
                            <h1>Update Product</h1>
                            <div className="m-1 w-75">
                                <Select variant='borderless' placeholder='Select a category' size='large' showSearch className='form-select mb-3' onChange={(value) => {
                                    setCategory(value);
                                }} value={category}>
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
                                    {photo ? (
                                        <div className="text-center">
                                            <img src={URL.createObjectURL(photo)} alt="Product Image" height="200px" className='img img-responsive' />
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <img src={`/api/v1/product/product-photo/${id}`} alt="Product Image" height="200px" className='img img-responsive' />
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
                                        value={shipping ? "Yes" : "No"}
                                    >
                                        <Option value="0">No</Option>
                                        <Option value="1">Yes</Option>
                                    </Select>
                                </div>
                                <div className="mb-4">
                                    <button className='btn btn-primary m-2' onClick={handleUpdate}>Update Product</button>
                                    <button className='btn btn-danger m-2' onClick={handleDelete}>Delete Product</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default UpdateProduct
