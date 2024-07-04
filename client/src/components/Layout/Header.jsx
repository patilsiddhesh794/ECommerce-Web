import React from 'react'
import '../../styles/Navbar.css'
import { NavLink, Link } from 'react-router-dom'
import { GiShoppingBag } from "react-icons/gi";
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory.jsx';
import { Badge } from 'antd';
import { useCart } from '../../context/cart.jsx';
import axios from 'axios';


const Header = () => {
  const { auth, setAuth } = useAuth();
  const {cart, setCart} = useCart();
  const categories = useCategory();

  const handleLogout = async() => {
    const {data} = await axios.post("http://localhost:8080/api/v1/auth/update-cart", {localCart: cart});
    setCart([]);
    localStorage.removeItem('cart');

    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logged Out Successfully");
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid nav-cont">
          <Link className="navbar-brand" to='/'><GiShoppingBag /> E-Commerce</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item mx-2">
              <SearchInput />
              </li>
              <li className="nav-item">
                <NavLink to="/" className="nav-link " >Home</NavLink>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                  Categories
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to={`/category`}>All Categories</Link></li>
                  {categories.map((c) => (
                    <li key={c._id}><NavLink className="dropdown-item" to={`/category/${c.slug}`}>{c.name}</NavLink></li>
                  ))}
                </ul>
              </li>
              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/Register">Register</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/Login">Login</NavLink>
                  </li>
                </>) : (
                <>
                  <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {auth.user.name}
                    </Link>
                    <ul className="dropdown-menu">
                      <li><NavLink className="dropdown-item" to={`/Dashboard/${auth.user.role === 1 ? 'admin' : 'user'}`}>Dashboard</NavLink></li>
                      <li><NavLink className="dropdown-item" onClick={handleLogout} to='/Login'>Logout</NavLink></li>
                    </ul>
                  </li>
                </>)}
                <li className="nav-item">
                    <NavLink className="nav-link" to="/contact">Contact</NavLink>
                  </li>
              <li className="nav-item">
                <Badge count={cart.length} showZero>  
                <NavLink className="nav-link" to="/Cart">Cart</NavLink>
                </Badge>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header
