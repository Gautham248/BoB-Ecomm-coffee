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
    <section ref={sectionRef} className="relative py-12 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden h-screen flex items-center">
      <div className="w-full px-6">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <h2 className="text-3xl md:text-5xl font-light tracking-wider">
            FEATURED PRODUCTS
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div ref={carouselRef} className="relative h-[480px] md:h-[550px] flex items-center justify-center">
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
                        <div className="w-56 md:w-80 h-80 md:h-[450px]">
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
              className="absolute left-2 md:left-8 z-30 w-10 h-10 md:w-16 md:h-16 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            <button
              onClick={nextProduct}
              disabled={isTransitioning}
              className="absolute right-2 md:right-8 z-30 w-10 h-10 md:w-16 md:h-16 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>

          {/* Product Name Display */}
          <div className="text-center mt-4">
            <h3 className="text-lg md:text-xl font-serif text-white mb-1">
              {products[currentIndex].name}
            </h3>
            <p className="text-gray-400 text-sm">
              {products[currentIndex].price}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;