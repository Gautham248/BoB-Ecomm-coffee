import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, X, ChevronLeft, ChevronRight, MapPin, Mountain, Droplet } from 'lucide-react';
import DarkHeroAddToCartSection from './Cart/DarkHeroAddToCartSection';
import YouMayAlsoLike from './YouMayAlsoLike';
import { Product } from '../data/collections';

gsap.registerPlugin(ScrollTrigger);

interface ProductPageProps {
  product: Product;
  onBackToHome: () => void;
  onProductClick: (productId: string) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onProductClick }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('TRACEABILITY');
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);
  }, [product.name]);

  useEffect(() => {
    gsap.fromTo('.product-hero-image',
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
    );

    gsap.fromTo('.product-hero-content',
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: 'power3.out' }
    );

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

  const tabs = ['TRACEABILITY','DESCRIPTION',  'REVIEW'];

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
  }, [isViewerOpen, product.galleryImages.length]);

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
                <h2 className="text-2xl sm:text-3xl font-pangaia font-bold tracking-wide leading-tight">
                  {product.title}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {product.traceability?.tasteNotes?.map((note, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs sm:text-sm text-white/90"
                  >
                    {note}
                  </span>
                )) || null}
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
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-pangaia font-bold tracking-wide leading-tight">
                        {product.title}
                      </h2>
                    </div>

                    <p className="text-base md:text-lg text-white/90 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="space-y-3 pt-2">
                      <p className="text-xs sm:text-sm font-medium text-white/70 tracking-wider uppercase">Tasting Notes</p>
                      <div className="flex flex-wrap gap-2">
                        {product.traceability?.tasteNotes?.map((note, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm md:text-base text-white/90"
                          >
                            {note}
                          </span>
                        )) || null}
                      </div>
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-helvetica text-white">{product.name.toUpperCase()}</h2>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
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
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-pangaia font-bold text-gray-900 mb-6 md:mb-8 px-4">
                  {product.descriptionContent.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 font-helvetica leading-relaxed mb-8 md:mb-10 lg:mb-12 max-w-3xl mx-auto px-4">
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
            
            {activeTab === 'TRACEABILITY' && (
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10 md:mb-12 px-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-pangaia font-bold text-gray-900 mb-4">
                    KNOW YOUR COFFEE
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 font-helvetica max-w-2xl mx-auto">
                    {product.name} sourced from the finest estates in the Western Ghats
                  </p>
                </div>

                {/* Traceability Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
                  {/* Source Card */}
                  <div className="bg-[#f5f0e8] p-6 md:p-8 rounded-lg border-b-4 border-gray-900 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-gray-900" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <h4 className="text-xs font-medium tracking-wider text-gray-600 mb-2">SOURCE</h4>
                    <p className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                      {product.traceability.source}
                    </p>
                  </div>

                  {/* Elevation Card */}
                  <div className="bg-[#f5f0e8] p-6 md:p-8 rounded-lg border-b-4 border-gray-900 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Mountain className="w-6 h-6 text-gray-900" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <h4 className="text-xs font-medium tracking-wider text-gray-600 mb-2">ELEVATION</h4>
                    <p className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                      {product.traceability.elevation}
                    </p>
                  </div>

                  {/* Process Card */}
                  <div className="bg-[#f5f0e8] p-6 md:p-8 rounded-lg border-b-4 border-gray-900 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Droplet className="w-6 h-6 text-gray-900" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <h4 className="text-xs font-medium tracking-wider text-gray-600 mb-2">PROCESS</h4>
                    <p className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                      {product.traceability.process}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'REVIEW' && (
              <div className="text-center px-4 max-w-4xl mx-auto">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-pangaia font-bold text-gray-900 mb-8 md:mb-10">
                  Customer Reviews
                </h3>
                
                {/* Placeholder Review Structure */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed italic mb-4">
                    "{product.name} has become my daily ritual. The rich, complex flavors transport me to the misty mountains 
                    of the Western Ghats with every sip. It's more than just coffee - it's an experience."
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">- Coffee Enthusiast</p>
                </div>

                <div className="mt-8 text-gray-500">
                  <p className="text-sm">More reviews coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* You May Also Like Section */}
      <YouMayAlsoLike 
        currentProductId={product.id}
        onProductClick={onProductClick}
        maxProducts={4}
      />
    </>
  );
};

export default ProductPage;