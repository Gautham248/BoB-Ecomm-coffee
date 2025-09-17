import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFeaturedCollections } from '../data/collections';

gsap.registerPlugin(ScrollTrigger);

const CollectionsSection: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const collections = getFeaturedCollections();

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
      { y: 100, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
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
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.8,
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

  const handleCollectionClick = (collectionId: string) => {
    // For now, navigate to the first product in the collection
    // In a real app, you might have a dedicated collection page
    const collection = collections.find(c => c.id === collectionId);
    if (collection && collection.products.length > 0) {
      navigate(`/product/${collection.products[0]}`);
    }
  };

  const handleShopAllClick = () => {
    // Navigate to a products page or show all products
    console.log('Navigate to all products');
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="collections-title text-4xl md:text-5xl font-light text-gray-900 tracking-wider">
            OUR COLLECTIONS
          </h2>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className="collection-card group cursor-pointer"
              onClick={() => handleCollectionClick(collection.id)}
            >
              {/* Collection Image */}
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Collection Info */}
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-2 tracking-wide">
                  {collection.name}
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  {collection.originalPrice && (
                    <span className="text-gray-500 line-through text-sm">
                      {collection.originalPrice}
                    </span>
                  )}
                  <span className="text-gray-900 font-medium">
                    {collection.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shop All Button */}
        <div className="text-center">
          <button
            onClick={handleShopAllClick}
            className="shop-all-btn inline-flex items-center justify-center px-12 py-4 border-2 border-gray-900 text-gray-900 font-medium tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-full"
          >
            Shop All
          </button>
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;