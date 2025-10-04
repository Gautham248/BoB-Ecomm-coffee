import React from 'react';
import SEOHead from '../components/SEO/SEOHead';
import HeroSection from '../components/HeroSection';
import CollectionsSection from '../components/CollectionsSection';
import FeaturedSection from '../components/FeaturedSection';
import VideoHeroSection from '../components/VideoHeroSection';
import StorySection from '../components/StorySection';
import NewsletterSection from '../components/NewsletterSection';
import CarouselHeroSection from '../components/CarouselHeroSection';
import FeaturedProducts from '../components/FeaturedProducts';

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
      
      <CarouselHeroSection/>
      <CollectionsSection />
      <VideoHeroSection />
      {/* <FeaturedSection /> */}
      <FeaturedProducts/>
      <StorySection />
      <NewsletterSection />
    </>
  );
};

export default Home;