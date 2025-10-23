import React, { useState, useEffect, useRef } from 'react';

interface VideoHeroSectionProps {
  videoUrl: string;
  headline?: string;
  posterUrl?: string; // Add poster image for initial display
}

const VideoHeroSection: React.FC<VideoHeroSectionProps> = ({ 
  videoUrl, 
  headline,
  posterUrl 
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-gray-900">
      {/* Poster Image - Shows while video loads */}
      {posterUrl && !isVideoLoaded && (
        <img
          src={posterUrl}
          alt="Hero background"
          className="w-full h-auto block object-cover"
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
          preload="metadata" // Only load metadata initially
          poster={posterUrl}
          onLoadedData={handleVideoLoaded}
          className={`w-full h-auto block object-cover transition-opacity duration-500 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Optional Headline */}
      {headline && (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4 md:px-6">
          <div className="inline-block border border-white/30 rounded-full px-5 py-2.5 md:px-14 md:py-8">
            <h1
              className="text-sm md:text-4xl lg:text-4xl font-pangaia font-medium tracking-wide text-white leading-relaxed"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoHeroSection;