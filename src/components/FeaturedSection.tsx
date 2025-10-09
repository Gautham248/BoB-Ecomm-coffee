import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../data/collections';

const FeaturedSection: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const products = getFeaturedProducts();

  const nextProduct = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevProduct = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
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

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextProduct();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  return (
    <section ref={sectionRef} className="relative py-8 md:py-12 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden h-screen flex items-center">
      <div className="w-full px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6 pt-2 md:pt-4">
          <h2 className="text-2xl md:text-5xl font-light tracking-wider">
            FEATURED PRODUCTS
          </h2>
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
            {/* Products Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                {products.map((product, index) => {
                  const offset = index - currentIndex;
                  const isActive = index === currentIndex;
                  
                  return (
                    <div
                      key={product.id}
                      className={`absolute transition-all duration-500 ease-out ${
                        isActive ? 'z-20' : 'z-10'
                      }`}
                      style={{
                        transform: `translateX(${offset * 320}px) scale(${isActive ? 1 : 0.65})`,
                        filter: isActive ? 'blur(0px)' : 'blur(4px)',
                        opacity: Math.abs(offset) > 2 ? 0 : isActive ? 1 : 0.4
                      }}
                    >
                      <div 
                        className={`relative cursor-pointer transition-transform duration-300 ${
                          isActive ? 'hover:scale-105' : ''
                        }`}
                        onClick={() => isActive && handleProductClick(product.id)}
                      >
                        {/* Coffee Package with actual product image */}
                        <div className="w-48 md:w-80 h-72 md:h-[450px]">
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

            {/* Navigation Arrows */}
            <button
              onClick={prevProduct}
              disabled={isTransitioning}
              className="absolute left-1 md:left-8 z-30 w-8 h-8 md:w-16 md:h-16 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </button>

            <button
              onClick={nextProduct}
              disabled={isTransitioning}
              className="absolute right-1 md:right-8 z-30 w-8 h-8 md:w-16 md:h-16 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </button>
          </div>

          {/* Product Name Display */}
          <div className="text-center mt-3 md:mt-4">
            <h3 className="text-xl md:text-3xl font-serif text-white mb-1 md:mb-2">
              {products[currentIndex].name}
            </h3>
            <p className="text-gray-400 text-base md:text-xl">
              {products[currentIndex].price}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;