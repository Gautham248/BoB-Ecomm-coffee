import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedProducts = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);

  const products = [
    {
      id: 1,
      name: 'The Origin',
      image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800',
      link: '/origin'
    },
    {
      id: 2,
      name: 'Thunder Fuse',
      image: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800',
      link: '/thunder-fuse'
    },
    {
      id: 3,
      name: 'The High Tide',
      image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=800',
      link: '/high-tide'
    },
    {
      id: 4,
      name: 'The Wild Fire Rush',
      image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800',
      link: '/wild-fire-rush'
    },
    {
      id: 5,
      name: 'Tornado Twist',
      image: 'https://images.pexels.com/photos/1445416/pexels-photo-1445416.jpeg?auto=compress&cs=tinysrgb&w=800',
      link: '/tornado-twist'
    },
    {
      id: 6,
      name: 'The Eco Shock',
      image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
      link: '/eco-shock'
    }
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % products.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Get visible slides (previous, current, next)
  const getVisibleSlides = () => {
    const prevIndex = (activeIndex - 1 + products.length) % products.length;
    const nextIndex = (activeIndex + 1) % products.length;
    return [prevIndex, activeIndex, nextIndex];
  };

  const visibleIndices = getVisibleSlides();

  return (
    <section className="relative bg-[#1a1d23] py-16 px-4 overflow-hidden min-h-screen flex flex-col">
      {/* Header with Navigation */}
      <div className="max-w-7xl mx-auto w-full mb-12">
        <div className="flex justify-between items-center">
          <p className="text-white text-sm tracking-[0.3em] font-light">
            FEATURED PRODUCTS
          </p>
          
          {/* Navigation Arrows */}
          <div className="flex gap-4">
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="w-14 h-8 border border-white/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-black transition-all duration-300 relative overflow-hidden group disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-white translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
              <ChevronLeft className="w-5 h-5 relative z-10" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="w-14 h-8 border border-white/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-black transition-all duration-300 relative overflow-hidden group disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-white translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
              <ChevronRight className="w-5 h-5 relative z-10" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Layout */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-7xl mx-auto h-[600px]">
          <div className="relative h-full flex items-center justify-center">
            
            {/* Slides Container */}
            {products.map((product, index) => {
              const isActive = index === activeIndex;
              const isPrev = index === visibleIndices[0];
              const isNext = index === visibleIndices[2];
              const isVisible = isPrev || isActive || isNext;

              let position = 'translate-x-0';
              let zIndex = 0;
              let opacity = 0;

              if (isPrev) {
                position = '-translate-x-[450px]';
                zIndex = 1;
                opacity = 0.5;
              } else if (isActive) {
                position = 'translate-x-0';
                zIndex = 10;
                opacity = 1;
              } else if (isNext) {
                position = 'translate-x-[450px]';
                zIndex = 1;
                opacity = 0.5;
              }

              return (
                <div
                  key={product.id}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-800 ease-in-out ${position}`}
                  style={{
                    zIndex,
                    opacity: isVisible ? opacity : 0,
                    pointerEvents: isActive ? 'auto' : 'none'
                  }}
                >
                  {/* Product Name - Only show for active */}
                  {isActive && (
                    <div className={`mb-8 text-center transition-opacity duration-800 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                      <h3 className="text-white text-5xl font-serif">
                        {product.name}
                      </h3>
                    </div>
                  )}

                  {/* Product Image - Same size for all */}
                  <div className="relative mb-8">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[388px] h-auto object-contain transition-transform duration-500"
                      style={{
                        transform: isActive ? 'scale(1)' : 'scale(0.9)'
                      }}
                    />
                  </div>

                  {/* Discover Button - Only show for active */}
                  {isActive && (
                    <div className={`transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                      <button className="bg-transparent border border-white text-white px-10 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-[0.2em] uppercase">
                        Discover
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;