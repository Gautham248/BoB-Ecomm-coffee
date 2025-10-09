import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CarouselHeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<number | null>(null);
  
  // Sample background images - replace with your actual images
  const slides = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      alt: "Coffee beans background 1"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      alt: "Coffee preparation background 2"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      alt: "Coffee shop background 3"
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      alt: "Coffee cup background 4"
    }
  ];

  // Clear interval function
  const clearAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start auto-slide function
  const startAutoSlide = useCallback(() => {
    clearAutoSlide();
    intervalRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  }, [slides.length, clearAutoSlide]);

  // Initialize auto-slide on mount
  useEffect(() => {
    startAutoSlide();
    return () => clearAutoSlide();
  }, [startAutoSlide, clearAutoSlide]);

  // Manual navigation functions
  const handlePrevious = () => {
    // console.log('Previous clicked, current slide:', currentSlide);
    clearAutoSlide();
    setCurrentSlide((prev) => {
      const newSlide = prev === 0 ? slides.length - 1 : prev - 1;
      // console.log('New slide will be:', newSlide);
      return newSlide;
    });
    // Restart auto-slide after 3 seconds
    setTimeout(() => {
      startAutoSlide();
    }, 3000);
  };

  const handleNext = () => {
    // console.log('Next clicked, current slide:', currentSlide);
    clearAutoSlide();
    setCurrentSlide((prev) => {
      const newSlide = (prev + 1) % slides.length;
      // console.log('New slide will be:', newSlide);
      return newSlide;
    });
    // Restart auto-slide after 3 seconds
    setTimeout(() => {
      startAutoSlide();
    }, 3000);
  };

  const handleGoToSlide = (index: number) => {
    // console.log('Dot clicked, going to slide:', index);
    clearAutoSlide();
    setCurrentSlide(index);
    // Restart auto-slide after 3 seconds
    setTimeout(() => {
      startAutoSlide();
    }, 3000);
  };

  // console.log('Current slide index:', currentSlide);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={`slide-${index}`}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100 z-20' 
                : 'opacity-0 scale-105 z-10'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              maxWidth: '100vw'
            }}
          >
            {/* Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/30 z-30" />
          </div>
        ))}
      </div>

      {/* Left Navigation Button */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>

      {/* Right Navigation Button */}
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>

      {/* Central Shop Now Button */}
      <div className="absolute inset-0 flex items-center justify-center z-40">
        <button className="group relative px-8 py-4 md:px-12 md:py-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 rounded-full transition-all duration-300 hover:scale-105">
          <span className="text-white text-lg md:text-2xl font-semibold tracking-wide">
            Shop Now
          </span>
          <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 flex space-x-2 z-40">
        {slides.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => handleGoToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Rotating Logo at Bottom */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-40">
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
          {/* Replace this div with your actual logo */}
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/80 rounded-full flex items-center justify-center animate-spin-slow">
            <div className="text-black font-bold text-xs md:text-sm">LOGO</div>
          </div>
        </div>
      </div>

      {/* Debug info - remove this in production
      <div className="absolute top-4 left-4 text-white bg-black/50 p-2 rounded text-xs z-50">
        Current Slide: {currentSlide + 1} / {slides.length}
      </div> */}

      {/* Custom CSS for slower rotation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `
      }} />
    </section>
  );
};

export default CarouselHeroSection;