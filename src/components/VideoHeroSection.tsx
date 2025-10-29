import React, { useState, useEffect, useRef } from 'react';

interface VideoHeroSectionProps {
  videoUrl: string;
  headline?: string;
  posterUrl?: string;
  mobileAspectRatio?: string; // e.g., '1 / 1', '4 / 3', '16 / 9'
  desktopHeight?: string; // e.g., '100vh', '80vh', '600px'
  mobileObjectFit?: 'cover' | 'contain' | 'fill';
  desktopObjectFit?: 'cover' | 'contain' | 'fill';
  overlayOpacity?: number; // 0 to 1
  headlineBorderOpacity?: number; // 0 to 1
  headlinePadding?: { mobile: string; desktop: string }; // e.g., { mobile: '10px 20px', desktop: '32px 56px' }
  headlineBorderRadius?: string; // e.g., '9999px' for full rounded
  headlineFontSize?: { mobile: string; desktop: string }; // e.g., { mobile: '14px', desktop: '36px' }
}

const VideoHeroSection: React.FC<VideoHeroSectionProps> = ({ 
  videoUrl, 
  headline,
  posterUrl,
  mobileAspectRatio = '1 / 1',
  desktopHeight = '100vh',
  mobileObjectFit = 'cover',
  desktopObjectFit = 'cover',
  overlayOpacity = 0.3,
  headlineBorderOpacity = 0.3,
  headlinePadding = { mobile: '10px 20px', desktop: '32px 56px' },
  headlineBorderRadius = '9999px',
  headlineFontSize = { mobile: '14px', desktop: '36px' }
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Check if video is in viewport or close to it
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 1.5) {
            setShouldLoadVideo(true);
            observer.disconnect();
          }
        });
      },
      { 
        rootMargin: '50% 0px', // Start loading when within 50% of viewport
        threshold: 0 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Preload hint for the video
    if (shouldLoadVideo && videoUrl) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = videoUrl;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [shouldLoadVideo, videoUrl]);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  const objectFitClass = isMobile ? `object-${mobileObjectFit}` : `object-${desktopObjectFit}`;

  const containerStyle: React.CSSProperties = {
    height: isMobile ? '100vw' : desktopHeight,
    aspectRatio: isMobile ? mobileAspectRatio : 'auto'
  };

  const currentHeadlinePadding = isMobile ? headlinePadding.mobile : headlinePadding.desktop;
  const currentHeadlineFontSize = isMobile ? headlineFontSize.mobile : headlineFontSize.desktop;

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full overflow-hidden bg-gray-900 flex items-center justify-center"
      style={containerStyle}
    >
      {/* Poster Image - Shows while video loads */}
      {posterUrl && !isVideoLoaded && (
        <img
          src={posterUrl}
          alt="Hero background"
          className={`absolute inset-0 w-full h-full ${objectFitClass}`}
          loading="eager"
        />
      )}

      {/* Background Video - Loaded only when needed */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={posterUrl}
          onLoadedData={handleVideoLoaded}
          className={`absolute inset-0 w-full h-full ${objectFitClass} transition-opacity duration-500 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Overlay for better contrast */}
      <div 
        className="absolute inset-0 bg-black z-10" 
        style={{ opacity: overlayOpacity }}
      />

      {/* Optional Headline */}
      {headline && (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4 md:px-6">
          <div 
            className="inline-block border"
            style={{
              borderColor: `rgba(255, 255, 255, ${headlineBorderOpacity})`,
              borderWidth: '1px',
              borderRadius: headlineBorderRadius,
              padding: currentHeadlinePadding
            }}
          >
            <h1
              className="font-pangaia font-medium tracking-wide text-white leading-relaxed"
              style={{ fontSize: currentHeadlineFontSize }}
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoHeroSection;