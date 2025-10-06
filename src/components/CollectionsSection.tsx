import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock GSAP functions for demonstration
const gsap = {
  utils: {
    toArray: (selector: string) => Array.from(document.querySelectorAll(selector))
  },
  fromTo: (targets: any, fromVars: any, toVars: any) => {},
  to: (targets: any, toVars: any) => {}
};

// Mock data for demonstration - replace with your actual getFeaturedCollections()
const mockCollections = [
  {
    id: '1',
    name: 'Western Ghats Selects',
    price: 'From ₹749',
    originalPrice: null,
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    products: ['product1']
  },
  {
    id: '2',
    name: 'Gadget Galaxy',
    price: 'From ₹6699',
    originalPrice: null,
    image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    products: ['product2']
  },
  {
    id: '3',
    name: 'Nitro Blends',
    price: 'From ₹779',
    originalPrice: null,
    image: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    products: ['product3']
  },
  {
    id: '4',
    name: 'Merchandise',
    price: 'From ₹599',
    originalPrice: null,
    image: 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    products: ['product4']
  },
  {
    id: '5',
    name: 'Premium Blends',
    price: 'From ₹899',
    originalPrice: null,
    image: 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    products: ['product5']
  }
];

const CollectionsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  
  const collections = mockCollections;

  const maxSlides = collections.length;

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

  const handleCollectionClick = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection && collection.products.length > 0) {
      // Navigate to product page
      window.location.href = `/product/${collection.products[0]}`;
    }
  };

  const handleShopAllClick = () => {
    // Navigate to shop page
    window.location.href = '/shop';
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
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="collections-title text-3xl md:text-4xl font-pangaia font-bold text-gray-900 tracking-wider">
            Our Collections
          </h2>
        </div>

        {/* Collections Container */}
        <div className="relative mb-16">
          {needsSlider ? (
            /* Mobile/Tablet Slider View */
            <>
              {/* Slider Container */}
              <div className="overflow-hidden">
                <div 
                  ref={sliderRef}
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${(currentSlide * 100) / itemsPerView}%)`
                  }}
                >
                  {collections.map((collection, index) => (
                    <div
                      key={collection.id}
                      className={`flex-shrink-0 px-2 ${
                        itemsPerView === 1 ? 'w-full' : 
                        itemsPerView === 2 ? 'w-1/2' : 
                        'w-1/3'
                      }`}
                    >
                      <div className="collection-card group cursor-pointer w-full max-w-sm mx-auto"
                           onClick={() => handleCollectionClick(collection.id)}
                           >
                        {/* Collection Image */}
                        <div className="relative mb-4 overflow-hidden rounded-lg">
                          <img
                            src={collection.image}
                            alt={collection.name}
                            className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-700 rounded-lg"
                            style={{
                              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                          
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg backdrop-blur-sm flex items-center justify-center">
                            <div className="text-white font-medium text-sm px-4 py-2 border border-white/50 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                              View Collection
                            </div>
                          </div>
                        </div>

                        {/* Collection Info */}
                        <div className="text-center px-2">
                          <h3 className="text-base md:text-lg font-light text-gray-900 mb-2 tracking-wide leading-tight">
                            {collection.name}
                          </h3>
                          <div className="flex items-center justify-center space-x-2">
                            {collection.originalPrice && (
                              <span className="text-gray-500 line-through text-sm">
                                {collection.originalPrice}
                              </span>
                            )}
                            <span className="text-gray-900 font-medium text-sm md:text-base">
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
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous collections"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
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
              {collections.map((collection, index) => (
                <div
                  key={collection.id}
                  className={`collection-card group cursor-pointer ${getDesktopItemClasses()}`}
                  onClick={() => handleCollectionClick(collection.id)}
                >
                  {/* Collection Image */}
                  <div className="relative mb-4 md:mb-6 overflow-hidden rounded-lg mx-auto">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-700 rounded-lg"
                      style={{
                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    
                    {/* Hover overlay with subtle animation */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg backdrop-blur-sm flex items-center justify-center">
                      <div className="text-white font-medium text-sm md:text-base px-4 py-2 border border-white/50 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        View Collection
                      </div>
                    </div>
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
                      <span className="text-gray-900 font-medium text-sm md:text-base">
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
            // onClick={handleShopAllClick}
            className="shop-all-btn inline-flex items-center justify-center px-8 md:px-12 py-3 md:py-4 border-2 border-gray-900 text-gray-900 font-medium tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-full text-sm md:text-base"
          >
            Shop All
          </button>
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;