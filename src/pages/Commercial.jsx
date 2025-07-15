import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaStore, FaHospital, FaSchool, FaWarehouse, FaChurch, FaHotel, FaUtensils, FaIndustry, FaTools, FaPaintRoller, FaHardHat, FaShieldAlt, FaClock, FaCheckCircle, FaCalendarAlt, FaStar } from 'react-icons/fa';
import './Commercial.css';

const industries = [
  { icon: <FaBuilding />, title: 'Office Buildings', desc: 'Professional painting for corporate and business offices.' },
  { icon: <FaStore />, title: 'Retail Stores', desc: 'Enhance your brand and attract customers.' },
  { icon: <FaHospital />, title: 'Healthcare Facilities', desc: 'Clean, safe, and compliant painting for clinics and hospitals.' },
  { icon: <FaSchool />, title: 'Educational Institutions', desc: 'Bright, durable finishes for schools and universities.' },
  { icon: <FaWarehouse />, title: 'Warehouses & Industrial', desc: 'High-durability coatings for heavy-traffic spaces.' },
  { icon: <FaChurch />, title: 'Religious Organizations', desc: 'Respectful, detail-oriented service for places of worship.' },
  { icon: <FaHotel />, title: 'Hospitality & Hotels', desc: 'Create a welcoming, premium guest experience.' },
  { icon: <FaUtensils />, title: 'Restaurants & Food Service', desc: 'Hygienic, attractive finishes for dining spaces.' },
  { icon: <FaIndustry />, title: 'Property Management', desc: 'Reliable, scheduled painting for managed properties.' },
];

const addServices = [
  { icon: <FaPaintRoller />, title: 'High-Durability Coatings', desc: 'Protect high-traffic areas with advanced coatings.' },
  { icon: <FaTools />, title: 'Light Carpentry & Repairs', desc: 'Surface repairs and prep for a flawless finish.' },
  { icon: <FaHardHat />, title: 'Drywall Repair & Replacement', desc: 'Restore walls and ceilings to like-new condition.' },
  { icon: <FaIndustry />, title: 'Concrete Floor Coatings', desc: 'Durable, attractive floors for industrial spaces.' },
  { icon: <FaPaintRoller />, title: 'Power Washing & Prep', desc: 'Thorough cleaning and prep for lasting results.' },
  { icon: <FaCalendarAlt />, title: 'Maintenance Programs', desc: 'Scheduled painting to keep your property looking its best.' },
];

const whyChoose = [
  { icon: <FaClock />, title: 'Minimal Disruption', desc: 'Flexible scheduling — evenings, weekends, and fast turnarounds.' },
  { icon: <FaShieldAlt />, title: 'Licensed & Insured', desc: 'Full insurance and strict safety protocols for peace of mind.' },
  { icon: <FaCheckCircle />, title: 'Project Management', desc: 'Clear communication, detailed proposals, and on-time delivery.' },
  { icon: <FaHardHat />, title: 'Local Expertise', desc: '15+ years serving Southeast Wisconsin businesses.' },
];

const process = [
  { step: 1, icon: <FaCalendarAlt />, title: 'Site Assessment', desc: 'We evaluate your space and discuss your needs.' },
  { step: 2, icon: <FaTools />, title: 'Custom Proposal', desc: 'You get a detailed, tailored proposal and timeline.' },
  { step: 3, icon: <FaClock />, title: 'Flexible Scheduling', desc: 'We work around your business hours for minimal disruption.' },
  { step: 4, icon: <FaPaintRoller />, title: 'Professional Execution', desc: 'Our certified team delivers flawless results, on time.' },
];

const testimonial = {
  name: 'David Martinez',
  company: 'TechCorp Solutions',
  rating: 5,
  text: 'The Painter Guys Pros transformed our entire office space over the weekend. Professional, efficient, and the results exceeded our expectations. Highly recommend for any commercial project.'
};

const Commercial = () => {
  useEffect(() => {
    document.title = 'Commercial Painting | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Professional commercial painting for offices, retail, healthcare, and more. Minimal disruption, expert project management, and premium results.'
    );
  }, []);

  return (
    <div className="commercial-page">
      {/* Hero Section */}
      <section className="commercial-hero">
        <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80" alt="Commercial Painting" className="commercial-hero-img" />
        <div className="commercial-hero-overlay" />
        <div className="commercial-hero-content">
          <h1>Commercial Painting</h1>
          <p>Enhance your business image with professional painting solutions — minimal disruption, maximum impact.</p>
          <Link to="/free-quote" className="btn btn-cta btn-large">Get Free Estimate</Link>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="industries-section">
        <h2>Industries We Serve</h2>
        <div className="industries-grid">
          {industries.map((ind, idx) => (
            <div className="industry-card" key={idx}>
              <div className="industry-icon">{ind.icon}</div>
              <h3>{ind.title}</h3>
              <p>{ind.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="add-services-section">
        <h2>Additional Services</h2>
        <div className="add-services-scroller">
          {addServices.map((srv, idx) => (
            <div className="add-service-card" key={idx}>
              <div className="add-service-icon">{srv.icon}</div>
              <h4>{srv.title}</h4>
              <p>{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <h2>Why Choose Painter Guys Pros?</h2>
        <div className="why-choose-grid">
          {whyChoose.map((item, idx) => (
            <div className="why-card" key={idx}>
              <div className="why-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <h2>Our Process</h2>
        <div className="process-grid">
          {process.map((step, idx) => (
            <div className="process-card" key={idx}>
              <div className="process-step">{step.step}</div>
              <div className="process-icon">{step.icon}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="testimonial-card">
          <div className="testimonial-stars">
            {[...Array(testimonial.rating)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <p className="testimonial-text">“{testimonial.text}”</p>
          <div className="testimonial-author">
            <strong>{testimonial.name}</strong> <span>({testimonial.company})</span>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="commercial-final-cta">
        <h2>Ready to Transform Your Business?</h2>
        <p>Get a free, no-obligation quote for your commercial painting project today.</p>
        <Link to="/free-quote" className="btn btn-cta btn-large">Schedule Your Free Commercial Estimate</Link>
      </section>
    </div>
  );
};

export default Commercial; 