import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CartProvider } from './context/CartContext';
import { pixelPageView } from './utils/pixel'; // Meta Pixel — fire PageView on every route change
import Header from './components/Header';
import Footer from './components/Footer';
import StructuredData from './components/SEO/StructuredData';
import CartSidebar from './components/Cart/CartSidebar';
import BusinessSubscriptionEnquiry from './pages/BusinessSubscriptionEnquiry';
import NewsletterSection from './components/NewsletterSection';
// Pages
const Home = lazy(() => import('./pages/Home'));
const Product = lazy(() => import('./pages/Product'));
const NotFound = lazy(() => import('./pages/NotFound'));
const MovementProduct = lazy(() => import('./pages/MovementProduct'));
const OurStoryNew = lazy(() => import('./pages/OurStoryNew'));
const ShopAllPage = lazy(() => import('./pages/ShopAllPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const RefundAndReturns = lazy(() => import('./pages/RefundAndReturns'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));

gsap.registerPlugin(ScrollTrigger);

// ScrollToTop component to handle route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Set scroll restoration to manual to prevent browser's default behavior
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force immediate scroll to top with compatibility for all devices
    window.scrollTo(0, 0);

    // Kill all ScrollTrigger instances on route change
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Refresh ScrollTrigger after route change with a delay to ensure DOM is ready
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh(true); // true forces a recalculation of all positions
    }, 200);

    return () => clearTimeout(refreshTimer);
  }, [pathname]);

  return null;
}

// Simple loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function AppContent() {
  const [isLoading] = useState(false);
  const location = useLocation();

  // Meta Pixel — track every client-side navigation as a PageView
  useEffect(() => {
    pixelPageView();
  }, [location.pathname]);

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
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/movement" element={<MovementProduct />} />
                <Route path="/our-story" element={<OurStoryNew />} />
                <Route path="/store" element={<ShopAllPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/refund-and-return" element={<RefundAndReturns />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/business-enquiry" element={<BusinessSubscriptionEnquiry />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
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
  useEffect(() => {
    // Instead of using zoom which causes mobile scrolling issues,
    // we'll add a class to the html element that we can style with CSS
    document.documentElement.classList.add('app-scale');

    return () => {
      document.documentElement.classList.remove('app-scale');
    };
  }, []);

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