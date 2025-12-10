import React from 'react';
import MediaHeroSlider, { MediaSlide } from './MediaHeroSlider';

interface CarouselHeroSectionProps {
  imageDisplayDuration?: number; // Changed from autoPlayInterval
  showDots?: boolean;
  showArrows?: boolean;
  dotIndicatorBottom?: { mobile: number; desktop: number };
  dotIndicatorOpacity?: number;
  dotSize?: { mobile: number; desktop: number };
  dotActiveWidth?: { mobile: number; desktop: number };
  mobileAspectRatio?: string;
  desktopAspectRatio?: string; // New prop
  desktopHeight?: string;
  mobileObjectFit?: 'cover' | 'contain' | 'fill';
  desktopObjectFit?: 'cover' | 'contain' | 'fill';
}

const CarouselHeroSection: React.FC<CarouselHeroSectionProps> = ({
  imageDisplayDuration = 5000,
  showDots = true,
  showArrows = true,
  dotIndicatorBottom,
  dotIndicatorOpacity,
  dotSize,
  dotActiveWidth,
  mobileAspectRatio = '1 / 1',
  desktopAspectRatio, // New prop
  desktopHeight = '100vh',
  mobileObjectFit = 'cover',
  desktopObjectFit = 'cover'
}) => {
  const slides: MediaSlide[] = [
    {
      type: 'video',
      url: '/videos/Bob_Main_Hero__2-transcode.mp4',
      mobileUrl: 'https://ik.imagekit.io/beansofbodhi/Hero/title_video.mp4',
    },
    {
      type: 'video',
      url: 'https://ik.imagekit.io/beansofbodhi/Videos/Movement_Desk_01_1-transcode.mp4?updatedAt=1761228869362',
      mobileUrl: 'https://ik.imagekit.io/beansofbodhi/Hero/movement.mp4',
    }

  ];

  return (
    <MediaHeroSlider
      slides={slides}
      imageDisplayDuration={imageDisplayDuration}
      showDots={showDots}
      showArrows={showArrows}
      dotIndicatorBottom={dotIndicatorBottom}
      dotIndicatorOpacity={dotIndicatorOpacity}
      dotSize={dotSize}
      dotActiveWidth={dotActiveWidth}
      mobileAspectRatio={mobileAspectRatio}
      desktopAspectRatio={desktopAspectRatio}
      desktopHeight={desktopHeight}
      mobileObjectFit={mobileObjectFit}
      desktopObjectFit={desktopObjectFit}
    />
  );
};

export default CarouselHeroSection;