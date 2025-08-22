import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

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
import "./styles/App.css";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="App">
            <ScrollToTop />
            <Header />
            
            <motion.main 
              className="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
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
              </Routes>
            </motion.main>

            {/* Announcement Banner above Footer */}
            <AnnouncementBanner />
            
            <Footer />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
