import { useEffect, useState } from 'react';

interface HeroSectionProps {
  backgroundImageDesktop?: string;
  backgroundImageMobile?: string;
  alt?: string;
}

const HeroImageSection = ({
  backgroundImageDesktop,
  backgroundImageMobile,
  alt = "Hero background"
}: HeroSectionProps) => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>('');

  if (!backgroundImageDesktop && !backgroundImageMobile) {
    console.warn('HeroImageSection: At least one of backgroundImageDesktop or backgroundImageMobile must be provided');
  }

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      
      if (isMobile && backgroundImageMobile) {
        setBackgroundUrl(backgroundImageMobile);
      } else if (!isMobile && backgroundImageDesktop) {
        setBackgroundUrl(backgroundImageDesktop);
      } else if (backgroundImageDesktop) {
        setBackgroundUrl(backgroundImageDesktop);
      } else if (backgroundImageMobile) {
        setBackgroundUrl(backgroundImageMobile);
      }
    };

    // Set initial background
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [backgroundImageDesktop, backgroundImageMobile]);

  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        {backgroundUrl && (
          <img
            src={backgroundUrl}
            alt={alt}
            className="w-full h-full object-cover object-bottom"
          />
        )}
      </div>

      {/* Optional overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content container - you can add text or other elements here */}
      <div className="relative z-10 h-full flex items-center justify-center">
        {/* Add your hero content here if needed */}
      </div>
    </section>
  );
};

export default HeroImageSection;