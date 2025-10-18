import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import StructuredData from './components/SEO/StructuredData';
import CartSidebar from './components/Cart/CartSidebar';
import BusinessSubscriptionEnquiry from './pages/BusinessSubscriptionEnquiry';
// Pages
import Home from './pages/Home';
import Product from './pages/Product';
import OurStory from './pages/OurStory';
import NotFound from './pages/NotFound';
import Shop from './pages/Shop';
import NewsletterSection from './components/NewsletterSection';
import MovementPage from './pages/MovementPage';
import MovementProduct from './pages/MovementProduct';

gsap.registerPlugin(ScrollTrigger);

// ScrollToTop component to handle route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Kill all ScrollTrigger instances on route change
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Refresh ScrollTrigger after route change
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [isLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Page load animation
    gsap.fromTo('body', 
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );

    // Parallax effect for hero section (only if it exists)
    const heroElement = document.querySelector('.hero-bg');
    if (heroElement) {
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
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [location.pathname]);

  // Refresh ScrollTrigger when window resizes
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden w-full">
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
              {/* <Route path="/movement" element={<MovementPage />} /> */}
              <Route path="/movement" element={<MovementProduct />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/business-enquiry" element={<BusinessSubscriptionEnquiry />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          {/* Always render Newsletter Section */}
          <NewsletterSection key={location.pathname} />
          
          <Footer />
          
          {/* Cart Sidebar */}
          <CartSidebar />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;