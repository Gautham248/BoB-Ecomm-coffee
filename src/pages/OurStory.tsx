import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import SEOHead from '../components/SEO/SEOHead';
import StructuredData from '../components/SEO/StructuredData';
import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: 'beansofbodhi.myshopify.com',
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "b8f1f60c294032ca5816afa179b3636c",
  apiVersion: ''
});
export const fetchShopifyProducts = async () => {
  try {
    console.log('Fetching products from Shopify...');
    const products = await client.product.fetchAll();
    console.log('Available products:', products);
    
    // Log product details for easy copying
    products.forEach(product => {
      console.log(`Product: ${product.title}`);
      console.log(`ID: ${product.id}`);
      console.log('Variants:');
      product.variants.forEach(variant => {
        console.log(`  - ${variant.title}: ${variant.id} (${variant.price.amount} ${variant.price.currencyCode})`);
      });
      console.log('---');
    });
    
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

// export const fetchShopifyProducts = async () => {
//   try {
//     console.log('Fetching products from Shopify...');
//     const products = await client.product.fetchAll();

//     // Build structured JSON data
//     const productData = products.map(product => ({
//       id: product.id,
//       title: product.title,
//       description: product.descriptionHtml || product.description,
//       variants: product.variants.map(variant => ({
//         id: variant.id,
//         title: variant.title,
//         price: `${variant.price.amount} ${variant.price.currencyCode}`
//       }))
//     }));

//     // Convert to JSON string
//     const jsonString = JSON.stringify(productData, null, 2);

//     // Trigger download in browser
//     const blob = new Blob([jsonString], { type: "application/json" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "shopify_products.json";
//     document.body.appendChild(link);
//     link.click();

//     // Clean up
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);

//     return products;
//   } catch (error) {
//     console.error('Failed to fetch products:', error);
//     return [];
//   }
// };

gsap.registerPlugin(ScrollTrigger);

const OurStory: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: 'purpose',
      title: 'Purpose',
      headline: 'A higher calling.',
      subtext: 'Our athletes\' stories are diverse, but they all share a calling to push the limits of human potential.',
      cta: 'Meet the Athletes',
      background: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      isHero: true
    },
    {
      id: 'history',
      title: 'History',
      headline: 'Born from Adventure',
      subtext: 'From the misty peaks of the Western Ghats to your cup, our journey began with a simple belief: great coffee should fuel great adventures.',
      background: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
    },
    {
      id: 'sustainability',
      title: 'Sustainability',
      headline: 'Protecting Our Playground',
      subtext: 'Every cup supports conservation efforts in the Western Ghats, preserving the wild spaces that inspire our adventures.',
      background: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
    },
    {
      id: 'athletes',
      title: 'Athletes',
      headline: 'Fueled by Passion',
      subtext: 'Meet the adventurers, climbers, and explorers who push boundaries with every sip of our premium coffee.',
      background: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
    },
    {
      id: 'explore-fund',
      title: 'The Explore Fund',
      headline: 'Funding the Future',
      subtext: 'Supporting the next generation of adventurers through grants, equipment, and mentorship programs.',
      background: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
    },
    {
      id: 'technology',
      title: 'Technology',
      headline: 'Innovation in Every Bean',
      subtext: 'Cutting-edge roasting techniques and sustainable processing methods that honor tradition while embracing the future.',
      background: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
    },
    {
      id: 'innovation',
      title: 'Innovation',
      headline: 'Beyond the Cup',
      subtext: 'Pioneering new ways to connect coffee culture with adventure culture, creating experiences that transcend the ordinary.',
      background: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
    }
  ];

  useEffect(() => {
    fetchShopifyProducts();
    const container = containerRef.current;
    if (!container) return;

    // Track active section on scroll
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const sectionHeight = window.innerHeight;
      const currentSection = Math.round(scrollTop / sectionHeight);
      
      if (currentSection !== activeSection && currentSection >= 0 && currentSection < sections.length) {
        setActiveSection(currentSection);
      }
    };

    container.addEventListener('scroll', handleScroll);

    // Initial animations
    gsap.fromTo('.hero-content',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 }
    );

    return () => {
      container.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeSection]);

  const scrollToSection = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const targetScroll = index * window.innerHeight;
    
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <SEOHead
        title="Our Story - A Higher Calling"
        description="Discover the story behind Beans of Bodhi. From adventure-inspired beginnings to sustainable coffee innovation, learn about our purpose, history, and commitment to fueling human potential."
        canonical="https://beansofbodhi.com/our-story"
        keywords="coffee story, adventure coffee, sustainable coffee, Western Ghats coffee, coffee innovation, outdoor adventure"
        ogImage="https://beansofbodhi.com/og-our-story.jpg"
      />
      
      <StructuredData 
        type="breadcrumb" 
        data={[
          { name: 'Home', url: 'https://beansofbodhi.com/' },
          { name: 'Our Story', url: 'https://beansofbodhi.com/our-story' }
        ]} 
      />

      <div 
        ref={containerRef}
        className="h-screen overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {/* Sections */}
        {sections.map((section, index) => (
          <section
            key={section.id}
            className="relative h-screen flex items-center justify-center"
            style={{ 
              scrollSnapAlign: 'start',
              backgroundImage: `url(${section.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            
            {/* Content */}
            <div className={`relative z-10 max-w-4xl mx-auto px-6 text-center text-white ${section.isHero ? 'hero-content' : ''}`}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight">
                {section.headline}
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-12 max-w-3xl mx-auto">
                {section.subtext}
              </p>
              
              {section.cta && (
                <button className="inline-flex items-center space-x-3 bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                  <span>{section.cta}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Section Number */}
            <div className="absolute bottom-8 right-8 text-white/50 text-sm font-medium">
              {String(index + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
            </div>
          </section>
        ))}

        {/* Footer Section */}
        <footer className="h-screen flex items-center justify-center bg-black text-white" style={{ scrollSnapAlign: 'start' }}>
          <div className="text-center max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-light mb-8">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed mb-12">
              Every great adventure starts with a single step. Let our coffee fuel your next expedition.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-3 bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              <span>Explore Our Coffee</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </div>

      {/* Progress Bar - Fixed Position */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm">
        {/* Desktop Progress Bar */}
        <div className="hidden md:flex items-center justify-center py-4">
          <div className="flex items-center space-x-8">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(index)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeSection === index
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {section.title}
                {activeSection === index && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-teal-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden py-4 overflow-x-auto">
          <div className="flex items-center space-x-6 px-6" style={{ minWidth: 'max-content' }}>
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(index)}
                className={`relative px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeSection === index
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {section.title}
                {activeSection === index && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-teal-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-red-500 to-teal-500 transition-all duration-300"
             style={{ width: `${((activeSection + 1) / sections.length) * 100}%` }} />
      </div>

      <style jsx>{`
        .h-screen::-webkit-scrollbar {
          display: none;
        }
        
        .h-screen {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-behavior: smooth;
        }

        @media (max-width: 768px) {
          .fixed.bottom-0 {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .fixed.bottom-0::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default OurStory;