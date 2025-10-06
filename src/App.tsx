import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import StructuredData from './components/SEO/StructuredData';
import CartSidebar from './components/Cart/CartSidebar';

// Pages
import Home from './pages/Home';
import Product from './pages/Product';
import Movement from './pages/Movement';
import OurStory from './pages/OurStory';
import NotFound from './pages/NotFound';
import Shop from './pages/Shop';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Smooth scrolling
    gsap.registerPlugin(ScrollTrigger);
    
    // Page load animation
    gsap.fromTo('body', 
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' }
    );

    // Parallax effect for hero section
    gsap.to('.hero-bg', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-bg',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white text-black">
            {/* Global Structured Data */}
            <StructuredData type="organization" />
            <StructuredData type="website" />
            
            {!isLoading && (
              <>
                {/* Skip to main content link for accessibility */}
                <a 
                  href="#main-content" 
                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded z-50"
                >
                  Skip to main content
                </a>
                
                <Header />
                <main id="main-content" className="min-h-[calc(100vh-160px)]">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:productId" element={<Product />} />
                    {/* <Route path="/movement" element={<Movement />} /> */}
                    <Route path="/our-story" element={<OurStory />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                
                {/* Cart Sidebar */}
                <CartSidebar />
              </>
            )}
          </div>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;