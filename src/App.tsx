import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider, AdminRouteGuard } from './context/AdminAuthContext';
import { seedCacheIfEmpty } from './services/seedService';
import { pixelPageView } from './utils/pixel';
import Header from './components/Header';
import Footer from './components/Footer';
import StructuredData from './components/SEO/StructuredData';
import CartSidebar from './components/Cart/CartSidebar';
import BusinessSubscriptionEnquiry from './pages/BusinessSubscriptionEnquiry';
import NewsletterSection from './components/NewsletterSection';

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

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const HeroManager = lazy(() => import('./pages/admin/HeroManager'));
const CollectionsManager = lazy(() => import('./pages/admin/CollectionsManager'));
const ProductsManager = lazy(() => import('./pages/admin/ProductsManager'));
const CatalogRegistry = lazy(() => import('./pages/admin/CatalogRegistry'));
const FeaturedManager = lazy(() => import('./pages/admin/FeaturedManager'));
const MovementManager = lazy(() => import('./pages/admin/MovementManager'));
const ReviewsManager = lazy(() => import('./pages/admin/ReviewsManager'));

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 200);
    return () => clearTimeout(refreshTimer);
  }, [pathname]);

  return null;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    pixelPageView();
  }, [location.pathname]);

  useEffect(() => {
    gsap.fromTo('body', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    const heroElement = document.querySelector('.hero-bg');
    if (heroElement) {
      gsap.to('.hero-bg', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-bg', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden w-full">
      <StructuredData type="organization" />
      <StructuredData type="website" />

      {!isLoading && (
        <>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded z-50"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="min-h-[calc(100vh-160px)]">
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </main>
          <NewsletterSection key={location.pathname} />
          <Footer />
          <CartSidebar />
        </>
      )}
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRouteGuard>
                <AdminDashboard />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/hero"
            element={
              <AdminRouteGuard>
                <HeroManager />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/collections"
            element={
              <AdminRouteGuard>
                <CollectionsManager />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRouteGuard>
                <ProductsManager />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/registry"
            element={
              <AdminRouteGuard>
                <CatalogRegistry />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/featured"
            element={
              <AdminRouteGuard>
                <FeaturedManager />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/movement"
            element={
              <AdminRouteGuard>
                <MovementManager />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminRouteGuard>
                <ReviewsManager />
              </AdminRouteGuard>
            }
          />
        </Routes>
      </Suspense>
    );
  }

  return (
    <PublicLayout>
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
    </PublicLayout>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('app-scale');
    seedCacheIfEmpty();
    return () => {
      document.documentElement.classList.remove('app-scale');
    };
  }, []);

  return (
    <HelmetProvider>
      <CartProvider>
        <AdminAuthProvider>
          <Router>
            <ScrollToTop />
            <AppRoutes />
          </Router>
        </AdminAuthProvider>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;
