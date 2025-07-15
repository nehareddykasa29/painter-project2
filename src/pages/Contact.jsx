import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin
} from 'react-icons/fa';
import ContactForm from '../components/ContactForm';
import './Contact.css';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Phone',
      details: ['(123) 456-7890', 'Mon-Fri: 8AM-6PM', 'Sat: 9AM-4PM'],
      action: 'tel:+1234567890'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      details: ['info@paintguyspros.com', 'quotes@paintguyspros.com', '24/7 Response'],
      action: 'mailto:info@paintguyspros.com'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Service Area',
      details: ['25 miles from city center', 'Free estimates', 'Licensed & Insured'],
      action: '/service-areas'
    },
    {
      icon: <FaClock />,
      title: 'Business Hours',
      details: ['Monday - Friday: 8AM - 6PM', 'Saturday: 9AM - 4PM', 'Sunday: Closed'],
      action: null
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, url: '#', label: 'Facebook' },
    { icon: <FaTwitter />, url: '#', label: 'Twitter' },
    { icon: <FaInstagram />, url: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, url: '#', label: 'LinkedIn' }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Contact Us</h1>
            <p>Ready to transform your space? Get in touch with our expert team today.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <motion.div
              className="contact-form-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="section-header">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>
              <ContactForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="contact-info-section"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="section-header">
                <h2>Get in Touch</h2>
                <p>Multiple ways to reach our professional painting team.</p>
              </div>

              <div className="contact-cards">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    className="contact-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="contact-card-icon">
                      {info.icon}
                    </div>
                    <div className="contact-card-content">
                      <h3>{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex}>{detail}</p>
                      ))}
                      {info.action && (
                        <a 
                          href={info.action} 
                          className="contact-link"
                        >
                          {info.action.startsWith('tel:') ? 'Call Now' :
                           info.action.startsWith('mailto:') ? 'Send Email' :
                           'View Details'}
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Media */}
              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      className="social-link"
                      aria-label={social.label}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="emergency-contact section bg-primary">
        <div className="container">
          <motion.div
            className="emergency-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2>Need Emergency Service?</h2>
            <p>We offer emergency painting services for urgent situations. Available 24/7 for commercial clients.</p>
            <div className="emergency-buttons">
              <a href="tel:+1234567890" className="btn btn-cta btn-large">
                Call Emergency Line
              </a>
              <a href="/free-quote" className="btn btn-outline btn-large">
                Request Urgent Quote
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="faq-preview section">
        <div className="container">
          <motion.div
            className="faq-preview-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions about our services.</p>
            
            <div className="faq-quick-list">
              <div className="faq-quick-item">
                <h4>How quickly can you start my project?</h4>
                <p>We typically can start within 1-2 weeks of your approval, depending on the scope and season.</p>
              </div>
              <div className="faq-quick-item">
                <h4>Do you provide free estimates?</h4>
                <p>Yes! All estimates are completely free with no obligation. We'll visit your property and provide a detailed quote.</p>
              </div>
              <div className="faq-quick-item">
                <h4>What's included in your warranty?</h4>
                <p>We offer a 2-year limited workmanship warranty covering any application defects or issues.</p>
              </div>
            </div>
            
            <div className="text-center">
              <a href="/about#faq" className="btn btn-primary">
                View All FAQs
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 