import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate hero background
    tl.fromTo(heroRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2, ease: 'power3.out' }
    );

    // Animate product packages
    gsap.fromTo('.product-package',
      { y: 100, opacity: 0, rotateY: 15 },
      { 
        y: 0, 
        opacity: 1, 
        rotateY: 0,
        duration: 1.2, 
        stagger: 0.1,
        delay: 0.5,
        ease: 'power3.out'
      }
    );

    // Floating animation for products
    gsap.to('.product-package', {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
      stagger: 0.2
    });
  }, []);

  const products = [
    { name: 'THE HIGH TIDE', color: 'from-teal-600 to-green-700' },
    { name: 'ECO SHOCK', color: 'from-green-600 to-teal-700' },
    { name: 'TOKADO MIST', color: 'from-blue-600 to-purple-700' },
    { name: 'THE WILD FIRE RUSH', color: 'from-orange-600 to-red-700' },
    { name: 'THE THUNDER FUSE', color: 'from-purple-600 to-blue-700' },
    { name: 'THE ORIGIN', color: 'from-gray-600 to-gray-800' }
  ];

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        ref={heroRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* Product Packages */}
      <div ref={productsRef} className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-end space-x-4 px-8">
          {products.map((product, index) => (
            <div
              key={product.name}
              className={`product-package relative w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-48 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer bg-gradient-to-br ${product.color}`}
              style={{ 
                transform: `translateY(${Math.sin(index * 0.5) * 20}px) rotateY(${index % 2 === 0 ? '5deg' : '-5deg'})`,
                zIndex: products.length - Math.abs(index - products.length / 2)
              }}
            >
              <div className="absolute inset-2 bg-black/20 rounded-md flex items-center justify-center">
                <div className="text-white text-center p-2">
                  <div className="text-xs md:text-sm font-bold mb-1">100% Arabica</div>
                  <div className="text-xs md:text-base font-black leading-tight">
                    {product.name.split(' ').map((word, i) => (
                      <div key={i}>{word}</div>
                    ))}
                  </div>
                  <div className="text-xs mt-2">250g</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Circle */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;