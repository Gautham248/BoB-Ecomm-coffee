import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface MediaSlide {
  type: 'video' | 'image';
  url: string;
  mobileUrl?: string; // Optional URL for mobile specific content
  headline?: string;
  text?: string;
  posterUrl?: string;
}

interface MediaHeroSliderProps {
  slides: MediaSlide[];
  imageDisplayDuration?: number;
  showDots?: boolean;
  showArrows?: boolean;
  dotIndicatorBottom?: { mobile: number; desktop: number };
  dotIndicatorOpacity?: number;
  dotSize?: { mobile: number; desktop: number };
  dotActiveWidth?: { mobile: number; desktop: number };
  mobileAspectRatio?: string;
  desktopAspectRatio?: string;
  desktopHeight?: string;
  mobileObjectFit?: 'cover' | 'contain' | 'fill';
  desktopObjectFit?: 'cover' | 'contain' | 'fill';
}

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
  desktopAspectRatio, // New prop
  desktopHeight = '100vh',
  mobileObjectFit = 'cover',
  desktopObjectFit = 'cover'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle video playback and auto-advance
  useEffect(() => {
    const currentSlide = slides[currentIndex];
    const currentVideo = videoRefs.current[currentIndex];

    if (currentSlide.type === 'video' && currentVideo) {
      // Reset and play video
      currentVideo.currentTime = 0;
      const playPromise = currentVideo.play();

      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Video autoplay failed:', err);
          // Retry after short delay
          setTimeout(() => {
            if (currentVideo) {
              currentVideo.play().catch(e => console.log('Video retry failed:', e));
            }
          }, 100);
        });
      }

      // Set up video ended listener
      const handleVideoEnded = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      };

      currentVideo.addEventListener('ended', handleVideoEnded);

      return () => {
        currentVideo.removeEventListener('ended', handleVideoEnded);
        currentVideo.pause();
      };
    } else if (currentSlide.type === 'image') {
      // Set timer for image slides
      imageTimerRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, imageDisplayDuration);

      return () => {
        if (imageTimerRef.current) {
          clearTimeout(imageTimerRef.current);
        }
      };
    }
  }, [currentIndex, slides, imageDisplayDuration]);

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
  const objectFitClass = isMobile ? `object-${mobileObjectFit}` : `object-${desktopObjectFit}`;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: isMobile ? 'auto' : (desktopAspectRatio ? 'auto' : desktopHeight),
        aspectRatio: isMobile ? mobileAspectRatio : (desktopAspectRatio || 'auto')
      }}
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
          <div
            key={`${slide.url}-${index}`}
            className="relative w-full flex-shrink-0 bg-gray-900 flex items-center justify-center"
            style={{
              height: isMobile ? 'auto' : (desktopAspectRatio ? 'auto' : desktopHeight),
              aspectRatio: isMobile ? mobileAspectRatio : (desktopAspectRatio || 'auto')
            }}
          >
            {/* Video Content */}
            {slide.type === 'video' && (
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                muted
                playsInline
                preload="auto"
                poster={slide.posterUrl}
                className="w-full h-full object-contain"
                // Key forces re-render when switching between mobile/desktop URLs if they differ
                key={`video-${index}-${isMobile ? 'mobile' : 'desktop'}`}
              >
                <source src={isMobile && slide.mobileUrl ? slide.mobileUrl : slide.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Image Content */}
            {slide.type === 'image' && (
              <img
                src={slide.url}
                alt={`Slide ${index + 1}`}
                className={`w-full h-full ${objectFitClass}`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            )}

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
        ))}
      </div>

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