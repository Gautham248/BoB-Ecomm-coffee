import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';
import NewsletterSection from './NewsletterSection';
import AddToCartSection from './Cart/AddToCartSection';

gsap.registerPlugin(ScrollTrigger);

interface ProductData {
  name: string;
  title: string;
  description: string;
  price: string;
  composition: string[];
  heroImage: string;
  galleryImages: string[];
  descriptionContent: {
    title: string;
    content: string;
    image: string;
  };
}

interface ProductPageProps {
  product: ProductData;
  onBackToHome: () => void;
  onProductClick: (productName: string) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onBackToHome }) => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Hero section animations
    gsap.fromTo('.product-hero-image',
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
    );

    gsap.fromTo('.product-hero-content',
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: 'power3.out' }
    );

    // Gallery animations
    gsap.fromTo('.gallery-item',
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Tab content animation
    gsap.fromTo('.tab-content',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.tab-content',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const tabs = ['DESCRIPTION', 'MOVEMENT', 'REVIEW'];

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="pt-20 pb-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Back to Home Button */}
          <div className="mb-8">
            <button 
              onClick={onBackToHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back to Home</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Product Image */}
            <div className="product-hero-image flex justify-center">
              <img
                src={product.heroImage}
                alt={product.name}
                className="w-full max-w-md h-auto object-contain"
              />
            </div>

            {/* Product Details */}
            <div className="product-hero-content">
              <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-8 leading-tight">
                {product.title}
              </h1>
              
              <div className="mb-6">
                {product.composition.map((item, index) => (
                  <p key={index} className="text-lg text-gray-700 mb-1">{item}</p>
                ))}
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {product.description}
              </p>

              <button className="text-gray-900 underline hover:no-underline transition-all duration-300 mb-12">
                See more
              </button>

              {/* Add to Cart Section */}
              <AddToCartSection product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef} className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-white text-sm font-medium tracking-wider mb-4">GALLERY</p>
            <h2 className="text-4xl md:text-5xl font-serif text-white">{product.name.toUpperCase()}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {product.galleryImages.map((image, index) => (
              <div
                key={index}
                className="gallery-item relative group cursor-pointer aspect-[4/5] overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-4 right-4">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-16">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium transition-colors duration-300 ${
                    activeTab === tab
                      ? 'bg-black text-white'
                      : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'DESCRIPTION' && (
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8">
                  {product.descriptionContent.title}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
                  {product.descriptionContent.content}
                </p>
                <div className="flex justify-center">
                  <img
                    src={product.descriptionContent.image}
                    alt={product.name}
                    className="w-full max-w-md h-auto object-contain"
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'MOVEMENT' && (
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8">
                  Our Movement
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  Every cup of {product.name} supports our mission to preserve the natural beauty of the Western Ghats. 
                  We work directly with local farmers and communities to ensure sustainable practices that protect 
                  both the environment and the livelihoods of those who call these mountains home.
                </p>
              </div>
            )}
            
            {activeTab === 'REVIEW' && (
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8">
                  Customer Reviews
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  "{product.name} has become my daily ritual. The rich, complex flavors transport me to the misty mountains 
                  of the Western Ghats with every sip. It's more than just coffee - it's an experience."
                </p>
                <p className="text-sm text-gray-500 mt-4">- Coffee Enthusiast</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
};

export default ProductPage;