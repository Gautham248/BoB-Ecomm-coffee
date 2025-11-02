import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface HomeMovementProps {
  desktopVideoUrl?: string;
  mobileVideoUrl?: string;
  posterUrl?: string;
  scrollHeight?: string;
  mobileAspectRatio?: string;
  desktopHeight?: string;
  mobileObjectFit?: 'cover' | 'contain' | 'fill';
  desktopObjectFit?: 'cover' | 'contain' | 'fill';
  overlayOpacity?: number;
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
  const [textTranslateY, setTextTranslateY] = useState(100);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
      
      if (rect.top > 0) {
        setScale(0.7);
        setIsFixed(false);
        setIsComplete(false);
        setTextOpacity(0);
        setTextTranslateY(100);
        return;
      }
      
      if (rect.bottom <= windowHeight) {
        setScale(1.0);
        setIsFixed(false);
        setIsComplete(true);
        setTextOpacity(1);
        setTextTranslateY(0);
        return;
      }
      
      setIsFixed(true);
      setIsComplete(false);
      
      const scrolledIntoContainer = Math.abs(rect.top);
      const containerHeight = containerRef.current.offsetHeight - windowHeight;
      const progress = Math.min(1, scrolledIntoContainer / containerHeight);
      const scaleProgress = Math.min(1, progress / 0.95);
      const newScale = 0.7 + (scaleProgress * 0.3);
      setScale(newScale);
      
      // Text opacity and translateY: starts after 95% progress, fully visible at 100%
      const textProgress = Math.max(0, Math.min(1, (progress - 0.95) / 0.05));
      setTextOpacity(textProgress);
      setTextTranslateY(100 - (textProgress * 100));
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
        className="block md:hidden relative w-full bg-black overflow-hidden"
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

        {/* Content - Positioned in bottom half */}
        <div className="absolute inset-0 flex items-end">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-8">
            <div 
              className={`flex flex-col items-start justify-end transition-opacity duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="max-w-2xl">
                <h1 
                  className="text-white mb-3"
                  style={{ fontFamily: "'Aktiv', sans-serif" }}
                >
                  <span className="block text-lg font-bold mb-1">THE</span>
                  <span className="block text-3xl font-black italic leading-none mb-1">ART OF</span>
                  <span className="block text-3xl font-black italic leading-none mb-2">ESPRESSO,</span>
                  <span 
                    className="inline-block text-2xl font-black italic leading-none px-4 py-2"
                    style={{
                      border: '2px solid white',
                      transform: 'skewX(-10deg)',
                      borderRadius: '8px'
                    }}
                  >
                    <span style={{ display: 'inline-block', transform: 'skewX(10deg)' }}>
                      LIBERATED
                    </span>
                  </span>
                </h1>

                {/* Button - Below Text */}
                <button
                  onClick={handleExploreClick}
                  className="bg-white text-black font-bold text-xs uppercase px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-300 cursor-pointer mt-1"
                  style={{ fontFamily: "'Aktiv', sans-serif" }}
                >
                  {buttonText}
                </button>
              </div>
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
                  transform: `translateY(${textTranslateY}px)`,
                  transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
                }}
              >
                <div className="flex flex-col items-start justify-center h-full">
                  <div className="max-w-2xl">
                    <h1 
                      className="text-white mb-6"
                      style={{ fontFamily: "'Aktiv', sans-serif" }}
                    >
                      <span className="block text-3xl lg:text-4xl font-bold mb-2">THE</span>
                      <span className="block text-6xl lg:text-7xl xl:text-8xl font-black italic leading-none mb-2">ART OF</span>
                      <span className="block text-6xl lg:text-7xl xl:text-8xl font-black italic leading-none mb-4">ESPRESSO,</span>
                      <span 
                        className="inline-block text-5xl lg:text-6xl xl:text-7xl font-black italic leading-none px-6 py-3"
                        style={{
                          border: '2px solid white',
                          transform: 'skewX(-10deg)',
                          borderRadius: '16px'
                        }}
                      >
                        <span style={{ display: 'inline-block', transform: 'skewX(10deg)' }}>
                          LIBERATED
                        </span>
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