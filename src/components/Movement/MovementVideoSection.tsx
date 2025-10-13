import React, { useRef, useEffect, useState } from 'react';

interface MovementVideoSectionProps {
  desktopVideoUrl: string;
  mobileVideoUrl: string;
  posterUrl: string;
  scrollHeight?: string;
}

const MovementVideoSection: React.FC<MovementVideoSectionProps> = ({
  desktopVideoUrl,
  mobileVideoUrl,
  posterUrl,
  scrollHeight = '200vh'
}) => {
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileError, setMobileError] = useState(false);
  const [desktopError, setDesktopError] = useState(false);
  const [scale, setScale] = useState(0.7);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    if (mobileVideoRef.current) {
      mobileVideoRef.current.play().catch((error) => {
        console.error('Mobile video autoplay failed:', error);
        setMobileError(true);
      });
    }
    if (desktopVideoRef.current) {
      desktopVideoRef.current.play().catch((error) => {
        console.error('Desktop video autoplay failed:', error);
        setDesktopError(true);
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Container is above viewport - not in view yet
      if (rect.top > 0) {
        setScale(0.7);
        setIsFixed(false);
        return;
      }
      
      // When we've scrolled past the container completely
      if (rect.bottom <= windowHeight) {
        setScale(1.0);
        setIsFixed(false); // Release from fixed so content flows normally
        return;
      }
      
      // Container is in viewport - fix it and scale
      setIsFixed(true);
      
      // Calculate how far we've scrolled into the container
      const scrolledIntoContainer = Math.abs(rect.top);
      
      // Total scroll distance for the container
      const containerHeight = containerRef.current.offsetHeight - windowHeight;
      
      // Calculate progress through the container (0 to 1)
      const progress = Math.min(1, scrolledIntoContainer / containerHeight);
      
      // Scale from 0.7 to 1.0 as we scroll through the container
      const newScale = 0.7 + (progress * 0.3);
      setScale(newScale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Video */}
      <div className="block md:hidden">
        <div className="relative w-full min-h-screen bg-black">
          {!mobileError ? (
            <video
              ref={mobileVideoRef}
              autoPlay
              loop
              muted
              playsInline
              poster={posterUrl}
              className="w-full h-full min-h-screen object-cover"
              onError={() => setMobileError(true)}
            >
              <source src={mobileVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <div 
              className="w-full min-h-screen bg-cover bg-center"
              style={{ backgroundImage: `url(${posterUrl})` }}
            />
          )}
        </div>
      </div>

      {/* Desktop Video - Fixed only when in viewport */}
      <div 
        className="hidden md:block bg-black relative" 
        ref={containerRef}
        style={{ height: scrollHeight }}
      >
        <div 
          className="w-full h-screen flex items-center justify-center overflow-hidden"
          style={{
            position: isFixed ? 'fixed' : 'relative',
            top: isFixed ? 0 : 'auto',
            left: 0,
            zIndex: 10
          }}
        >
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ 
              transform: `scale(${scale})`,
              transition: 'transform 0.05s linear',
              transformOrigin: 'center center',
            }}
          >
            <div className="relative w-full h-full">
              {!desktopError ? (
                <video
                  ref={desktopVideoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={posterUrl}
                  className="w-full h-full object-cover"
                  onError={() => setDesktopError(true)}
                >
                  <source src={desktopVideoUrl} type="video/mp4" />
                </video>
              ) : (
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${posterUrl})` }}
                />
              )}
              
              {/* Overlays */}
              <div 
                className="absolute inset-0 bg-black pointer-events-none"
                style={{ opacity: 0.15 }}
              />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovementVideoSection;