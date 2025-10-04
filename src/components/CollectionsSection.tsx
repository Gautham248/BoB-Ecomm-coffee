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
    image: 'src/assets/images/Origin_1-p-1080.png',
    products: ['product1']
  },
  {
    id: '2',
    name: 'Gadget Galaxy',
    price: 'From ₹6699',
    originalPrice: null,
    image: 'src/assets/images/Origin_1-p-1080.png',
    products: ['product2']
  },
  {
    id: '3',
    name: 'Nitro Blends',
    price: 'From ₹779',
    originalPrice: null,
    image: 'src/assets/images/Origin_1-p-1080.png',
    products: ['product3']
  },
  {
    id: '4',
    name: 'Merchandise',
    price: 'From ₹599',
    originalPrice: null,
    image: 'src/assets/images/Origin_1-p-1080.png',
    products: ['product4']
  },
  {
    id: '5',
    name: 'Premium Blends',
    price: 'From ₹899',
    originalPrice: null,
    image: 'src/assets/images/Origin_1-p-1080.png',
    products: ['product5']
  },
  {
    id: '5',
    name: 'Merchandise',
    price: 'From ₹599',
    originalPrice: null,
    image: 'src/assets/images/Origin_1-p-1080.png',
    products: ['product4']
  }
];

const CollectionsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const collections = mockCollections;

  // Enhanced drag scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    sliderRef.current.style.cursor = 'grabbing';
    sliderRef.current.style.scrollSnapType = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      // Re-enable scroll snap after dragging
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.scrollSnapType = 'x mandatory';
        }
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
    }
  };

  // Touch events for mobile drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    sliderRef.current.style.scrollSnapType = 'none';
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.style.scrollSnapType = 'x mandatory';
      }
    }, 100);
  };

  useEffect(() => {
    const cards = gsap.utils.toArray('.collection-card');
    
    // Title animation
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
    
    // Cards animation with improved stagger
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

    // Shop All button animation
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

    // Hover animations for cards
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
      console.log(`Navigate to product: ${collection.products[0]}`);
    }
  };

  const handleShopAllClick = () => {
    console.log('Navigate to all products');
  };

 return (
    <section 
      ref={sectionRef} 
      className="w-full bg-white flex flex-col justify-center py-20 md:py-24 overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-16 md:mb-20 flex-shrink-0 px-6">
        <h2 className="collections-title text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-widest">
          OUR COLLECTIONS
        </h2>
      </div>

      {/* Slider Container */}
      <div className="w-full overflow-hidden mb-16 md:mb-20">
        <div 
          ref={sliderRef}
          className="flex gap-16 md:gap-24 lg:gap-32 overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing px-6 md:px-12 lg:px-20 py-8"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {collections.map((collection, index) => (
            <div
              key={`${collection.id}-${index}`}
              className="flex-shrink-0"
              style={{
                scrollSnapAlign: 'center',
                width: '240px',
              }}
            >
              <div 
                className="collection-card group cursor-pointer flex flex-col"
                onClick={() => handleCollectionClick(collection.id)}
              >
                {/* Collection Image */}
                <div className="relative mb-8 overflow-hidden bg-gray-50 rounded-lg aspect-square">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>

                {/* Collection Info */}
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-normal text-gray-900 mb-2 tracking-wide">
                    {collection.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-2">
                    {collection.originalPrice && (
                      <span className="text-gray-400 line-through text-sm md:text-base">
                        {collection.originalPrice}
                      </span>
                    )}
                    <span className="text-gray-600 text-sm md:text-base">
                      {collection.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shop All Button */}
      <div className="text-center flex-shrink-0">
        <button
          onClick={handleShopAllClick}
          className="shop-all-btn inline-flex items-center justify-center px-10 md:px-14 py-3 md:py-4 border-2 border-gray-900 text-gray-900 font-medium tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-full text-sm md:text-base uppercase"
        >
          Shop All
        </button>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .collection-card {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}</style>
    </section>
  );
};

export default CollectionsSection;