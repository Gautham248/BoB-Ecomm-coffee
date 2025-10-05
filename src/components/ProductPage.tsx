import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import NewsletterSection from './NewsletterSection';
import AddToCartSection from './Cart/AddToCartSection';
import DarkHeroAddToCartSection from './Cart/DarkHeroAddToCartSection';

gsap.registerPlugin(ScrollTrigger);

interface ProductData {
  name: string;
  title: string;
  description: string;
  price: string;
  composition: string[];
  heroImage: string;
  heroImageMobile: string;
  galleryImages: string[];
  descriptionContent: {
    title: string;
    content: string;
    image: string;
  };
}

interface ProductPageProps {
  product: ProductData;
  onBackToHome: () => void;
  onProductClick: (productName: string) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onBackToHome }) => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Hero section animations
    gsap.fromTo('.product-hero-image',
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
    );

    gsap.fromTo('.product-hero-content',
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: 'power3.out' }
    );

    // Gallery animations
    gsap.fromTo('.gallery-item',
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Tab content animation
    gsap.fromTo('.tab-content',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.tab-content',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // const tabs = ['DESCRIPTION', 'MOVEMENT', 'REVIEW'];
  const tabs = ['DESCRIPTION'];

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setViewerIndex((prev) => (prev + 1) % product.galleryImages.length);
  };

  const prevImage = () => {
    setViewerIndex((prev) => (prev - 1 + product.galleryImages.length) % product.galleryImages.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isViewerOpen) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewerOpen]);

  return (
    <>
      {/* Hero Section - Fully Responsive */}
      <section ref={heroRef} className="relative w-full">
        {/* Mobile Layout - Image then Content Below */}
        <div className="block md:hidden">
          {/* Mobile Image */}
          <div className="relative w-full">
            <img
              src={product.heroImageMobile}
              alt={product.name}
              className="w-full h-auto product-hero-image"
            />
          </div>
          
          {/* Mobile Content Section - Below Image */}
          <div className="bg-black text-white px-4 py-8">
            <div className="product-hero-content space-y-4 max-w-xl mx-auto">
              <div>
                <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-amber-200 leading-tight">
                  {product.title}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-1 pt-2">
                {product.composition.map((item, index) => (
                  <p key={index} className="text-xs sm:text-sm text-white/80">
                    • {item}
                  </p>
                ))}
              </div>

              {/* Dark Hero Add to Cart Section */}
              <div className="pt-4">
                <DarkHeroAddToCartSection product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Content Overlay on Image */}
        <div className="hidden md:block relative">
          {/* Desktop Image */}
          <div className="relative w-full">
            <img
              src={product.heroImage}
              alt={product.name}
              className="w-full h-auto product-hero-image"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/60"></div>
          </div>

          {/* Desktop Content Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col">
            <div className="flex-1 flex items-center py-12">
              <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left: Empty space for image visibility */}
                  <div className="hidden lg:block"></div>

                  {/* Right: Product Information and Cart */}
                  <div className="product-hero-content text-white space-y-6 max-w-xl">
                    <div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-amber-200 leading-tight">
                        {product.title}
                      </h2>
                    </div>

                    <p className="text-base md:text-lg text-white/90 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="space-y-1 pt-2">
                      {product.composition.map((item, index) => (
                        <p key={index} className="text-sm md:text-base text-white/80">
                          • {item}
                        </p>
                      ))}
                    </div>

                    {/* Dark Hero Add to Cart Section */}
                    <div className="pt-4">
                      <DarkHeroAddToCartSection product={product} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Swipeable with Image Viewer */}
      <section ref={galleryRef} className="py-12 md:py-16 lg:py-20 bg-black">
        <div className="w-full">
          <div className="text-center mb-10 md:mb-14 lg:mb-16 px-4 sm:px-6 md:px-8">
            <p className="text-white text-xs sm:text-sm font-medium tracking-wider mb-3 md:mb-4">GALLERY</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white">{product.name.toUpperCase()}</h2>
          </div>

          {/* Swipeable Gallery Container */}
          <div className="relative w-full">
            <div 
              ref={scrollContainerRef}
              className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-4 justify-start md:justify-center px-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <style>
                {`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              {/* Spacer for mobile centering */}
              <div className="flex-shrink-0 w-[calc((100vw-280px)/2)] md:hidden" />
              
              {product.galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="gallery-item flex-shrink-0 snap-center relative group cursor-pointer overflow-hidden rounded-md md:rounded-lg w-[280px] h-[350px] md:w-[240px] md:h-[300px] lg:w-[260px] lg:h-[325px]"
                  onClick={() => openViewer(index)}
                >
                  <div className="w-full h-full">
                    <img
                      src={image}
                      alt={`${product.name} gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Plus className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Spacer for mobile centering */}
              <div className="flex-shrink-0 w-[calc((100vw-280px)/2)] md:hidden" />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center gap-2 mt-6 px-4">
            {product.galleryImages.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Full Screen Image Viewer */}
      {isViewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeViewer}
            className="absolute top-4 right-4 z-50 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-300"
            aria-label="Close viewer"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-50 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm font-medium">
              {viewerIndex + 1} / {product.galleryImages.length}
            </span>
          </div>

          {/* Previous Button */}
          {product.galleryImages.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Next Button */}
          {product.galleryImages.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-300"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Image Display - Centered Single Image */}
          <div className="relative w-full h-full flex items-center justify-center px-4 md:px-12 py-20">
            <img
              src={product.galleryImages[viewerIndex]}
              alt={`${product.name} ${viewerIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              key={viewerIndex}
            />
          </div>
        </div>
      )}

      {/* Tabs Section - Responsive */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Tab Navigation - Responsive */}
          <div className="flex justify-center mb-10 md:mb-14 lg:mb-16">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-xs sm:text-sm md:text-base font-medium transition-colors duration-300 ${
                    activeTab === tab
                      ? 'bg-black text-white'
                      : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content - Responsive */}
          <div className="tab-content">
            {activeTab === 'DESCRIPTION' && (
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 mb-6 md:mb-8 px-4">
                  {product.descriptionContent.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-8 md:mb-10 lg:mb-12 max-w-3xl mx-auto px-4">
                  {product.descriptionContent.content}
                </p>
                <div className="flex justify-center px-4">
                  <img
                    src={product.descriptionContent.image}
                    alt={product.name}
                    className="w-full max-w-sm md:max-w-md h-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'MOVEMENT' && (
              <div className="text-center px-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 mb-6 md:mb-8">
                  Our Movement
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  Every cup of {product.name} supports our mission to preserve the natural beauty of the Western Ghats. 
                  We work directly with local farmers and communities to ensure sustainable practices that protect 
                  both the environment and the livelihoods of those who call these mountains home.
                </p>
              </div>
            )}
            
            {activeTab === 'REVIEW' && (
              <div className="text-center px-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 mb-6 md:mb-8">
                  Customer Reviews
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  "{product.name} has become my daily ritual. The rich, complex flavors transport me to the misty mountains 
                  of the Western Ghats with every sip. It's more than just coffee - it's an experience."
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-3 md:mt-4">- Coffee Enthusiast</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
};

export default ProductPage;