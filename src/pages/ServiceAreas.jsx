import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCheckCircle, FaTimes, FaSearch } from 'react-icons/fa';
import './ServiceAreas.css';

const counties = [
  {
    name: 'Washington County',
    cities: [
      'West Bend', 'Germantown', 'Hartford', 'Jackson'
    ],
    path: "M 20 20 L 80 20 L 80 60 L 20 60 Z",
    color: "#87CEEB"
  },
  {
    name: 'Ozaukee County',
    cities: [
      'Mequon', 'Cedarburg', 'Grafton', 'Port Washington', 'Thiensville'
    ],
    path: "M 80 20 L 140 20 Q 150 25 150 30 Q 150 35 150 40 Q 150 45 150 50 Q 150 55 150 60 L 80 60 Z",
    color: "#4682B4"
  },
  {
    name: 'Waukesha County',
    cities: [
      'Waukesha', 'Brookfield', 'New Berlin', 'Pewaukee', 'Hartland', 'Sussex',
      'Muskego', 'Delafield', 'Oconomowoc', 'Menomonee Falls'
    ],
    path: "M 20 60 L 80 60 L 80 120 L 20 120 Z",
    color: "#4682B4"
  },
  {
    name: 'Milwaukee County',
    cities: [
      'Milwaukee', 'Wauwatosa', 'West Allis', 'Greenfield', 'Franklin', 'Oak Creek',
      'South Milwaukee', 'Shorewood', 'Whitefish Bay', 'Glendale', 'Brown Deer'
    ],
    path: "M 80 60 L 140 60 Q 150 65 150 70 Q 150 75 150 80 Q 150 85 150 90 Q 150 95 150 100 Q 150 105 150 110 Q 150 115 150 120 L 80 120 Z",
    color: "#87CEEB"
  },
  {
    name: 'Walworth County',
    cities: [
      'Mukwonago', 'Big Bend', 'East Troy', 'Burlington'
    ],
    path: "M 20 120 L 80 120 L 80 200 L 20 200 Z",
    color: "#87CEEB"
  },
  {
    name: 'Racine County',
    cities: [
      'Racine', 'Caledonia', 'Mount Pleasant', 'Sturtevant'
    ],
    path: "M 80 120 L 140 120 Q 150 125 150 130 Q 150 135 150 140 Q 150 145 150 150 Q 150 155 150 160 Q 150 165 150 170 Q 150 175 150 180 Q 150 185 150 190 Q 150 195 150 200 L 80 200 Z",
    color: "#87CEEB"
  },
  {
    name: 'Kenosha County',
    cities: [
      'Pleasant Prairie'
    ],
    path: "M 80 200 L 140 200 Q 150 205 150 210 Q 150 215 150 220 Q 150 225 150 230 Q 150 235 150 240 L 80 240 Z",
    color: "#4682B4"
  }
];

const ServiceAreas = () => {
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleCountyClick = (county, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
    setSelectedCounty(county);
  };

  const closePopup = () => {
    setSelectedCounty(null);
  };

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
        <FaMapMarkerAlt className="service-area-icon" />
        <h1>Where We Paint: Proudly Serving Southeast Wisconsin</h1>
        <p className="service-areas-intro">
          At Painter Guys Pros, we're proud to bring premium painting services to homes and businesses across Milwaukee and Southeast Wisconsin.<br/>
          Click on any county below to see the cities we serve in that area.
        </p>
      </section>

      <section className="search-section">
        <div className="search-container">
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

      <section className="interactive-map-section">
        <div className="map-container">
          <div className="map-title">WISCONSIN</div>
          <svg 
            viewBox="0 0 180 260" 
            className="wisconsin-map"
            style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
          >
            {/* Lake Michigan border */}
            <path 
              d="M 140 20 Q 160 25 160 30 Q 160 35 160 40 Q 160 45 160 50 Q 160 55 160 60 Q 160 65 160 70 Q 160 75 160 80 Q 160 85 160 90 Q 160 95 160 100 Q 160 105 160 110 Q 160 115 160 120 Q 160 125 160 130 Q 160 135 160 140 Q 160 145 160 150 Q 160 155 160 160 Q 160 165 160 170 Q 160 175 160 180 Q 160 185 160 190 Q 160 195 160 200 Q 160 205 160 210 Q 160 215 160 220 Q 160 225 160 230 Q 160 235 160 240" 
              stroke="#4A90E2" 
              strokeWidth="2" 
              fill="none" 
              strokeDasharray="5,5"
            />
            <text x="170" y="130" className="lake-label">LAKE MICHIGAN</text>
            
            {/* County boundaries */}
            {counties.map((county, index) => (
              <g key={county.name}>
                <path
                  d={county.path}
                  fill={county.color}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="county-path"
                  onClick={(e) => handleCountyClick(county, e)}
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x={county.path.includes('20 20') ? 50 : county.path.includes('80 20') ? 110 : 
                     county.path.includes('20 60') ? 50 : county.path.includes('80 60') ? 110 :
                     county.path.includes('20 120') ? 50 : county.path.includes('80 120') ? 110 : 110}
                  y={county.path.includes('20') ? 40 : county.path.includes('60') ? 90 : 
                     county.path.includes('120') ? 160 : county.path.includes('200') ? 220 : 220}
                  className="county-label"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {county.name.split(' ')[0]}
                </text>
              </g>
            ))}
          </svg>

          {/* Popup */}
          {selectedCounty && (
            <div 
              className="county-popup"
              style={{
                left: `${popupPosition.x}px`,
                top: `${popupPosition.y}px`
              }}
            >
              <div className="popup-header">
                <h3>{selectedCounty.name}</h3>
                <button className="popup-close" onClick={closePopup}>
                  <FaTimes />
                </button>
              </div>
              <div className="popup-content">
                <h4>Cities We Serve:</h4>
                <ul>
                  {selectedCounty.cities.map((city) => (
                    <li key={city}>
                      <FaCheckCircle className="city-bullet" /> {city}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
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