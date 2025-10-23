import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getFeaturedCollections, Collection } from '../data/collections';

// Mock GSAP functions for demonstration
const gsap = {
  utils: {
    toArray: (selector: string) => Array.from(document.querySelectorAll(selector))
  },
  fromTo: (targets: any, fromVars: any, toVars: any) => {},
  to: (targets: any, toVars: any) => {}
};

const CollectionsSection: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const collections = getFeaturedCollections();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(Math.min(3, collections.length));
      } else {
        setItemsPerView(collections.length);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collections.length]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [itemsPerView]);

  useEffect(() => {
    const cards = gsap.utils.toArray('.collection-card');
    
    gsap.fromTo('.collections-title',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    
    gsap.fromTo(cards,
      { y: 80, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: {
          amount: 0.6,
          from: "center"
        },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.shop-all-btn',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    cards.forEach((card) => {
      const cardElement = card as HTMLElement;
      
      cardElement.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      cardElement.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

  }, []);

  const handleCollectionClick = (collection: Collection) => {
    // Navigate to store page with category filter
    navigate(`/store?category=${collection.id}`);
  };

  const handleShopAllClick = () => {
    navigate('/store');
  };

  const goToPrevious = () => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : collections.length - itemsPerView);
  };

  const goToNext = () => {
    setCurrentSlide(prev => {
      const maxSlide = collections.length - itemsPerView;
      return prev < maxSlide ? prev + 1 : 0;
    });
  };

  const goToSlide = (index: number) => {
    const maxSlide = collections.length - itemsPerView;
    setCurrentSlide(Math.min(index, maxSlide));
  };

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
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const getDesktopGridClasses = () => {
    const count = collections.length;
    if (count === 1) return 'justify-center';
    return 'justify-between';
  };

  const getDesktopItemClasses = () => {
    const count = collections.length;
    if (count === 1) return 'w-64 md:w-80';
    if (count === 2) return 'w-1/2 max-w-sm px-2';
    if (count === 3) return 'w-1/3 max-w-xs px-1';
    if (count === 4) return 'w-1/4 max-w-xs px-1';
    if (count === 5) return 'w-1/5 max-w-xs px-1';
    if (count === 6) return 'w-1/6 max-w-xs px-1';
    return 'w-1/7 max-w-xs px-1';
  };

  const needsSlider = itemsPerView < collections.length;

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-gray-50 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="collections-title text-2xl md:text-4xl font-pangaia font-bold text-gray-900 tracking-wider">
            Our Collections
          </h2>
        </div>

        {/* Collections Container */}
        <div className="relative mb-8 md:mb-16">
          {needsSlider ? (
            /* Mobile/Tablet Slider View with Swipe */
            <>
              {/* Slider Container */}
              <div 
                className="overflow-hidden w-full"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  ref={sliderRef}
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${(currentSlide * 100) / itemsPerView}%)`
                  }}
                >
                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      className={`flex-shrink-0 px-2 ${
                        itemsPerView === 1 ? 'w-full' : 
                        itemsPerView === 2 ? 'w-1/2' : 
                        'w-1/3'
                      }`}
                    >
                      <div 
                        className={`collection-card group w-full max-w-xs mx-auto ${
                          collection.upcoming ? 'cursor-default' : 'cursor-pointer'
                        }`}
                        onClick={() => handleCollectionClick(collection)}
                      >
                        {/* Collection Image */}
                        <div className="relative mb-3 md:mb-4 overflow-hidden rounded-lg">
                          <img
                            src={collection.image}
                            alt={collection.name}
                            className={`w-full h-40 md:h-56 object-cover transition-transform duration-700 rounded-lg ${
                              collection.upcoming ? 'group-hover:scale-100' : 'group-hover:scale-110'
                            }`}
                            style={{
                              filter: collection.upcoming 
                                ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.1)) grayscale(50%)' 
                                : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                            }}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 rounded-lg ${
                            collection.upcoming ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                          }`} />
                          
                          {/* Upcoming Badge */}
                          {collection.upcoming && (
                            <div className="absolute top-3 right-3 bg-gray-900/90 text-white text-xs px-3 py-1 rounded-full font-medium">
                              Coming Soon
                            </div>
                          )}
                          
                          {/* Hover overlay - only for non-upcoming */}
                          {!collection.upcoming && (
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg backdrop-blur-sm flex items-center justify-center">
                              <div className="text-white font-medium text-xs md:text-sm px-3 py-2 border border-white/50 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                View Collection
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Collection Info */}
                        <div className="text-center px-2">
                          <h3 className="text-sm md:text-lg font-light text-gray-900 mb-1 md:mb-2 tracking-wide leading-tight">
                            {collection.name}
                          </h3>
                          <div className="flex items-center justify-center space-x-2">
                            {collection.originalPrice && (
                              <span className="text-gray-500 line-through text-xs md:text-sm">
                                {collection.originalPrice}
                              </span>
                            )}
                            <span className={`font-medium text-xs md:text-base ${
                              collection.upcoming ? 'text-gray-500' : 'text-gray-900'
                            }`}>
                              {collection.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows - Only show on tablet/desktop */}
              <button
                onClick={goToPrevious}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous collections"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>

              <button
                onClick={goToNext}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next collections"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>

              {/* Slider Indicators */}
              {collections.length > itemsPerView && (
                <div className="flex justify-center mt-6 md:mt-8 space-x-2">
                  {Array.from({ length: collections.length - itemsPerView + 1 }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-gray-900 scale-125' 
                          : 'bg-gray-400 hover:bg-gray-600'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Desktop Grid View - Even Distribution */
            <div className={`flex flex-wrap items-center ${getDesktopGridClasses()} gap-y-8`}>
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className={`collection-card group ${getDesktopItemClasses()} ${
                    collection.upcoming ? 'cursor-default' : 'cursor-pointer'
                  }`}
                  onClick={() => handleCollectionClick(collection)}
                >
                  {/* Collection Image */}
                  <div className="relative mb-4 md:mb-6 overflow-hidden rounded-lg mx-auto">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className={`w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover transition-transform duration-700 rounded-lg ${
                        collection.upcoming ? 'group-hover:scale-100' : 'group-hover:scale-110'
                      }`}
                      style={{
                        filter: collection.upcoming 
                          ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.1)) grayscale(50%)' 
                          : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 rounded-lg ${
                      collection.upcoming ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                    }`} />
                    
                    {/* Upcoming Badge */}
                    {collection.upcoming && (
                      <div className="absolute top-4 right-4 bg-gray-900/90 text-white text-xs md:text-sm px-4 py-2 rounded-full font-medium">
                        Coming Soon
                      </div>
                    )}
                    
                    {/* Hover overlay - only for non-upcoming */}
                    {!collection.upcoming && (
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg backdrop-blur-sm flex items-center justify-center">
                        <div className="text-white font-medium text-sm md:text-base px-4 py-2 border border-white/50 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          View Collection
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Collection Info */}
                  <div className="text-center px-2">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-gray-900 mb-2 tracking-wide leading-tight">
                      {collection.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-2">
                      {collection.originalPrice && (
                        <span className="text-gray-500 line-through text-xs md:text-sm">
                          {collection.originalPrice}
                        </span>
                      )}
                      <span className={`font-medium text-sm md:text-base ${
                        collection.upcoming ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {collection.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shop All Button */}
        <div className="text-center">
          <button
            onClick={handleShopAllClick}
            className="shop-all-btn inline-flex items-center justify-center px-6 md:px-12 py-2.5 md:py-4 border-2 border-gray-900 text-gray-900 font-medium tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-full text-sm md:text-base"
          >
            Shop All
          </button>
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;