import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheckCircle, FaTimes, FaSearch } from 'react-icons/fa';
import './ServiceAreas.css';

const counties = [
  {
    name: 'Washington County',
    cities: [
      'West Bend', 'Germantown', 'Hartford', 'Jackson'
    ]
  },
  {
    name: 'Ozaukee County',
    cities: [
      'Mequon', 'Cedarburg', 'Grafton', 'Port Washington', 'Thiensville'
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
    name: 'Milwaukee County',
    cities: [
      'Milwaukee', 'Wauwatosa', 'West Allis', 'Greenfield', 'Franklin', 'Oak Creek',
      'South Milwaukee', 'Shorewood', 'Whitefish Bay', 'Glendale', 'Brown Deer'
    ]
  },
  {
    name: 'Walworth County',
    cities: [
      'Mukwonago', 'Big Bend', 'East Troy', 'Burlington'
    ]
  },
  {
    name: 'Racine County',
    cities: [
      'Racine', 'Caledonia', 'Mount Pleasant', 'Sturtevant'
    ]
  },
  {
    name: 'Kenosha County',
    cities: [
      'Pleasant Prairie'
    ]
  }
];

const ServiceAreas = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = [];
    const searchTerm = query.toLowerCase().trim();

    counties.forEach(county => {
      county.cities.forEach(city => {
        if (city.toLowerCase().includes(searchTerm)) {
          results.push({
            city: city,
            county: county.name,
            isServed: true
          });
        }
      });
    });

    // Also check if the search term matches any county name
    counties.forEach(county => {
      if (county.name.toLowerCase().includes(searchTerm)) {
        county.cities.forEach(city => {
          if (!results.some(result => result.city === city)) {
            results.push({
              city: city,
              county: county.name,
              isServed: true
            });
          }
        });
      }
    });

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <div className="service-areas-page">
      <section className="service-areas-hero">
        <h1>Where We Paint: Proudly Serving Southeast Wisconsin</h1>
        <p className="service-areas-intro">
          At Painter Guys Pros, we're proud to bring premium painting services to homes and businesses across Milwaukee and Southeast Wisconsin.<br/>
          Search below to see if we serve your area, or browse our complete service area catalog.
        </p>
        
        <div className="hero-search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for a city or area..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="clear-search">
                <FaTimes />
              </button>
            )}
          </div>
          
          {showSearchResults && (
            <div className="search-results">
              {searchResults.length > 0 ? (
                <>
                  <h3>Search Results</h3>
                  <div className="results-list">
                    {searchResults.map((result, index) => (
                      <div key={index} className="result-item">
                        <div className="result-location">
                          <FaMapMarkerAlt className="result-icon" />
                          <span className="result-city">{result.city}</span>
                          <span className="result-county">({result.county})</span>
                        </div>
                        <div className="result-status">
                          <FaCheckCircle className="status-icon served" />
                          <span className="status-text">Service Available</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-results">
                  <h3>No Results Found</h3>
                  <p>We don't currently serve this area, but please contact us to check if we can accommodate your project!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="service-areas-catalog">
        <div className="catalog-container">
          <h2>Complete Service Area Catalog</h2>
          <p className="catalog-intro">
            Browse all counties and cities where we provide professional painting services
          </p>
          
          <div className="counties-grid">
            {counties.map((county) => (
              <div key={county.name} className="county-card">
                <div className="county-header">
                  <FaMapMarkerAlt className="county-icon" />
                  <h3>{county.name}</h3>
                </div>
                <div className="cities-list">
                  <h4>Cities We Serve:</h4>
                  <ul>
                    {county.cities.map((city) => (
                      <li key={city}>
                        <FaCheckCircle className="city-bullet" /> 
                        <span>{city}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="county-footer">
                  <span className="city-count">{county.cities.length} {county.cities.length === 1 ? 'city' : 'cities'} served</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="service-areas-cta-section">
        <h3>Not Sure If We Serve Your Area?</h3>
        <p>Contact us today — we're happy to confirm if your project falls within our service zone!</p>
        <Link to="/contact" className="btn btn-primary">
          Contact Us
        </Link>
      </section>
    </div>
  );
};

export default ServiceAreas; 