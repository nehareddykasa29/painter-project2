import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import './ServiceAreas.css';

const counties = [
  {
    name: 'Milwaukee County',
    cities: [
      'Milwaukee', 'Wauwatosa', 'West Allis', 'Greenfield', 'Franklin', 'Oak Creek',
      'South Milwaukee', 'Shorewood', 'Whitefish Bay', 'Glendale', 'Brown Deer'
    ]
  },
  {
    name: 'Waukesha County',
    cities: [
      'Waukesha', 'Brookfield', 'New Berlin', 'Pewaukee', 'Hartland', 'Sussex',
      'Muskego', 'Delafield', 'Oconomowoc', 'Menomonee Falls'
    ]
  },
  {
    name: 'Ozaukee County',
    cities: [
      'Mequon', 'Cedarburg', 'Grafton', 'Port Washington', 'Thiensville'
    ]
  },
  {
    name: 'Washington County',
    cities: [
      'West Bend', 'Germantown', 'Hartford', 'Jackson'
    ]
  },
  {
    name: 'Racine & Kenosha County (Partial Coverage)',
    cities: [
      'Racine', 'Caledonia', 'Mount Pleasant', 'Sturtevant', 'Pleasant Prairie'
    ]
  },
  {
    name: 'Other Communities',
    cities: [
      'Mukwonago', 'Big Bend', 'East Troy', 'Burlington'
    ]
  }
];

const ServiceAreas = () => (
  <div className="service-areas-page">
    <section className="service-areas-hero">
      <FaMapMarkerAlt className="service-area-icon" />
      <h1>Where We Paint: Proudly Serving Southeast Wisconsin</h1>
      <p className="service-areas-intro">
        At Painter Guys Pros, we’re proud to bring premium painting services to homes and businesses across Milwaukee and Southeast Wisconsin.<br/>
        We offer residential and commercial painting throughout Milwaukee County, Waukesha County, Ozaukee County, Washington County, and parts of Racine and Kenosha Counties — all within about 40 miles of Milwaukee.
      </p>
    </section>
    <section className="service-areas-list-section">
      <div className="service-areas-list">
        {counties.map((county) => (
          <div className="service-area-county" key={county.name}>
            <h2>{county.name}</h2>
            <ul>
              {county.cities.map((city) => (
                <li key={city}><FaCheckCircle className="city-bullet" /> {city}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
    <section className="service-areas-cta-section">
      <h3>Not Sure If We Serve Your Area?</h3>
      <p>Contact us today — we’re happy to confirm if your project falls within our service zone!</p>
      <Link to="/contact" className="btn btn-primary">
        Contact Us
      </Link>
    </section>
  </div>
);

export default ServiceAreas; 