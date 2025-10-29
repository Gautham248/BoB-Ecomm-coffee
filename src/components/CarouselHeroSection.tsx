// import React from 'react';
// import MediaHeroSlider from './MediaHeroSlider';

// interface MediaSlide {
//   type: 'video' | 'image';
//   url: string;
//   headline?: string;
//   posterUrl?: string;
// }

// interface CarouselHeroSectionProps {
//   autoPlayInterval?: number;
//   showDots?: boolean;
//   showArrows?: boolean;
// }

// const CarouselHeroSection: React.FC<CarouselHeroSectionProps> = ({
//   autoPlayInterval = 5000,
//   showDots = true,
//   showArrows = true
// }) => {
//   const slides: MediaSlide[] = [
//     {
//       type: 'video',
//       url: 'https://ik.imagekit.io/beansofbodhi/Videos/Bob_Main_Hero__2-transcode.mp4?updatedAt=1761228804041',
//     },
//     {
//       type: 'video',
//       url: 'https://ik.imagekit.io/beansofbodhi/Videos/Movement_Desk_01_1-transcode.mp4?updatedAt=1761228869362',
//     }
//   ];
  

//   return (
//     <MediaHeroSlider
//   slides={slides}
//   autoPlayInterval={5000}
//   showDots={true}
//   showArrows={true}
//   bannerHeight={{ mobile: 60, desktop: 80 }}
//   bannerOpacity={0.9}
//   dotIndicatorBottom={{ mobile: 20, desktop: 32 }}
//   dotIndicatorOpacity={1}
// />
//   );
// };

// export default CarouselHeroSection;
import React from 'react';
import MediaHeroSlider from './MediaHeroSlider';

interface MediaSlide {
  type: 'video' | 'image';
  url: string;
  headline?: string;
  text?: string;
  posterUrl?: string;
}

interface CarouselHeroSectionProps {
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  bannerHeight?: { mobile: number; desktop: number };
  bannerOpacity?: number;
  dotIndicatorBottom?: { mobile: number; desktop: number };
  dotIndicatorOpacity?: number;
  dotSize?: { mobile: number; desktop: number };
  dotActiveWidth?: { mobile: number; desktop: number };
  mobileAspectRatio?: string;
  desktopHeight?: string;
  mobileObjectFit?: 'cover' | 'contain' | 'fill';
  desktopObjectFit?: 'cover' | 'contain' | 'fill';
}

const CarouselHeroSection: React.FC<CarouselHeroSectionProps> = ({
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  bannerHeight,
  bannerOpacity,
  dotIndicatorBottom,
  dotIndicatorOpacity,
  dotSize,
  dotActiveWidth,
  mobileAspectRatio = '1 / 1',
  desktopHeight = '100vh',
  mobileObjectFit = 'cover',
  desktopObjectFit = 'cover'
}) => {
  const slides: MediaSlide[] = [
    {
      type: 'video',
      url: 'https://ik.imagekit.io/beansofbodhi/Videos/Bob_Main_Hero__2-transcode.mp4?updatedAt=1761228804041',
      // headline: 'Welcome',
      // text: 'Optional description text'
    },
    {
      type: 'video',
      url: 'https://ik.imagekit.io/beansofbodhi/Videos/Movement_Desk_01_1-transcode.mp4?updatedAt=1761228869362',
      // headline: 'Movement',
      // text: 'Experience the flow'
    }
  ];
  
  return (
    <MediaHeroSlider
      slides={slides}
      autoPlayInterval={autoPlayInterval}
      showDots={showDots}
      showArrows={showArrows}
      bannerHeight={bannerHeight}
      bannerOpacity={bannerOpacity}
      dotIndicatorBottom={dotIndicatorBottom}
      dotIndicatorOpacity={dotIndicatorOpacity}
      dotSize={dotSize}
      dotActiveWidth={dotActiveWidth}
      mobileAspectRatio={mobileAspectRatio}
      desktopHeight={desktopHeight}
      mobileObjectFit={mobileObjectFit}
      desktopObjectFit={desktopObjectFit}
    />
  );
};

export default CarouselHeroSection;