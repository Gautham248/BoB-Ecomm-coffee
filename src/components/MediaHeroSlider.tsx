import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaSlide {
  type: 'video' | 'image';
  url: string;
  headline?: string;
  text?: string;
  posterUrl?: string;
}

interface MediaHeroSliderProps {
  slides: MediaSlide[];
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  bannerHeight?: { mobile: number; desktop: number };
  bannerOpacity?: number;
  dotIndicatorBottom?: { mobile: number; desktop: number };
  dotIndicatorOpacity?: number;
  dotSize?: { mobile: number; desktop: number };
  dotActiveWidth?: { mobile: number; desktop: number };
  mobileAspectRatio?: string; // e.g., '1 / 1', '4 / 3', '16 / 9'
  desktopHeight?: string; // e.g., '100vh', '80vh', '600px'
  mobileObjectFit?: 'cover' | 'contain' | 'fill';
  desktopObjectFit?: 'cover' | 'contain' | 'fill';
}

interface MediaSlideItemProps {
  slide: MediaSlide;
  isActive: boolean;
  index: number;
  isMobile: boolean;
  bannerHeight: number;
  currentIndex: number;
  mobileAspectRatio: string;
  desktopHeight: string;
  mobileObjectFit: 'cover' | 'contain' | 'fill';
  desktopObjectFit: 'cover' | 'contain' | 'fill';
}

const MediaSlideItem: React.FC<MediaSlideItemProps> = ({ 
  slide, 
  isActive, 
  index, 
  isMobile, 
  bannerHeight, 
  currentIndex,
  mobileAspectRatio,
  desktopHeight,
  mobileObjectFit,
  desktopObjectFit
}) => {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [shouldLoadMedia, setShouldLoadMedia] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load media for current slide and adjacent slides (previous and next)
    const isAdjacent = Math.abs(index - currentIndex) <= 1;
    if (isActive || isAdjacent) {
      setShouldLoadMedia(true);
    }
  }, [isActive, index, currentIndex]);

  useEffect(() => {
    if (isActive && videoRef.current && slide.type === 'video') {
      // Reset video state when becoming active
      videoRef.current.currentTime = 0;
      videoRef.current.load(); // Force reload
      
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

  // Handle video end event for auto-advance
  useEffect(() => {
    const video = videoRef.current;
    if (!video || slide.type !== 'video') return;

    const handleVideoEnd = () => {
      if (isActive) {
        // Trigger parent to move to next slide
        const event = new CustomEvent('slideComplete', { 
          detail: { slideIndex: index } 
        });
        window.dispatchEvent(event);
      }
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => video.removeEventListener('ended', handleVideoEnd);
  }, [isActive, slide.type, index]);

  // Handle image timer for auto-advance
  useEffect(() => {
    if (isActive && slide.type === 'image' && isMediaLoaded) {
      const timer = setTimeout(() => {
        const event = new CustomEvent('slideComplete', { 
          detail: { slideIndex: index } 
        });
        window.dispatchEvent(event);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, slide.type, isMediaLoaded, index]);

  const handleMediaLoaded = () => {
    setIsMediaLoaded(true);
    setError(false);
  };

  const handleError = (e: any) => {
    console.error('Media failed to load:', slide.url, e);
    setError(true);
  };

  const objectFitClass = isMobile ? `object-${mobileObjectFit}` : `object-${desktopObjectFit}`;

  return (
    <div
      ref={itemRef}
      className="relative w-full flex-shrink-0 bg-gray-900 flex items-center justify-center"
      style={{ 
        height: isMobile ? '100vw' : desktopHeight,
        aspectRatio: isMobile ? mobileAspectRatio : 'auto'
      }}
    >
      {/* Poster/Placeholder - Shows while media loads */}
      {slide.posterUrl && !isMediaLoaded && !error && (
        <img
          src={slide.posterUrl}
          alt={`Slide ${index + 1}`}
          className={`w-full h-full ${objectFitClass}`}
          loading={isActive ? "eager" : "lazy"}
        />
      )}

      {/* Video Content */}
      {slide.type === 'video' && shouldLoadMedia && (
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay={isActive}
          preload="auto"
          poster={slide.posterUrl}
          onLoadedData={handleMediaLoaded}
          onCanPlay={handleMediaLoaded}
          onError={handleError}
          className={`w-full h-full ${objectFitClass} transition-opacity duration-500 ${
            isMediaLoaded ? 'opacity-100' : 'opacity-0'
          }`}
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
          className={`w-full h-full ${objectFitClass} transition-opacity duration-500 ${
            isMediaLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={isActive ? "eager" : "lazy"}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <p className="text-white text-lg">Failed to load media</p>
        </div>
      )}

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />

      {/* Headline and Text */}
      {(slide.headline || slide.text) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4 md:px-6 pointer-events-none">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 md:px-10 md:py-6">
            {slide.headline && (
              <h1
                className="text-lg md:text-4xl lg:text-4xl font-medium tracking-wide text-white leading-relaxed"
                dangerouslySetInnerHTML={{ __html: slide.headline }}
              />
            )}
            {slide.text && (
              <p
                className="text-sm md:text-xl lg:text-2xl text-white/90 leading-relaxed mt-2"
                dangerouslySetInnerHTML={{ __html: slide.text }}
              />
            )}
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
  showArrows = true,
  bannerHeight = { mobile: 60, desktop: 80 },
  bannerOpacity = 1,
  dotIndicatorBottom = { mobile: 20, desktop: 32 },
  dotIndicatorOpacity = 1,
  dotSize = { mobile: 8, desktop: 12 },
  dotActiveWidth = { mobile: 24, desktop: 32 },
  mobileAspectRatio = '1 / 1',
  desktopHeight = '100vh',
  mobileObjectFit = 'cover',
  desktopObjectFit = 'cover'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isPaused && autoPlayInterval > 0 && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isPaused, autoPlayInterval, slides.length]);

  // Listen for slide completion events
  useEffect(() => {
    const handleSlideComplete = (e: CustomEvent) => {
      if (e.detail.slideIndex === currentIndex && !isPaused) {
        goToNext();
      }
    };

    window.addEventListener('slideComplete', handleSlideComplete as EventListener);
    return () => window.removeEventListener('slideComplete', handleSlideComplete as EventListener);
  }, [currentIndex, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const currentBannerHeight = isMobile ? bannerHeight.mobile : bannerHeight.desktop;
  const currentDotBottom = isMobile ? dotIndicatorBottom.mobile : dotIndicatorBottom.desktop;
  const currentDotSize = isMobile ? dotSize.mobile : dotSize.desktop;
  const currentDotActiveWidth = isMobile ? dotActiveWidth.mobile : dotActiveWidth.desktop;

  // Calculate container height based on mobile aspect ratio
  const getContainerHeight = () => {
    if (isMobile) {
      return 'auto';
    }
    return desktopHeight;
  };

  return (
    <section
      ref={sliderRef}
      className="relative w-full overflow-hidden"
      style={{ height: getContainerHeight() }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          height: '100%'
        }}
      >
        {slides.map((slide, index) => (
          <MediaSlideItem
            key={`${slide.url}-${index}`}
            slide={slide}
            isActive={index === currentIndex}
            index={index}
            isMobile={isMobile}
            bannerHeight={currentBannerHeight}
            currentIndex={currentIndex}
            mobileAspectRatio={mobileAspectRatio}
            desktopHeight={desktopHeight}
            mobileObjectFit={mobileObjectFit}
            desktopObjectFit={desktopObjectFit}
          />
        ))}
      </div>

      {/* Black Banner at Bottom */}
      {currentBannerHeight > 0 && (
        <div 
          className="absolute bottom-0 left-0 right-0 bg-black z-20"
          style={{ 
            height: `${currentBannerHeight}px`,
            opacity: bannerOpacity
          }}
        />
      )}

      {/* Navigation Arrows - Desktop Only */}
      {showArrows && slides.length > 1 && !isMobile && (
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
        <div 
          className="absolute left-1/2 -translate-x-1/2 z-30 flex gap-2"
          style={{ 
            bottom: `${currentDotBottom}px`,
            opacity: dotIndicatorOpacity
          }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="rounded-full transition-all duration-300 bg-white/50 hover:bg-white/75"
              style={{
                width: index === currentIndex ? `${currentDotActiveWidth}px` : `${currentDotSize}px`,
                height: `${currentDotSize}px`,
                backgroundColor: index === currentIndex ? 'white' : undefined
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MediaHeroSlider;