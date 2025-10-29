import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface HomeMovementProps {
  desktopVideoUrl?: string;
  mobileVideoUrl?: string;
  posterUrl?: string;
  scrollHeight?: string;
  mobileAspectRatio?: string; // e.g., '1 / 1', '4 / 3', '16 / 9'
  desktopHeight?: string; // e.g., '100vh', '80vh', '600px'
  mobileObjectFit?: 'cover' | 'contain' | 'fill';
  desktopObjectFit?: 'cover' | 'contain' | 'fill';
  overlayOpacity?: number; // 0 to 1
  buttonPosition?: 'left' | 'right';
  buttonText?: string;
}

const HomeMovement: React.FC<HomeMovementProps> = ({
  desktopVideoUrl = 'https://ik.imagekit.io/beansofbodhi/Videos/Movement_Desk_01_1-transcode.mp4?updatedAt=1761228869362',
  mobileVideoUrl = 'https://ik.imagekit.io/beansofbodhi/Videos/Movement_Desk_01_1-transcode.mp4?updatedAt=1761228869362',
  posterUrl = 'https://ik.imagekit.io/7ujz6ljli/Movement/Movement_Hero-p-1600.png?updatedAt=1760249831197',
  scrollHeight = '400vh',
  mobileAspectRatio = '1 / 1',
  desktopHeight = '100vh',
  mobileObjectFit = 'cover',
  desktopObjectFit = 'cover',
  overlayOpacity = 0.1,
  buttonPosition = 'left',
  buttonText = 'Explore'
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileError, setMobileError] = useState(false);
  const [desktopError, setDesktopError] = useState(false);
  const [scale, setScale] = useState(0.7);
  const [isFixed, setIsFixed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [textOpacity, setTextOpacity] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Trigger text animation after component mounts (mobile only)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Autoplay videos
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
        setIsComplete(false);
        setTextOpacity(0);
        return;
      }
      
      // When we've scrolled past the container completely
      if (rect.bottom <= windowHeight) {
        setScale(1.0);
        setIsFixed(false);
        setIsComplete(true);
        setTextOpacity(1);
        return;
      }
      
      // Container is in viewport - fix it and scale
      setIsFixed(true);
      setIsComplete(false);
      
      // Calculate how far we've scrolled into the container
      const scrolledIntoContainer = Math.abs(rect.top);
      
      // Total scroll distance for the container
      const containerHeight = containerRef.current.offsetHeight - windowHeight;
      
      // Calculate progress through the container (0 to 1)
      const progress = Math.min(1, scrolledIntoContainer / containerHeight);
      
      // Scale from 0.7 to 1.0, but complete at 95% of scroll (save last 5% for text)
      const scaleProgress = Math.min(1, progress / 0.95);
      const newScale = 0.7 + (scaleProgress * 0.3);
      setScale(newScale);
      
      // Text opacity: starts fading in after 95% progress, fully visible at 100%
      const textProgress = Math.max(0, Math.min(1, (progress - 0.95) / 0.05));
      setTextOpacity(textProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExploreClick = () => {
    navigate('/movement');
  };

  const mobileObjectFitClass = `object-${mobileObjectFit}`;
  const desktopObjectFitClass = `object-${desktopObjectFit}`;

  return (
    <>
      {/* Mobile Version */}
      <section 
        className="block md:hidden relative w-full bg-black overflow-hidden flex items-center justify-center"
        style={{
          height: '100vw',
          aspectRatio: mobileAspectRatio
        }}
      >
        {/* Mobile Video Background */}
        {!mobileError ? (
          <video
            ref={mobileVideoRef}
            autoPlay
            loop
            muted
            playsInline
            poster={posterUrl}
            className={`absolute inset-0 w-full h-full ${mobileObjectFitClass}`}
            onError={() => setMobileError(true)}
          >
            <source src={mobileVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <div 
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${mobileObjectFitClass}`}
            style={{ backgroundImage: `url(${posterUrl})` }}
          />
        )}

        {/* Dark Overlay */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div 
            className={`flex flex-col items-start justify-center h-full transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="max-w-2xl">
            <h1 
            className="text-white mb-6"
            style={{ fontFamily: "'Aktiv', sans-serif" }}
            >
            <span className="block text-2xl font-normal mb-2">THE</span>
            <span className="block text-5xl font-black italic leading-none mb-2">ART OF</span>
            <span className="block text-5xl font-black italic leading-none mb-4">ESPRESSO,</span>
            <span className="inline-block text-4xl font-black italic leading-none px-6 py-3 border-4 border-white rounded-2xl">
                LIBERATED
            </span>
            </h1>

              {/* Button - Below Text */}
              <button
                    onClick={handleExploreClick}
                    className="bg-white text-black font-bold text-sm uppercase px-5 py-4 rounded-md hover:bg-gray-200 transition-colors duration-300 cursor-pointer mt-2"
                    style={{ fontFamily: "'Aktiv', sans-serif" }}
                    >
                    {buttonText}
                    </button>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Version - With Scroll Effect */}
      <div 
        className="hidden md:block bg-black relative" 
        ref={containerRef}
        style={{ height: scrollHeight }}
      >
        <div 
          className="w-full flex items-center justify-center overflow-hidden"
          style={{
            height: desktopHeight,
            position: isFixed ? 'fixed' : 'absolute',
            top: isFixed || !isComplete ? 0 : 'auto',
            bottom: isComplete && !isFixed ? 0 : 'auto',
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
              {/* Desktop Video Background */}
              {!desktopError ? (
                <video
                  ref={desktopVideoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={posterUrl}
                  className={`absolute inset-0 w-full h-full ${desktopObjectFitClass}`}
                  onError={() => setDesktopError(true)}
                >
                  <source src={desktopVideoUrl} type="video/mp4" />
                </video>
              ) : (
                <div 
                  className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${desktopObjectFitClass}`}
                  style={{ backgroundImage: `url(${posterUrl})` }}
                />
              )}

              {/* Overlays */}
              <div 
                className="absolute inset-0 bg-black pointer-events-none"
                style={{ opacity: overlayOpacity }}
              />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%)',
                }}
              />

              {/* Content */}
              <div 
                className="relative z-10 w-full max-w-7xl mx-auto px-8 h-full"
                style={{ 
                  opacity: textOpacity,
                  transition: 'opacity 0.3s ease-out'
                }}
              >
                <div className="flex flex-col items-start justify-center h-full">
                  <div className="max-w-2xl">
                  <h1 
    className="text-white mb-6"
    style={{ fontFamily: "'Aktiv', sans-serif" }}
    >
    <span className="block text-3xl lg:text-4xl font-normal mb-2">THE</span>
    <span className="block text-6xl lg:text-7xl xl:text-8xl font-black italic leading-none mb-2">ART OF</span>
    <span className="block text-6xl lg:text-7xl xl:text-8xl font-black italic leading-none mb-4">ESPRESSO,</span>
    <span className="inline-block text-5xl lg:text-6xl xl:text-7xl font-black italic leading-none px-6 py-3 border-4 border-white rounded-2xl">
        LIBERATED
  </span>
                    </h1>

                    {/* Button - Below Text on Left */}
                    <button
                    onClick={handleExploreClick}
                    className="bg-white text-black font-bold text-sm uppercase px-5 py-4 rounded-md hover:bg-gray-200 transition-colors duration-300 cursor-pointer mt-2"
                    style={{ fontFamily: "'Aktiv', sans-serif" }}
                    >
                    {buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeMovement;