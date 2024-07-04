import React from 'react'
import Header from './Header'
import Footer from './Footer'
import toast, { Toaster } from 'react-hot-toast';

const Layout = ({children}) => {
  return (
    <>
      <Header/>
        <main style={{ minHeight: "80vh" }}>{children}</main>
        <Toaster toastOptions={{
        success: {
          style: {
            background: 'green',
            borderRadius: '8px', // Adjust border radius as per your preference
            fontFamily: 'Arial, sans-serif', // Specify desired font family
            color: 'white', // Text color
          },
        },
        error: {
          style: {
            background: 'red',
            borderRadius: '8px', // Adjust border radius as per your preference
            fontFamily: 'Arial, sans-serif', // Specify desired font family
            color: 'white', // Text color
          },
        },
      }} />
      <Footer/>
    </>
  )
}

export default Layout
