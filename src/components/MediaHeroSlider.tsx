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
  imageDisplayDuration?: number; // Duration for images in milliseconds
  showDots?: boolean;
  showArrows?: boolean;
  dotIndicatorBottom?: { mobile: number; desktop: number };
  dotIndicatorOpacity?: number;
  dotSize?: { mobile: number; desktop: number };
  dotActiveWidth?: { mobile: number; desktop: number };
  mobileAspectRatio?: string;
  desktopHeight?: string;
  mobileObjectFit?: 'cover' | 'contain' | 'fill';
  desktopObjectFit?: 'cover' | 'contain' | 'fill';
}

interface MediaSlideItemProps {
  slide: MediaSlide;
  isActive: boolean;
  index: number;
  isMobile: boolean;
  currentIndex: number;
  mobileAspectRatio: string;
  desktopHeight: string;
  mobileObjectFit: 'cover' | 'contain' | 'fill';
  desktopObjectFit: 'cover' | 'contain' | 'fill';
  onSlideComplete: () => void;
}

const MediaSlideItem: React.FC<MediaSlideItemProps> = ({ 
  slide, 
  isActive, 
  index, 
  isMobile, 
  currentIndex,
  mobileAspectRatio,
  desktopHeight,
  mobileObjectFit,
  desktopObjectFit,
  onSlideComplete
}) => {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [shouldLoadMedia, setShouldLoadMedia] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const isAdjacent = Math.abs(index - currentIndex) <= 1;
    if (isActive || isAdjacent) {
      setShouldLoadMedia(true);
    }
  }, [isActive, index, currentIndex]);

  useEffect(() => {
    if (isActive && videoRef.current && slide.type === 'video') {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Video play failed:', err);
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || slide.type !== 'video') return;

    const handleVideoEnd = () => {
      if (isActive) {
        onSlideComplete();
      }
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => video.removeEventListener('ended', handleVideoEnd);
  }, [isActive, slide.type, onSlideComplete]);

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
      className="relative w-full flex-shrink-0 bg-gray-900 flex items-center justify-center"
      style={{ 
        height: isMobile ? 'auto' : desktopHeight,
        aspectRatio: isMobile ? mobileAspectRatio : 'auto'
      }}
    >
      {slide.posterUrl && !isMediaLoaded && !error && (
        <img
          src={slide.posterUrl}
          alt={`Slide ${index + 1}`}
          className={`w-full h-full ${objectFitClass}`}
          loading={isActive ? "eager" : "lazy"}
        />
      )}

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

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <p className="text-white text-lg">Failed to load media</p>
        </div>
      )}

      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />

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
  imageDisplayDuration = 5000,
  showDots = true,
  showArrows = true,
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
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle image auto-advance
  useEffect(() => {
    const currentSlide = slides[currentIndex];
    
    if (currentSlide.type === 'image') {
      imageTimerRef.current = setTimeout(() => {
        goToNext();
      }, imageDisplayDuration);
    }

    return () => {
      if (imageTimerRef.current) {
        clearTimeout(imageTimerRef.current);
      }
    };
  }, [currentIndex, imageDisplayDuration]);

  const handleSlideComplete = () => {
    goToNext();
  };

  const goToSlide = (index: number) => {
    if (imageTimerRef.current) {
      clearTimeout(imageTimerRef.current);
    }
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    if (imageTimerRef.current) {
      clearTimeout(imageTimerRef.current);
    }
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    if (imageTimerRef.current) {
      clearTimeout(imageTimerRef.current);
    }
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

  const currentDotBottom = isMobile ? dotIndicatorBottom.mobile : dotIndicatorBottom.desktop;
  const currentDotSize = isMobile ? dotSize.mobile : dotSize.desktop;
  const currentDotActiveWidth = isMobile ? dotActiveWidth.mobile : dotActiveWidth.desktop;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: isMobile ? 'auto' : desktopHeight }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
            currentIndex={currentIndex}
            mobileAspectRatio={mobileAspectRatio}
            desktopHeight={desktopHeight}
            mobileObjectFit={mobileObjectFit}
            desktopObjectFit={desktopObjectFit}
            onSlideComplete={handleSlideComplete}
          />
        ))}
      </div>

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