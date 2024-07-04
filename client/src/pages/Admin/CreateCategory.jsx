import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import CategoryForm from '../../components/Form/CategoryForm'
import { Modal } from 'antd'

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [selected, setSelected] = useState(null);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data.category);
      }

    } catch (error) {
      console.log(error);
      toast.error('Unable to get categories')
    }
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  //handlesubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/v1/category/create-category', { name, });
      if (data?.success) {
        toast.success(data.message);
        getAllCategories();
      } else {
        toast.error(data.message)
      }


    } catch (error) {
      console.log(error);
      toast.error('Something Went Wrong')
    }
  }

  //Handle Update
  const handleUpdate = async(e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.put(`/api/v1/category/update-category/${selected._id}`,{name: updatedName,});
      if(data?.success){
        setVisible(false);
        setUpdatedName("");
        setSelected(null);
        getAllCategories();
        toast.success(data.message)
      }else{
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error('Unable to update')
    }
  }

  //Handle Delete
  const handleDelete = async(pid)=>{
    try {
      const {data} = await axios.delete(`/api/v1/category/delete-category/${pid}`);
      if(data?.success){
        getAllCategories();
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error('Unable to delete');
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
            <div className="col-md-9">
              <h1>Manage Category</h1>
              <div className="p-3 w-50">
                <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
              </div>
              <div className="w-75">
                <table className="table table-striped table-hover mb-4">
                  <thead>
                    <tr>
                      <th scope="col">Category</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories?.map((c) => {
                      return (
                        <tr key={c._id}>
                          <td>{c.name}</td>
                          <td >
                            <button className='btn btn-primary ms-2' onClick={()=>{
                              setVisible(true);
                              setSelected(c);
                              setUpdatedName(c.name);
                            }}>Edit</button>
                            <button className='btn btn-danger ms-2' onClick={()=>{
                              handleDelete(c._id);
                            }}>Delete</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Modal
                onCancel={() => setVisible(false)}
                footer={null}
                open={visible}
              >
                <CategoryForm
                  value={updatedName}
                  setValue={setUpdatedName}
                  handleSubmit={handleUpdate}
                />
              </Modal>
            </div>
          </div>
        </div>
      </Layout>

    </>
  )
}

export default CreateCategory
