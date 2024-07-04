import React from 'react'
import Layout from '../components/Layout/Layout'

const Contact = () => {
  return (
    <div>
      <Layout>
        <div className="m-4 p-3 position-relative">
          <div className="image">
            <img src="/contact.png" alt="Contact" />
          </div>
          <div className="privacy-text">
            <h1 className='text-center'>Contact Us</h1>
            <div>
              <p>We're here to help! If you have any questions, concerns, or feedback, feel free to get in touch with us. Our dedicated support team is available to assist you with any inquiries you may have.</p>
              <h4>Contact Information:</h4>
              <h6>Customer Service Email: <a href="mailto:ecommerce@gmail.com">support@example.com</a></h6>
              <h6>Customer Service Phone: +1 (800) 123-4567</h6>
              <h6>Business Hours: Monday to Friday, 9:00 AM to 5:00 PM (UTC-5)</h6>
              <h4>Our Location:</h4>
              <p><b>E-Commerce<br/>
                Laxmi Nagar, Tondapur<br/>
                  Jalgaon, Maharashtra, 424207<br/>
                    India</b></p>
                </div>
              </div>
            </div>
          </Layout>
        </div>
        )
}

        export default Contact
