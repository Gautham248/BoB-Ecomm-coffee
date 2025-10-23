import React from 'react';
import MediaHeroSlider from './MediaHeroSlider';

interface MediaSlide {
  type: 'video' | 'image';
  url: string;
  headline?: string;
  posterUrl?: string;
}

interface CarouselHeroSectionProps {
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

const CarouselHeroSection: React.FC<CarouselHeroSectionProps> = ({
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true
}) => {
  const slides: MediaSlide[] = [
    {
      type: 'video',
      url: 'https://ik.imagekit.io/7ujz6ljli/Videos/Bob_Main_Hero__2.mp4',
    
    },
  
    {
      type: 'video',
      url: 'https://ik.imagekit.io/7ujz6ljli/Movement/Movement_Desk_01_1.mp4?updatedAt=1760249904962',
     
    }
  ];

  return (
    <MediaHeroSlider
      slides={slides}
      autoPlayInterval={autoPlayInterval}
      showDots={showDots}
      showArrows={showArrows}
    />
  );
};

export default CarouselHeroSection;