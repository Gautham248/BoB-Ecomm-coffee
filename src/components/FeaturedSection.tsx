import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../data/collections';

gsap.registerPlugin(ScrollTrigger);

const FeaturedSection: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const products = getFeaturedProducts();

  useEffect(() => {
    gsap.fromTo('.featured-title',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.featured-carousel',
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

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

  const goToProduct = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleProductClick = () => {
    const currentProduct = products[currentIndex];
    navigate(`/product/${currentProduct.id}`);
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
    <section ref={sectionRef} className="relative py-20 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden min-h-screen flex items-center">
      {/* Decorative Pattern for Mobile */}
      <div className="absolute top-0 left-0 right-0 h-16 md:hidden">
        <div className="w-full h-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 opacity-20">
          <div className="w-full h-full bg-repeat-x" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M20 20l10-10v20l-10-10zm-10 0L0 10v20l10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="featured-title text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-light tracking-wider mb-6">
            EXPLORE OUR
            <br />
            PRODUCTS
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Some of the world's finest Arabica beans in the palm of your hand.
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="absolute top-8 right-8 flex space-x-2 z-20">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToProduct(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Carousel Container */}
        <div className="featured-carousel relative">
          <div ref={carouselRef} className="relative h-[600px] md:h-[700px] flex items-center justify-center">
            {/* Background Products */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center space-x-8 md:space-x-16">
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
                        transform: `translateX(${offset * 200}px) scale(${isActive ? 1 : 0.7})`,
                        filter: isActive ? 'blur(0px)' : 'blur(3px)',
                        opacity: Math.abs(offset) > 2 ? 0 : isActive ? 1 : 0.6
                      }}
                    >
                      <div 
                        className={`relative cursor-pointer transition-transform duration-300 ${
                          isActive ? 'hover:scale-105' : ''
                        }`}
                        onClick={isActive ? handleProductClick : undefined}
                      >
                        {/* Coffee Package */}
                        <div className="w-64 md:w-80 h-96 md:h-[480px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl overflow-hidden">
                          {/* Top Section */}
                          <div className="h-16 bg-gray-700 border-b border-gray-600 flex items-center justify-center">
                            <div className="flex space-x-1">
                              {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="w-1 h-1 bg-gray-500 rounded-full" />
                              ))}
                            </div>
                          </div>

                          {/* Brand Logo */}
                          <div className="py-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border-2 border-amber-500 rounded-full flex items-center justify-center">
                              <div className="text-amber-500 text-2xl font-serif">B</div>
                            </div>
                            <h3 className="text-amber-500 text-xl font-serif tracking-wider">
                              BEANS OF BODHI
                            </h3>
                          </div>

                          {/* Product Info */}
                          <div className="px-6">
                            <div className="bg-orange-500 text-black px-4 py-2 text-sm font-bold text-center mb-2">
                              SPECIALTY COFFEE
                            </div>
                            <div className="bg-orange-600 text-white px-4 py-2 text-sm font-bold text-center mb-4">
                              ESPRESSO & FILTER
                            </div>
                            <div className="text-center mb-6">
                              <h4 className="text-white text-lg font-medium mb-1">
                                {product.name}
                              </h4>
                              <p className="text-gray-400 text-sm">Western Ghats</p>
                            </div>

                            {/* Product Details Grid */}
                            <div className="grid grid-cols-3 gap-2 text-xs text-gray-300 mb-6">
                              <div className="text-center">
                                <div className="font-bold text-white">ORIGIN</div>
                                <div>India</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-white">ROAST</div>
                                <div className="flex justify-center space-x-1 mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div 
                                      key={i} 
                                      className={`w-2 h-2 rounded-full ${
                                        i < 3 ? 'bg-orange-500' : 'bg-gray-600'
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-white">ALTITUDE</div>
                                <div>1200m</div>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Illustration */}
                          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent">
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 text-xs">
                              <svg width="120" height="40" viewBox="0 0 120 40" className="opacity-50">
                                <path d="M10 30 Q20 20 30 30 T50 30 T70 30 T90 30 T110 30" 
                                      stroke="currentColor" 
                                      strokeWidth="1" 
                                      fill="none" />
                                <circle cx="60" cy="25" r="3" fill="currentColor" />
                                <path d="M55 20 L65 20 M60 15 L60 35" stroke="currentColor" strokeWidth="1" />
                              </svg>
                            </div>
                          </div>
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
              className="absolute left-4 md:left-8 z-30 w-12 h-12 md:w-16 md:h-16 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            <button
              onClick={nextProduct}
              disabled={isTransitioning}
              className="absolute right-4 md:right-8 z-30 w-12 h-12 md:w-16 md:h-16 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>

          {/* Product Name Display */}
          <div className="text-center mt-8">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">
              {products[currentIndex].name}
            </h3>
            <p className="text-gray-400 text-sm md:text-base">
              {products[currentIndex].price}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;