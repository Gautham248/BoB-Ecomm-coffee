import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Review } from '../types/product';

interface ReviewSliderProps {
  reviews: Review[];
  isDark?: boolean;
  autoRotateInterval?: number;
}

const ReviewSlider: React.FC<ReviewSliderProps> = ({
  reviews,
  isDark = false,
  autoRotateInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (reviews.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [reviews.length, isHovered, autoRotateInterval]);

  if (!reviews || reviews.length === 0) return null;

  // Single review static render
  if (reviews.length === 1) {
    const review = reviews[0];
    return (
      <div 
        className={`rounded-lg p-6 md:p-8 border text-left transition-all duration-300 ${
          isDark 
            ? 'bg-zinc-900/40 border-zinc-800/80 text-white' 
            : 'bg-white border-gray-200 text-gray-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : isDark ? 'text-zinc-700' : 'text-gray-300'}`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{review.date}</span>
          </div>
          <div className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            <span>Verified Purchase: </span>
            <span className={`font-medium ${isDark ? 'text-white/80' : 'text-gray-800'}`}>{review.purchase}</span>
          </div>
        </div>
        <h4 className={`text-base sm:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{review.title}</h4>
        <p className={`text-sm sm:text-base leading-relaxed mb-4 italic ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
          "{review.content}"
        </p>
        <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-white/40' : 'text-gray-500'}`}>- {review.customerName}</p>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div 
      className="relative w-full text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Viewport */}
      <div className="overflow-hidden relative min-h-[280px] xs:min-h-[240px] sm:min-h-[200px] md:min-h-[180px]">
        {reviews.map((review, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full transition-all duration-700 ease-in-out transform ${
                isActive 
                  ? 'opacity-100 translate-x-0 scale-100 z-10' 
                  : 'opacity-0 translate-x-4 scale-95 pointer-events-none z-0'
              }`}
            >
              <div 
                className={`rounded-lg p-6 md:p-8 border h-full transition-all duration-300 ${
                  isDark 
                    ? 'bg-zinc-900/40 border-zinc-800/80 text-white hover:border-zinc-700' 
                    : 'bg-white border-gray-200 text-gray-900 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : isDark ? 'text-zinc-700' : 'text-gray-300'}`} 
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{review.date}</span>
                  </div>
                  <div className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                    <span>Verified Purchase: </span>
                    <span className={`font-medium ${isDark ? 'text-white/80' : 'text-gray-800'}`}>{review.purchase}</span>
                  </div>
                </div>
                <h4 className={`text-base sm:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{review.title}</h4>
                <p className={`text-sm sm:text-base leading-relaxed mb-4 italic ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  "{review.content}"
                </p>
                <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-white/40' : 'text-gray-500'}`}>- {review.customerName}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-12 z-20">
        <button
          onClick={handlePrev}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isDark 
              ? 'bg-zinc-950 border-zinc-800 text-white hover:bg-zinc-900 hover:border-zinc-700' 
              : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
          }`}
          aria-label="Previous review"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-12 z-20">
        <button
          onClick={handleNext}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isDark 
              ? 'bg-zinc-950 border-zinc-800 text-white hover:bg-zinc-900 hover:border-zinc-700' 
              : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
          }`}
          aria-label="Next review"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Indicators Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? isDark 
                  ? 'bg-white w-4' 
                  : 'bg-black w-4'
                : isDark 
                  ? 'bg-white/20 hover:bg-white/40' 
                  : 'bg-black/20 hover:bg-black/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewSlider;
