import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getFeaturedCollections } from '../services/adminService';
import type { Collection } from '../types/product';

// Mock GSAP functions for demonstration
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
const gsap = {
  utils: {
    toArray: (selector: string) => Array.from(document.querySelectorAll(selector))
  },
  fromTo: (_targets: any, _fromVars: any, _toVars: any) => { },
  to: (_targets: any, _toVars: any) => { }
};
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

interface CollectionsSectionProps {
  mobileCarouselItemWidth?: number; // Percentage (0-100) - default 70
  mobileCarouselSideOpacity?: number; // Opacity (0-1) - default 0.3
  mobileCarouselSideScale?: number; // Scale (0-1) - default 0.85
}

const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  mobileCarouselItemWidth = 70,
  mobileCarouselSideOpacity = 0.3,
  mobileCarouselSideScale = 0.85
}) => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const collections = getFeaturedCollections();

  // Create infinite loop by duplicating collections
  const infiniteCollections = [...collections, ...collections, ...collections];
  const startIndex = collections.length; // Start at the middle set

  // Calculate centering offset based on item width
  const centerOffset = (100 - mobileCarouselItemWidth) / 2;

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
    // Initialize to middle set for infinite loop
    if (itemsPerView === 1) {
      setCurrentSlide(startIndex);
    } else {
      setCurrentSlide(0);
    }
  }, [itemsPerView, startIndex]);

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
    if (collection.upcoming) return;
    navigate(`/store?category=${collection.id}`);
  };

  const handleShopAllClick = () => {
    navigate('/store');
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev - 1);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev + 1);
  };

  const goToSlide = (index: number) => {
    const maxSlide = collections.length - itemsPerView;
    setCurrentSlide(Math.min(index, maxSlide));
  };

  // Handle infinite loop reset
  useEffect(() => {
    if (itemsPerView !== 1) return;

    const handleTransitionEnd = () => {
      setIsTransitioning(false);

      // Reset to middle set when reaching boundaries
      if (currentSlide >= startIndex + collections.length) {
        setCurrentSlide(startIndex);
      } else if (currentSlide < startIndex) {
        setCurrentSlide(startIndex + collections.length - 1);
      }
    };

    const timer = setTimeout(handleTransitionEnd, 500);
    return () => clearTimeout(timer);
  }, [currentSlide, itemsPerView, startIndex, collections.length]);

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
    if (count === 1) return 'w-80 md:w-96';
    if (count === 2) return 'w-1/2 max-w-md px-6';
    if (count === 3) return 'w-1/3 max-w-sm px-6';
    if (count === 4) return 'w-1/4 max-w-sm px-6';
    if (count === 5) return 'w-1/5 max-w-sm px-4';
    if (count === 6) return 'w-1/6 max-w-sm px-4';
    return 'w-1/7 max-w-sm px-4';
  };

  const needsSlider = itemsPerView < collections.length;
  const isMobile = itemsPerView === 1;

  // Get current collection for display
  // const getCurrentCollection = () => {
  //   const index = currentSlide % collections.length;
  //   return collections[index];
  // };

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-gray-50 overflow-hidden w-full">
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
            isMobile ? (
              /* Mobile Infinite Carousel View */
              <>
                <div
                  className="relative overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div
                    ref={sliderRef}
                    className={`flex items-center ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                    style={{
                      transform: `translateX(calc(-${currentSlide * mobileCarouselItemWidth}% + ${centerOffset}%))`,
                    }}
                  >
                    {infiniteCollections.map((collection, index) => {
                      const isCenterSlide = index === currentSlide;
                      const distance = Math.abs(index - currentSlide);

                      return (
                        <div
                          key={`${collection.id}-${index}`}
                          className="flex-shrink-0 px-3"
                          style={{
                            width: `${mobileCarouselItemWidth}%`,
                          }}
                        >
                          <div
                            className={`collection-card group w-full max-w-md mx-auto ${collection.upcoming ? 'cursor-default' : 'cursor-pointer'
                              } transition-all duration-500`}
                            style={{
                              opacity: distance === 0 ? 1 : mobileCarouselSideOpacity,
                              transform: `scale(${distance === 0 ? 1 : mobileCarouselSideScale})`,
                            }}
                            onClick={() => isCenterSlide && handleCollectionClick(collection)}
                          >
                            {/* Collection Image */}
                            <div className="relative mb-3">
                              <img
                                src={collection.image}
                                alt={collection.name}
                                className={`w-full h-64 object-contain transition-transform duration-700 ${collection.upcoming ? 'group-hover:scale-100' : isCenterSlide ? 'group-hover:scale-105' : ''
                                  }`}
                                style={{
                                  filter: collection.upcoming
                                    ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.1)) grayscale(50%)'
                                    : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                                }}
                                loading="lazy"
                              />
                              <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 ${collection.upcoming ? 'opacity-0' : isCenterSlide ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
                                }`} />

                              {/* Upcoming Badge */}
                              {collection.upcoming && isCenterSlide && (
                                <div className="absolute top-3 right-3 bg-gray-900/90 text-white text-xs px-3 py-1 rounded-full font-medium">
                                  Coming Soon
                                </div>
                              )}

                              {/* Hover overlay - only for non-upcoming and center */}
                              {!collection.upcoming && isCenterSlide && (
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                  <div className="text-white font-medium text-sm px-3 py-2 border border-white/50 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-gray-900/70">
                                    View Collection
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Collection Info - Centered below slider - Only show for center item */}
                <div className="text-center px-2 mt-6">
                  <h3 className="text-base font-light text-gray-900 mb-1 tracking-wide leading-tight">
                    {infiniteCollections[currentSlide].name}
                  </h3>
                  <div className="flex items-center justify-center space-x-2">
                    {infiniteCollections[currentSlide].originalPrice && (
                      <span className="text-gray-500 line-through text-sm">
                        {infiniteCollections[currentSlide].originalPrice}
                      </span>
                    )}
                    <span className={`font-medium text-sm ${infiniteCollections[currentSlide].upcoming ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                      {infiniteCollections[currentSlide].price}
                    </span>
                  </div>
                </div>

                {/* Slider Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                  {collections.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(startIndex + index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${(currentSlide % collections.length) === index
                        ? 'bg-gray-900 scale-125'
                        : 'bg-gray-400 hover:bg-gray-600'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* Tablet Slider View */
              <>
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
                        className={`flex-shrink-0 px-6 ${itemsPerView === 2 ? 'w-1/2' : 'w-1/3'
                          }`}
                      >
                        <div
                          className={`collection-card group w-full max-w-md mx-auto ${collection.upcoming ? 'cursor-default' : 'cursor-pointer'
                            }`}
                          onClick={() => handleCollectionClick(collection)}
                        >
                          {/* Collection Image */}
                          <div className="relative mb-4">
                            <img
                              src={collection.image}
                              alt={collection.name}
                              className={`w-full h-72 object-cover transition-transform duration-700 ${collection.upcoming ? 'group-hover:scale-100' : 'group-hover:scale-105'
                                }`}
                              style={{
                                filter: collection.upcoming
                                  ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.1)) grayscale(50%)'
                                  : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                              }}
                              loading="lazy"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 ${collection.upcoming ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                              }`} />

                            {/* Upcoming Badge */}
                            {collection.upcoming && (
                              <div className="absolute top-3 right-3 bg-gray-900/90 text-white text-xs px-3 py-1 rounded-full font-medium">
                                Coming Soon
                              </div>
                            )}

                            {/* Hover overlay */}
                            {!collection.upcoming && (
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                <div className="text-white font-medium text-sm px-3 py-2 border border-white/50 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-gray-900/70">
                                  View Collection
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Collection Info */}
                          <div className="text-center px-2">
                            <h3 className="text-lg font-light text-gray-900 mb-2 tracking-wide leading-tight">
                              {collection.name}
                            </h3>
                            <div className="flex items-center justify-center space-x-2">
                              {collection.originalPrice && (
                                <span className="text-gray-500 line-through text-sm">
                                  {collection.originalPrice}
                                </span>
                              )}
                              <span className={`font-medium text-base ${collection.upcoming ? 'text-gray-500' : 'text-gray-900'
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

                {/* Navigation Arrows */}
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
                  <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: collections.length - itemsPerView + 1 }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                          ? 'bg-gray-900 scale-125'
                          : 'bg-gray-400 hover:bg-gray-600'
                          }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )
          ) : (
            /* Desktop Grid View */
            <div className={`flex flex-wrap items-center ${getDesktopGridClasses()} gap-y-12`}>
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className={`collection-card group ${getDesktopItemClasses()} ${collection.upcoming ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  onClick={() => handleCollectionClick(collection)}
                >
                  {/* Collection Image */}
                  <div className="relative mb-6 mx-auto">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className={`w-full h-56 sm:h-64 md:h-72 lg:h-80 object-contain transition-transform duration-700 ${collection.upcoming ? 'group-hover:scale-100' : 'group-hover:scale-105'
                        }`}
                      style={{
                        filter: collection.upcoming
                          ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.1)) grayscale(50%)'
                          : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                      }}
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 ${collection.upcoming ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                      }`} />

                    {/* Upcoming Badge */}
                    {collection.upcoming && (
                      <div className="absolute top-4 right-4 bg-gray-900/90 text-white text-sm px-4 py-2 rounded-full font-medium">
                        Coming Soon
                      </div>
                    )}

                    {/* Hover overlay */}
                    {!collection.upcoming && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-white font-medium text-base px-4 py-2 border border-white/50 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-gray-900/70">
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
                        <span className="text-gray-500 line-through text-sm">
                          {collection.originalPrice}
                        </span>
                      )}
                      <span className={`font-medium text-base ${collection.upcoming ? 'text-gray-500' : 'text-gray-900'
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