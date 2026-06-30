import React from 'react';
import MediaHeroSlider from './MediaHeroSlider';
import { getHeroSettings } from '../services/adminService';

interface CarouselHeroSectionProps {
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

const CarouselHeroSection: React.FC<CarouselHeroSectionProps> = (props) => {
  const settings = getHeroSettings();

  const slides = settings.slides.length > 0
    ? settings.slides
    : [
        {
          type: 'video' as const,
          url: '/videos/Bob_Main_Hero__2-transcode.mp4',
          mobileUrl: 'https://ik.imagekit.io/beansofbodhi/Hero/title_video.mp4',
        },
        {
          type: 'video' as const,
          url: 'https://ik.imagekit.io/beansofbodhi/Videos/Movement_Desk_01_1-transcode.mp4?updatedAt=1761228869362',
          mobileUrl: 'https://ik.imagekit.io/beansofbodhi/Hero/movement.mp4',
        },
      ];

  return (
    <MediaHeroSlider
      slides={slides}
      imageDisplayDuration={props.imageDisplayDuration || settings.imageDisplayDuration}
      showDots={props.showDots ?? settings.showDots}
      showArrows={props.showArrows ?? settings.showArrows}
      dotIndicatorBottom={props.dotIndicatorBottom || settings.dotIndicatorBottom}
      dotIndicatorOpacity={props.dotIndicatorOpacity ?? settings.dotIndicatorOpacity}
      dotSize={props.dotSize || settings.dotSize}
      dotActiveWidth={props.dotActiveWidth || settings.dotActiveWidth}
      mobileAspectRatio={props.mobileAspectRatio || settings.mobileAspectRatio}
      desktopAspectRatio={props.desktopAspectRatio || settings.desktopAspectRatio}
      desktopHeight={props.desktopHeight || settings.desktopHeight}
      mobileObjectFit={props.mobileObjectFit || settings.mobileObjectFit}
      desktopObjectFit={props.desktopObjectFit || settings.desktopObjectFit}
    />
  );
};

export default CarouselHeroSection;
