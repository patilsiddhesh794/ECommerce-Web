import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios'
import { useAuth } from '../../context/auth'
import toast from 'react-hot-toast'
import { Select } from 'antd'
import '../../styles/Users.css'

const Users = () => {
  const [rights, setRights] = useState(["Blocked", "Unblocked"]);
  const [users, setUsers] = useState([]);
  const { auth, setAuth } = useAuth();
  const {Option} = Select;

  //Get All Users
  const getUsers = async () => {
    try {
      const { status, data } = await axios.get("/api/v1/auth/get-users");
      if (status === 200) {
        setUsers(data.users);
      }

    } catch (error) {
      console.log(error);
      toast.error("Try Again Later");
    }
  }

  useEffect(() => {
    if (auth?.token) getUsers();
  }, [auth?.token])


//Change Right
const handleChange = async(UserId, value)=>{
  try {
    const {status, data} = await axios.put('/api/v1/auth/change-rights', {UserId, right: value});
    if(status === 201){
      toast.success(`User Is ${value}`);
    }
    
  } catch (error) {
    console.log(error);
    toast.error("Try Again Later");
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
              <h1>All Users</h1>
              <div className="container">
                {users.map((u, i) => {
                  return (<>
                    <table className="table" key={u?._id}>
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">Contact</th>
      <th scope="col" style={{width: '25%'}}>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" data-label="#"> {i + 1}</th>
      <td data-label="Name">{u?.name}</td>
      <td data-label="Email">{u?.email}</td>
      <td data-label="Contact">{u?.phone}</td>
      <td data-label="Action">
        <Select variant='borderless' onChange={(value) => handleChange(u?._id, value)} defaultValue={u?.blocked}>
          {rights.map((r, i) => (
            <Option key={i} value={r}>{r}</Option>
          ))}
        </Select>
      </td>
    </tr>
  </tbody>
</table>

                  </>)
                })}

              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Users
