import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { useNavigate } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AnnouncementBanner from './components/AnnouncementBanner';

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import Commercial from './pages/Commercial';
import Reviews from './pages/Reviews';
import About from './pages/About';
import ColorConsultation from './pages/ColorConsultation';
import Gallery from './pages/Gallery';
import FreeQuote from './pages/FreeQuote';
import ServiceAreas from './pages/ServiceAreas';
import InteriorPainting from './pages/InteriorPainting';
import ExteriorPainting from './pages/ExteriorPainting';
import PowerWashing from './pages/PowerWashing';
import StuccoRepair from './pages/StuccoRepair';
import VinylAluminum from './pages/VinylAluminum';
import DeckFence from './pages/DeckFence';
import CabinetRefinishing from './pages/CabinetRefinishing';
import WallpaperRemoval from './pages/WallpaperRemoval';
import TexturedWalls from './pages/TexturedWalls';
import WoodworkTrim from './pages/WoodworkTrim';
import FAQ from './pages/FAQ';
import ManageUsers from './pages/ManageUsers';
import ViewQuotes from './pages/ViewQuotes';
import MailQuoteUpdate from './pages/MailQuoteUpdate';
import BlockSlots from './pages/BlockSlots';

import "./styles/App.css";

// Helper component for auth redirects
function AuthRedirector() {
  const token = useSelector(state => state.auth?.token);
  const navigate = useNavigate();
  const prevToken = useRef(token);

  useEffect(() => {
    if (!prevToken.current && token) {
      navigate('/view-quotes', { replace: true });
    } else if (prevToken.current && !token) {
      navigate('/', { replace: true });
    }
    prevToken.current = token;
  }, [token, navigate]);
  return null;
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="App">
            <AuthRedirector />
            <ScrollToTop />
            <Header />
            
            <motion.main 
              className="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                {/* ... all your other routes ... */}
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/commercial" element={<Commercial />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/about" element={<About />} />
                <Route path="/color-consultation" element={<ColorConsultation />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/free-quote" element={<FreeQuote />} />
                <Route path="/service-areas" element={<ServiceAreas />} />
                <Route path="/interior-painting" element={<InteriorPainting />} />
                <Route path="/exterior-painting" element={<ExteriorPainting />} />
                <Route path="/power-washing" element={<PowerWashing />} />
                <Route path="/stucco-repair" element={<StuccoRepair />} />
                <Route path="/vinyl-aluminum" element={<VinylAluminum />} />
                <Route path="/deck-fence" element={<DeckFence />} />
                <Route path="/cabinet-refinishing" element={<CabinetRefinishing />} />
                <Route path="/wallpaper-removal" element={<WallpaperRemoval />} />
                <Route path="/textured-walls" element={<TexturedWalls />} />
                <Route path="/woodwork-trim" element={<WoodworkTrim />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/view-quotes" element={<ViewQuotes />} />
                <Route path="/block-slots" element={<BlockSlots />} />

                {/* --- UPDATED ROUTE --- */}
                {/* This path now captures the unique token from the email link */}
                <Route path="/mailquoteupdate/:token" element={<MailQuoteUpdate />} />

              </Routes>
            </motion.main>
            
            <AnnouncementBanner />
            <Footer />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;

