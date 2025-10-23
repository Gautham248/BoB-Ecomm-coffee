import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaSlide {
  type: 'video' | 'image';
  url: string;
  headline?: string;
  posterUrl?: string;
}

interface MediaHeroSliderProps {
  slides: MediaSlide[];
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

const MediaSlideItem: React.FC<{
  slide: MediaSlide;
  isActive: boolean;
  index: number;
}> = ({ slide, isActive, index }) => {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [shouldLoadMedia, setShouldLoadMedia] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load media for current and adjacent slides for smoother transitions
    if (isActive) {
      setShouldLoadMedia(true);
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive && videoRef.current && slide.type === 'video') {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Video play failed:', err);
          // Try to play again after a short delay
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.log('Retry failed:', e));
            }
          }, 100);
        });
      }
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive, slide.type]);

  const handleMediaLoaded = () => {
    setIsMediaLoaded(true);
    setError(false);
  };

  const handleError = (e: any) => {
    console.error('Media failed to load:', slide.url, e);
    setError(true);
  };

  return (
    <div
      ref={itemRef}
      className="relative w-full h-full flex-shrink-0 bg-gray-900"
    >
      {/* Poster/Placeholder - Shows while media loads */}
      {slide.posterUrl && !isMediaLoaded && !error && (
        <img
          src={slide.posterUrl}
          alt={`Slide ${index + 1}`}
          className="w-full h-full object-cover"
          loading={isActive ? "eager" : "lazy"}
        />
      )}

      {/* Video Content */}
      {slide.type === 'video' && (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          autoPlay={isActive}
          preload="auto"
          poster={slide.posterUrl}
          onLoadedData={handleMediaLoaded}
          onCanPlay={handleMediaLoaded}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isMediaLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          crossOrigin="anonymous"
        >
          <source src={slide.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Image Content */}
      {slide.type === 'image' && shouldLoadMedia && (
        <img
          src={slide.url}
          alt={`Slide ${index + 1}`}
          onLoad={handleMediaLoaded}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isMediaLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={isActive ? "eager" : "lazy"}
          crossOrigin="anonymous"
        />
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <p className="text-white text-lg">Failed to load media</p>
        </div>
      )}

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Headline */}
      {slide.headline && (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4 md:px-6">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 md:px-10 md:py-6">
            <h1
              className="text-lg md:text-4xl lg:text-4xl font-medium tracking-wide text-white leading-relaxed"
              dangerouslySetInnerHTML={{ __html: slide.headline }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const MediaHeroSlider: React.FC<MediaHeroSliderProps> = ({
  slides,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused && autoPlayInterval > 0 && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isPaused, autoPlayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      ref={sliderRef}
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <MediaSlideItem
            key={index}
            slide={slide}
            isActive={index === currentIndex}
            index={index}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dot Navigation */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MediaHeroSlider;