import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import VideoHeroSection from '../components/VideoHeroSection';
import ScrollImageSequence from '../components/Movement/ScrollImageSequence';

gsap.registerPlugin(ScrollTrigger);

const MovementProduct: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [_isMobile, setIsMobile] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const product = {
    name: 'Movement',
    title: 'Movement ',
    description: 'Your companion between destinations, a mindset for the climbers, surfers and dreamers and the ones who carry rhythm. Crafted for the road and in between. Small enough to fit in your pack, powerful enough to pull a shot, No cords, no limits, just espresso.',
    price: '$189.99',
    composition: ['Ceramic Filter', 'Stainless Steel', 'Heat-Resistant Glass', 'Eco-Conscious Design'],
    galleryImages: [
      'https://ik.imagekit.io/beansofbodhi/Products/Movement/MVT1.webp?updatedAt=1761227402101',
      'https://ik.imagekit.io/beansofbodhi/Products/Movement/MVT2.webp?updatedAt=1761227402233',
      'https://ik.imagekit.io/beansofbodhi/Products/Movement/MVT3.webp?updatedAt=1761227402299',
    ],
    descriptionContent: {
      title: 'Freedom in Movement',
      content: `
      A Symphony of Simplicity  
      No Electricity. No Limits.  
      Brew anywhere with our manual, eco-friendly design.  
      
      Portability — Compact and lightweight, it slips effortlessly into your backpack, ready for any adventure.  
      
      Easy to Use — Because great coffee should never slow you down.
      `,
      image: 'https://ik.imagekit.io/beansofbodhi/Videos/Movement_Inside_01_1-transcode.mp4?updatedAt=1761287864681',
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    gsap.fromTo('.product-info-content',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
    );

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

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setViewerIndex((prev) => (prev + 1) % product.galleryImages.length);
  };

  const prevImage = () => {
    setViewerIndex((prev) => (prev - 1 + product.galleryImages.length) % product.galleryImages.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isViewerOpen) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewerOpen]);

  return (
    <>
     
     <ScrollImageSequence />

      {/* Video Hero Section */}
      {/* <section ref={heroRef} className="relative w-full bg-black">
        <VideoHeroSection videoUrl="https://ik.imagekit.io/7ujz6ljli/Movement/Movement_Desk_01_1.mp4?updatedAt=1760249904962" />
      </section> */}

      {/* Product Information Section */}
      {/* <section className="pb-0 pt-12 md:pt-16 lg:pt-20 bg-black">
        <div className="product-info-content text-center text-white space-y-6 px-4 max-w-3xl mx-auto">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-pangaia font-bold tracking-wide leading-tight">
            {product.title}
          </h1>
          
      
          <p className="text-sm md:text-base lg:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
            {product.description}
          </p>
          

          <div className="flex flex-wrap gap-2 justify-center">
            {product.composition.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs sm:text-sm text-white/90"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-6">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {product.price}
            </span>
            <button className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors duration-300 whitespace-nowrap text-sm sm:text-base">
              Add to Cart
            </button>
          </div>
        </div>
      </section> */}

      {/* Gallery Section - Swipeable with Image Viewer */}
      <section ref={galleryRef} className="pt-12 md:pt-16 lg:pt-20 pb-4 md:pb-6 lg:pb-8 bg-black">
        <div className="w-full">
          <div className="text-center mb-10 md:mb-14 lg:mb-10 px-4 sm:px-6 md:px-8">
            <p className="text-white text-xs sm:text-sm font-medium tracking-wider mb-3 md:mb-4">GALLERY</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-helvetica text-white">{product.name.toUpperCase()}</h2>
          </div>

          {/* Swipeable Gallery Container */}
          <div className="relative w-full">
            <div 
              ref={scrollContainerRef}
              className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-4 justify-start md:justify-center px-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <style>
                {`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              {/* Spacer for mobile centering */}
              <div className="flex-shrink-0 w-[calc((100vw-280px)/2)] md:hidden" />
              
              {product.galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="gallery-item flex-shrink-0 snap-center relative group cursor-pointer overflow-hidden rounded-md md:rounded-lg w-[280px] h-[350px] md:w-[240px] md:h-[300px] lg:w-[260px] lg:h-[325px]"
                  onClick={() => openViewer(index)}
                >
                  <div className="w-full h-full bg-gray-800">
                    <img
                      src={image}
                      alt={`${product.name} gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Plus className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Spacer for mobile centering */}
              <div className="flex-shrink-0 w-[calc((100vw-280px)/2)] md:hidden" />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8 px-4">
            {product.galleryImages.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Full Screen Image Viewer */}
      {isViewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeViewer}
            className="absolute top-4 right-4 z-50 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-300"
            aria-label="Close viewer"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-50 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm font-medium">
              {viewerIndex + 1} / {product.galleryImages.length}
            </span>
          </div>

          {/* Previous Button */}
          {product.galleryImages.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Next Button */}
          {product.galleryImages.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-300"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Image Display - Centered Single Image */}
          <div className="relative w-full h-full flex items-center justify-center px-4 md:px-12 py-20">
            <img
              src={product.galleryImages[viewerIndex]}
              alt={`${product.name} ${viewerIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              key={viewerIndex}
            />
          </div>
        </div>
      )}

      {/* Description Section - Black Background */}
      {/* Description Section - Black Background */}
<section className="bg-black">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-4 md:pt-6 lg:pt-8">
    {/* Tab Content */}
    <div className="tab-content">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-pangaia font-bold text-white mb-6 md:mb-8 px-4">
          {product.descriptionContent.title}
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-white/80 font-helvetica leading-relaxed max-w-3xl mx-auto px-4">
          {product.descriptionContent.content}
        </p>
        <br />
      </div>
    </div>
  </div>
</section>

{/* Video Section - Directly attached */}
{/* <VideoHeroSection videoUrl="https://ik.imagekit.io/nzkbravfr/Movement_Inside_01_1-transcode.mp4?updatedAt=1761288434992" 
/> */}
<section className="w-full bg-black">
  <div className="w-full h-auto md:h-screen flex items-center justify-center">
    <img
      src="https://ik.imagekit.io/nzkbravfr/Movement/IMG_9065.JPG?updatedAt=1762052719316"
      alt="Movement product detail"
      className="w-full h-auto md:h-full object-contain"
    />
  </div>
</section>
    </>
  );
};

export default MovementProduct;