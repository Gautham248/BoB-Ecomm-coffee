import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getCollections, getProductsInCollection } from '../services/adminService';
import SEOHead from '../components/SEO/SEOHead';
import StructuredData from '../components/SEO/StructuredData';
import NewsletterSection from '../components/NewsletterSection';
import AddToCartSection from '../components/Cart/AddToCartSection';

gsap.registerPlugin(ScrollTrigger);

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const collections = useMemo(() => getCollections(), []);

  useEffect(() => {
    // Animation for category sections
    gsap.fromTo('.category-section',
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.shop-container',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <SEOHead
        title="Shop All Products - Beans of Bodhi"
        description="Explore our complete collection of premium coffee blends from the Western Ghats. From signature nitro blends to single-origin selections, find your perfect cup."
        canonical="https://beansofbodhi.com/shop"
        keywords="coffee shop, premium coffee, Western Ghats coffee, sustainable coffee, coffee collection, coffee products"
        ogImage="https://beansofbodhi.com/og-shop.jpg"
      />
      
      <StructuredData type="collection" />

      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif mb-4">Our Collection</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Discover our complete range of premium coffee blends, each telling a unique story of adventure and sustainability
            </p>
          </div>
        </div>
      </div>

      {/* Shop Container */}
      <div className="shop-container py-20 px-6 max-w-7xl mx-auto">
        {collections.map((category) => (
          <div key={category.id} className="category-section mb-20">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">{category.title}</h2>
              <p className="text-lg text-gray-700">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getProductsInCollection(category.id).map((product) => (
                <div 
                  key={product.id} 
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                    <img
                      src={product.heroImage}
                      alt={product.name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">{product.price}</span>
                    <AddToCartSection
                      product={product}
                      className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <NewsletterSection />
    </>
  );
};

export default Shop;