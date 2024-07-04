import React from 'react'
import Layout from '../components/Layout/Layout'
import '../styles/privacy.css'

const Policy = () => {
  return (
    <>
      <Layout>
        <div className="m-4 p-3 position-relative">
          <div className="image">
            <img src="/privacy.png" alt="Privacy" />
          </div>
          <div className="privacy-text">
            <h1 className='text-center'>Privacy Policy</h1>
            <p>This Privacy Policy describes how we collects, uses, and discloses your personal information when you visit our website <strong>E-Commerce</strong> and make a purchase.
              This Privacy Policy was last updated on 08th April 2024.</p>
            <h4>Information We Collect</h4>
            <p>We collect several different types of information for various purposes to improve your experience on our Site and while placing an order.</p>
            <p>Device Information: We collect certain information automatically when you visit our Site. This information includes your device's IP address, browser type, internet service provider (ISP), referring/exit pages, and date/time stamps.</p>
            <p>Order Information: When you place an order through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card details), email address, and phone number.</p>
            <h4>How We Use Your Information</h4>
            <p>We use the Order Information we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we may use this Order Information to:</p>
            <ul>
              <li>Communicate with you about your order</li>
              <li>Screen our orders for potential risk or fraud</li>
              <li>When in line with the preferences you have shared, provide you with information or advertising related to our products or services</li>
            </ul>
            <p>We use the Device Information we collect to improve and optimize our Site (e.g., by generating analytics about how our customers browse and interact with the Site and to assess the success of our marketing and advertising campaigns).</p>
            <h4>Sharing Your Information</h4>
            <p>We share your Personal Information with third-party service providers who assist us in operating and providing the services offered through the Site. These third-party service providers are obligated to maintain the confidentiality of your information and are restricted from using it for any other purpose other than providing services to us.
              We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant, or other lawful requests for information we receive, or to protect our rights or property.</p>
            <h4>Security</h4>
            <p>We take reasonable precautions to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no internet transmission or electronic storage method is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Policy
