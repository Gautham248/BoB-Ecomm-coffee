import React from 'react';
import SEOHead from '../components/SEO/SEOHead';
// import HeroSection from '../components/HeroSection';
import CollectionsSection from '../components/CollectionsSection';
import FeaturedSection from '../components/FeaturedSection';
import StorySection from '../components/StorySection';
// import NewsletterSection from '../components/NewsletterSection';
import CarouselHeroSection from '../components/CarouselHeroSection';
// import FeaturedProducts from '../components/FeaturedProducts';
import VideoHeroSection from '../components/VideoHeroSection';
import BusinessSection from '../components/BusinessSection';
import HomeMovement from '../components/Movement/HomeMovement';

const Home: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Premium Specialty Coffee from Western Ghats"
        description="Discover Beans of Bodhi's exceptional coffee collection. Sustainably sourced from the Western Ghats, our premium blends fuel adventure and support environmental conservation."
        canonical="https://beansofbodhi.com/"
        keywords="specialty coffee, premium coffee, Western Ghats coffee, sustainable coffee, arabica coffee, robusta coffee, adventure coffee, eco-friendly coffee"
        ogImage="https://beansofbodhi.com/og-homepage.jpg"
      />


      <CarouselHeroSection
        imageDisplayDuration={5000} // Changed from autoPlayInterval={3000}
        showDots={true}
        showArrows={true}
        dotIndicatorBottom={{ mobile: 10, desktop: 15 }}
        dotIndicatorOpacity={0.9}
        dotSize={{ mobile: 6, desktop: 12 }}
        dotActiveWidth={{ mobile: 20, desktop: 32 }}
        mobileAspectRatio="1 / 1"
        desktopAspectRatio="16 / 9"
        mobileObjectFit="cover"
        desktopObjectFit="cover"
      />
      {/* <VideoHeroSection videoUrl="https://ik.imagekit.io/7ujz6ljli/Videos/Bob_Main_Hero__2.mp4" /> */}
      {/* <CollectionsSection /> */}
      <CollectionsSection
        mobileCarouselItemWidth={60}
        mobileCarouselSideOpacity={0.9}
        mobileCarouselSideScale={0.9}
      />

      <VideoHeroSection
        videoUrl="https://ik.imagekit.io/beansofbodhi/OurStory/Home_Video_02-transcode.mp4?updatedAt=1761228289772"
        headline="Responsibly <em>Sourced,</em><br/><em>Rooted in</em> Purpose"
        posterUrl="your-poster-image.jpg" // Optional: Add a poster image
        mobileAspectRatio="1 / 1" // Square on mobile
        desktopHeight="100vh" // Full viewport height on desktop
        mobileObjectFit="cover" // Fill container on mobile
        desktopObjectFit="cover" // Fill container on desktop
        overlayOpacity={0.3} // Dark overlay opacity (0-1)
        headlineBorderOpacity={0.3} // Border opacity (0-1)
        headlinePadding={{ mobile: '10px 20px', desktop: '32px 56px' }}
        headlineBorderRadius="9999px" // Fully rounded border
        headlineFontSize={{ mobile: '14px', desktop: '36px' }}
      />
      <FeaturedSection />
      <HomeMovement />
      <BusinessSection />
      <StorySection />
      <VideoHeroSection videoUrl="https://ik.imagekit.io/beansofbodhi/Videos/1-Planet_1-transcode.mp4?updatedAt=1761228828643" />

    </>
  );
};

export default Home;