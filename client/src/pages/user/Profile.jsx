import React, { useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import UserMenu from '../../components/Layout/UserMenu';

const Profile = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");
  const [password, setpassword] = useState("");
  const { auth, setAuth } = useAuth();

  //Define initial values for all
  const setInitialValues = () => {
    try {
      setname(auth?.user.name);
      setemail(auth?.user.email);
      setphone(auth?.user.phone);
      setaddress(auth?.user.address);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (auth) setInitialValues();
  }, [auth?.user]);

  //Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        toast.error('Phone number must be 10 digits and contain only numbers');
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (password && !passwordRegex.test(password)) {
        toast.error('Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long');
        return;
      }


      const { status, data } = await axios.put('http://localhost:8080/api/v1/auth/profile', {
        name, email, address, phone, password
      });
      if (status === 400) toast.error(data?.message);
      else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem('auth');
        ls = JSON.parse(ls);
        ls.user = data?.updatedUser;
        localStorage.setItem('auth', JSON.stringify(ls));
        toast.success(data?.message);
      }

    } catch (error) {
      console.log(error);
      toast.error('Something Went Wrong');
    }
  }

  return (
    <>
      <Layout>
        <div className="container-fluid mt-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <UserMenu />
            </div>
            <div className="col-md-9">
              <h1 className='text-center'>Update Your Profile</h1>
              <form className='mt-3 w-75 m-auto' onSubmit={handleUpdate}>
                <div className="form-group m-2">
                  <input type="text" value={name} className="form-control" placeholder="Name" onChange={(e) => setname(e.target.value)} />
                </div>
                <div className="form-group m-2">
                  <input type="email" value={email} className="form-control" placeholder="Enter Email" disabled />
                </div>
                <div className="form-group m-2">
                  <input type="password" value={password} className="form-control" placeholder="New Password" onChange={(e) => setpassword(e.target.value)} />
                </div>
                <div className="form-group m-2">
                  <input type="text" value={phone} className="form-control" placeholder="Phone" onChange={(e) => setphone(e.target.value)} />
                </div>
                <div className="form-group m-2">
                  <input type="text" value={address} className="form-control" placeholder="Address" onChange={(e) => setaddress(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary m-2">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Profile
