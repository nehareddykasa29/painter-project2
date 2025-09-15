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
        <img src="/assets/commercial-hero.png" alt="Professional Commercial Painting" className="commercial-hero-img" />
        <div className="commercial-hero-overlay" />
        <div className="commercial-hero-content">
          <h1>Professional Painting for<br />Every Business</h1>
          <p>We deliver high-quality interior and exterior painting solutions that enhance your brand image with minimal disruption to your operations.</p>
          <Link to="/free-quote" className="btn btn-cta btn-large">Get Your Free Commercial</Link>
        </div>
      </section>

      {/* Your Business Deserves the Best Section */}
      <section className="business-deserves-best">
        <div className="business-deserves-container">
          <div className="business-deserves-content">
            <h2>Your Business Deserves the Best</h2>
            <p className="business-deserves-intro">We combine professional project management, flexible scheduling, and premium materials.</p>
            
            <div className="business-benefits">
              <div className="benefit-item">
                <h3>Minimal Disruption</h3>
                <p>Flexible scheduling, including evenings and weekends.</p>
              </div>
              <hr className="benefit-divider" />
              
              <div className="benefit-item">
                <h3>Professional Project Management</h3>
                <p>Clear communication & timelines.</p>
              </div>
              <hr className="benefit-divider" />
              
              <div className="benefit-item">
                <h3>Local Expertise</h3>
                <p>15+ years serving Southeast Wisconsin businesses.</p>
              </div>
            </div>
          </div>
          
          <div className="business-deserves-image">
            <img src="/assets/deck-and-fence-finishing.png" alt="Professional painters working on commercial building" />
          </div>
        </div>
      </section>

      {/* Comprehensive Painting Solutions Section */}
      <section className="comprehensive-solutions">
        <div className="comprehensive-container">
          <div className="comprehensive-header">
            <div className="comprehensive-text">
              <h2>Comprehensive Painting Solutions for Your Business</h2>
              <p>From offices to industrial facilities, we handle projects of every scale — with the same attention to detail that defines our work.</p>
            </div>
            <Link to="/services" className="btn btn-explore">
              Explore All <span className="arrow">→</span>
            </Link>
          </div>
          
          <div className="solutions-grid">
            <div className="solution-card">
              <div className="solution-image">
                <img src="/assets/office-building.png" alt="Office Buildings" />
              </div>
              <div className="solution-content">
                <h3>Office Buildings</h3>
                <p>Fresh, professional interiors and exteriors.</p>
                <Link to="/commercial/office" className="btn btn-view-service">View Service</Link>
              </div>
            </div>
            
            <div className="solution-card">
              <div className="solution-image">
                <img src="/assets/healthcare-facilities.png" alt="Healthcare Facilities" />
              </div>
              <div className="solution-content">
                <h3>Healthcare Facilities</h3>
                <p>Clean, hygienic finishes for hospitals and clinics.</p>
                <Link to="/commercial/healthcare" className="btn btn-view-service">View Service</Link>
              </div>
            </div>
            
            <div className="solution-card">
              <div className="solution-image">
                <img src="/assets/educational-institutions.png" alt="Educational Institutions" />
              </div>
              <div className="solution-content">
                <h3>Educational Institutions</h3>
                <p>Safe, durable coatings for schools and universities.</p>
                <Link to="/commercial/educational" className="btn btn-view-service">View Service</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="how-we-work">
        <div className="how-we-work-container">
          <h2>How We Work — Simple, Transparent, and On Time</h2>
          
          <div className="work-steps">
            <div className="work-step-card step-1">
              <div className="step-image">
                <img src="/assets/req.png" alt="Request Free Estimate" />
              </div>
              <div className="step-content">
                <h3>Request Your Free Estimate</h3>
                <p>Fill a quick form or call us to schedule your site visit.</p>
              </div>
            </div>
            
            <div className="work-step-card step-2">
              <div className="step-image">
                <img src="/assets/approve.png" alt="Approve Customized Proposal" />
              </div>
              <div className="step-content">
                <h3>Approve Your Customized Proposal</h3>
                <p>Clear timelines, costs, and scope</p>
              </div>
            </div>
            
            <div className="work-step-card step-3">
              <div className="step-image">
                <img src="/assets/transform.png" alt="Transform Your Space" />
              </div>
              <div className="step-content">
                <h3>Transform Your Space</h3>
                <p>Skilled painters complete the job</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* See How We Transform Section */}
      <section className="see-how-transform">
        <div className="transform-container">
          <div className="transform-header">
            <h2>See How We Transform</h2>
            <p>Browse our recent work to see the difference a professional paint job can make.</p>
          </div>
          
          <div className="transform-gallery">
            <div className="transform-card">
                              <img src="/assets/trans1.png" alt="Cafe/Restaurant Interior" />
            </div>
            <div className="transform-card">
                              <img src="/assets/trans2.png" alt="Modern Restaurant/Bar" />
            </div>
            <div className="transform-card">
                              <img src="/assets/trans3.png" alt="Modern Office Space" />
            </div>
            <div className="transform-card">
                              <img src="/assets/trans4.png" alt="Stylish Lounge/Restaurant" />
            </div>
            <div className="transform-card">
                              <img src="/assets/trans5.png" alt="Bright Office Hallway" />
            </div>
            <div className="transform-card">
                              <img src="/assets/trans6.png" alt="Rustic Coffee Shop" />
            </div>
          </div>
        </div>
      </section>

      {/* Let's Transform Section */}
      <section className="lets-transform">
        <div className="lets-transform-container">
          <div className="lets-transform-image">
            <img src="/assets/lets-transform.png" alt="Modern Office Interior" />
          </div>
          <div className="lets-transform-content">
            <h2>Let's Transform Your Business Space</h2>
            <p>Get in touch today for your free commercial painting estimate and color consultation.</p>
            <Link to="/free-quote" className="btn btn-book-now">
              Book Now <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      

      

   



 

   
    </div>
  );
};

export default Commercial; 