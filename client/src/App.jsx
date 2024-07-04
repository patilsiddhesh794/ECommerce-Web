
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import About from './pages/About'
import Contact from './pages/Contact'
import Policy from './pages/Policy'
import PageNotFound from './pages/PageNotFound'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Dashboard from './pages/user/Dashboard'
import PrivateRoute from './components/Routes/Private'
import ForgotPassword from './pages/auth/ForgotPassword'
import AdminRoute from './components/Routes/AdminPrivate'
import AdminDashboard from './pages/Admin/AdminDashboard'
import CreateCategory from './pages/Admin/CreateCategory'
import CreateProduct from './pages/Admin/CreateProduct'
import Users from './pages/Admin/Users'
import Profile from './pages/user/Profile'
import Orders from './pages/user/Orders'
import Products from './pages/Admin/Products'
import UpdateProduct from './pages/Admin/UpdateProduct'
import Search from './pages/Search'
import ProductDetail from './pages/ProductDetail'
import Category from './pages/Category'
import CategoryProduct from './pages/CategoryProduct'
import CartPage from './pages/CartPage'
import AllOrders from './pages/Admin/AllOrders'

function App() {

  return (
    <>
      <Routes>
        <Route path='/Register' element={<Register />} />
        <Route path='/search' element={<Search/>} />
        <Route path='/category' element={<Category/>} />
        <Route path='/category/:slug' element={<CategoryProduct/>} />
        <Route path='/product/:slug' element={<ProductDetail/>} />
        <Route path='/Dashboard' element={<PrivateRoute />}>
          <Route path='user' element={<Dashboard />} />
          <Route path='user/profile' element={<Profile />} />
          <Route path='user/orders' element={<Orders />} />
        </Route>
        <Route path='/Dashboard' element={<AdminRoute />}>
          <Route path='admin' element={<AdminDashboard />} />
          <Route path='admin/create-category' element={<CreateCategory />} />
          <Route path='admin/create-product' element={<CreateProduct />} />
          <Route path='admin/products' element={<Products />} />
          <Route path='admin/product/:slug' element={<UpdateProduct />} />
          <Route path='admin/users' element={<Users />} />
          <Route path='admin/all-orders' element={<AllOrders />} />
        </Route>
        <Route path='/Login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/Cart' element={<CartPage />} />
        <Route path='/About' element={<About />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='/Policy' element={<Policy />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
