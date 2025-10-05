import React, { useEffect, useRef, useState } from 'react';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import wildFireImage from '../assets/images/Origin_1-p-1080.png';
import tornadoImage from '../assets/images/Origin_1-p-1080.png';
import ecoShockImage from '../assets/images/Origin_1-p-1080.png';
import originImage from '../assets/images/Origin_1-p-1080.png';
import thunderFuseImage from '../assets/images/Origin_1-p-1080.png';
import highTideImage from '../assets/images/Origin_1-p-1080.png';

const products = [
  { id: 1, title: 'The Origin', image: originImage, link: '/inside-pages/origin' },
  { id: 2, title: 'Thunder Fuse', image: thunderFuseImage, link: '/inside-pages/thunder-fuse' },
  { id: 3, title: 'The High Tide', image: highTideImage, link: '/inside-pages/the-high-tide' },
  { id: 4, title: 'The Wild Fire Rush', image: wildFireImage, link: '/inside-pages/the-wild-fire-rush' },
  { id: 5, title: 'Tornado Twist', image: tornadoImage, link: '/inside-pages/tornado-twist' },
  { id: 6, title: 'The Eco Shock', image: ecoShockImage, link: '/the-eco-shock-by-beans-of-bodhi' }
];

const FeaturedProducts: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const splideRef = useRef<HTMLDivElement>(null);
  const splideInstanceRef = useRef<Splide | null>(null);

  // --- FIX: Use single refs for the state-driven text elements ---
  const titleRef = useRef<HTMLHeadingElement>(null);
  const discoverRef = useRef<HTMLAnchorElement>(null);

  // State to track the active slide index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Effect for the main section's scroll-triggered fade-in (remains unchanged)
  useEffect(() => {
    const section = sectionRef.current;
    if(section){
      gsap.fromTo(section, 
        { opacity: 0 }, 
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Effect to initialize and manage the Splide instance
  useEffect(() => {
    if (splideRef.current) {
      const splideInstance = new Splide(splideRef.current, {
        type: 'slide',
        perPage: 1,
        focus: 'center',
        perMove: 1,
        gap: '8vw',
        padding: { left: '25vw', right: '25vw' },
        arrows: false,
        pagination: false,
        drag: true,
        snap: true,
        rewind: false,
        trimSpace: false,
        breakpoints: {
          768: {
            gap: '5vw',
            padding: { left: '15vw', right: '15vw' },
          },
        },
      });

      // --- FIX: Simplified event listener to update state ---
      splideInstance.on('moved', (newIndex) => {
        setCurrentIndex(newIndex);
      });
      
      splideInstance.mount();
      splideInstanceRef.current = splideInstance;

      return () => {
        splideInstance.destroy();
      };
    }
  }, []);

  // --- FIX: A single, clean effect to handle text animation based on state change ---
  useEffect(() => {
    const title = titleRef.current;
    const discover = discoverRef.current;

    if (title && discover) {
      // Animate the current text OUT first
      gsap.to([title, discover], {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          // Then, after it's hidden, animate the NEW text IN
          gsap.fromTo([title, discover], 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.15 }
          );
        }
      });
    }
  }, [currentIndex]); // This animation runs ONLY when the active index changes

  return (
    <>
      <style>{`
        /* All styles remain exactly the same */
        .featured-products-dark { opacity: 0; padding: 120px 0; background: #121212; overflow: hidden; position: relative; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
        .featured_head_dark { text-align: center; font-size: 0.875rem; font-weight: 400; letter-spacing: 4px; margin-bottom: 80px; color: #a0a0a0; text-transform: uppercase; }
        .featured_slider_wrap_dark { position: relative; display: flex; align-items: center; min-height: 600px; }
        .splide__arrows { display: none; }
        .splide__slide { opacity: 0.3; transform: scale(0.85); transition: opacity 0.5s ease, transform 0.5s ease; }
        .splide__slide.is-active { opacity: 1; transform: scale(1); }
        .splide__track { overflow: visible !important; }
        .splide__list { display: flex; align-items: center; }
        .featured_prd_image_dark { width: 100%; max-width: 380px; height: auto; object-fit: contain; display: block; margin: 0 auto; cursor: grab; }
        .featured_prd_image_dark:active { cursor: grabbing; }
        .horizontal-line { position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: #333; z-index: 1; transform: translateY(-50%); }
        .product-text-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, calc(-50% - 50px)); width: 80%; max-width: 1400px; display: flex; justify-content: space-between; align-items: flex-end; pointer-events: none; z-index: 10; }
        .product-titles-left { position: relative; height: 70px; width: 400px; flex-shrink: 0; }
        .product-links-right { position: relative; height: 70px; width: 120px; flex-shrink: 0; }
        .product-title { opacity: 0; color: white; font-family: 'Playfair Display', serif; position: absolute; bottom: 0; left: 0; font-size: 3rem; font-weight: 400; line-height: 1.2; white-space: nowrap; margin: 0; }
        .product-discover { opacity: 0; color: white; font-family: 'Playfair Display', serif; position: absolute; bottom: 0; right: 0; font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; pointer-events: all; text-decoration: none; padding-bottom: 5px; border-bottom: 1px solid #a0a0a0; transition: all 0.3s ease; }
        .product-discover:hover { color: #fff; border-bottom-color: #fff; }
        .custom-arrows { position: absolute; top: 60px; right: 10%; display: flex; gap: 0.5rem; z-index: 20; }
        .custom-arrow { background: transparent; border: 1px solid #555; color: #a0a0a0; width: 40px; height: 40px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .custom-arrow:hover { border-color: white; color: white; }
        .custom-arrow:disabled { opacity: 0.3; cursor: not-allowed; }
        @media (max-width: 1024px) { .product-text-container { width: 85%; } .product-title { font-size: 2.5rem; } .product-titles-left { width: 350px; } }
        @media (max-width: 768px) { .product-text-container { width: 90%; transform: translate(-50%, calc(-50% - 40px)); } .product-title { font-size: 1.8rem; } .product-discover { font-size: 0.7rem; letter-spacing: 2px; } .custom-arrows { top: 40px; right: 5%; } .product-titles-left { height: 50px; width: 250px; } .product-links-right { height: 50px; width: 100px; } }
      `}</style>

      <section ref={sectionRef} className="featured-products-dark">
        <p className="featured_head_dark">FEATURED PRODUCTS</p>
        
        <div className="custom-arrows">
          <button 
            className="custom-arrow" 
            onClick={() => splideInstanceRef.current?.go('<')}
            disabled={!splideInstanceRef.current?.options.rewind && currentIndex === 0}
          >
            ‹
          </button>
          <button 
            className="custom-arrow"
            onClick={() => splideInstanceRef.current?.go('>')}
            disabled={!splideInstanceRef.current?.options.rewind && currentIndex === products.length - 1}
          >
            ›
          </button>
        </div>

        <div className="horizontal-line"></div>
        
        <div className="product-text-container">
          {/* --- FIX: Render a SINGLE title and link, driven by state --- */}
          <div className="product-titles-left">
            <h3 ref={titleRef} className="product-title">
              {products[currentIndex]?.title}
            </h3>
          </div>
          <div className="product-links-right">
            <a ref={discoverRef} href={products[currentIndex]?.link} className="product-discover">
              Discover
            </a>
          </div>
        </div>

        <div className="featured_slider_wrap_dark">
          <div ref={splideRef} className="splide">
            <div className="splide__track">
              <ul className="splide__list">
                {products.map((product) => (
                  <li key={product.id} className="splide__slide">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="featured_prd_image_dark"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedProducts;