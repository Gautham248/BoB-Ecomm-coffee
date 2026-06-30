import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../services/adminService';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const products = getFeaturedProducts();
  
  // Create extended array with clones for seamless loop
  const extendedProducts = [
    products[products.length - 1], // Clone of last item at the beginning
    ...products,                    // Original items
    products[0]                     // Clone of first item at the end
  ];

  const nextProduct = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevProduct = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleProductClick = (productId: string | number) => {
    navigate(`/product/${productId}`);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextProduct();
    }
    if (isRightSwipe) {
      prevProduct();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Handle the seamless loop reset
  useEffect(() => {
    if (!isTransitioning) return;

    const transitionTimeout = setTimeout(() => {
      setIsTransitioning(false);

      // When we reach the cloned first item at the end, snap to real first item
      if (currentIndex === products.length + 1) {
        setCurrentIndex(1);
      }
      // When we reach the cloned last item at the beginning, snap to real last item
      else if (currentIndex === 0) {
        setCurrentIndex(products.length);
      }
    }, 500);

    return () => clearTimeout(transitionTimeout);
  }, [currentIndex, isTransitioning, products.length]);

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextProduct();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Get the actual product for display (accounting for clones)
  const getDisplayProduct = (index: number) => {
    if (index === 0) return products[products.length - 1];
    if (index === products.length + 1) return products[0];
    return products[index - 1];
  };

  const displayProduct = getDisplayProduct(currentIndex);

  return (
    <section ref={sectionRef} className="relative py-6 md:py-12 text-white overflow-hidden flex items-center" style={{ backgroundColor: 'rgb(16, 18, 22)' }}>
      {/* Faint horizontal line through background - behind images */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10 z-0"></div>
      
      <div className="w-full px-0">
        {/* Header with Navigation Arrows */}
        <div className="relative text-center mb-8 md:mb-16">
          <h2 className="text-base md:text-lg font-light tracking-widest uppercase">
            FEATURED PRODUCTS
          </h2>
          
          {/* Navigation Arrows - Top Right (desktop only) */}
          <div className="hidden md:flex absolute top-0 right-8 gap-3">
            <button
              onClick={prevProduct}
              disabled={isTransitioning}
              className="w-12 h-10 border border-white/30 rounded flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={nextProduct}
              disabled={isTransitioning}
              className="w-12 h-10 border border-white/30 rounded flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div 
            ref={carouselRef} 
            className="relative h-[450px] md:h-[600px] flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
           {/* Product Name - Positioned to the left */}
           <div className="absolute left-1/2 -translate-x-1/2 md:left-[12%] md:translate-x-0 lg:left-[25%] top-2 md:top-20 z-30 max-w-[210px] text-center md:text-left">
              <h3 
                key={currentIndex}
                className="text-3xl md:text-4xl lg:text-5xl font-pangaia text-white tracking-wide leading-tight animate-fade-in"
              >
                {displayProduct.title}
              </h3>
            </div>

            {/* Products Container */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                {extendedProducts.map((product, index) => {
                  const offset = index - currentIndex;
                  const isActive = index === currentIndex;
                  
                  return (
                    <div
                      key={`${product.id}-${index}`}
                      className={`absolute transition-all duration-500 ease-out ${
                        isActive ? 'z-20' : 'z-10'
                      }`}
                      style={{
                        transform: `translateX(${offset * 750}px) scale(${isActive ? 1 : 0.9})`,
                        opacity: Math.abs(offset) > 1 ? 0 : 1,
                        transition: isTransitioning ? 'all 0.5s ease-out' : 'none'
                      }}
                    >
                      <div 
                        className={`relative cursor-pointer transition-transform duration-300 ${
                          isActive ? 'hover:scale-105' : ''
                        }`}
                        onClick={() => isActive && handleProductClick(product.id)}
                      >
                        {/* Product Image */}
                        <div className="w-72 h-[400px] md:w-80 md:h-[500px] lg:w-[400px] lg:h-[550px]">
                          <img 
                            src={product.descriptionContent.image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Arrows - Below Product (mobile only) */}
          <div className="flex md:hidden justify-center gap-3 mt-1">
            <button
              onClick={prevProduct}
              disabled={isTransitioning}
              className="w-12 h-10 border border-white/30 rounded flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={nextProduct}
              disabled={isTransitioning}
              className="w-12 h-10 border border-white/30 rounded flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
       @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default FeaturedSection;