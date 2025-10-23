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
      
      <CarouselHeroSection/>
      {/* <VideoHeroSection videoUrl="https://ik.imagekit.io/7ujz6ljli/Videos/Bob_Main_Hero__2.mp4" /> */}
      <CollectionsSection />
      <VideoHeroSection videoUrl="https://ik.imagekit.io/beansofbodhi/OurStory/Home_Video_02-transcode.mp4?updatedAt=1761228289772" 
      headline="Responsibly <em>Sourced,</em><br/><em>Rooted in</em> Purpose"
      />
      <FeaturedSection />
      <HomeMovement/>
      <BusinessSection/>
      <StorySection />
      <VideoHeroSection videoUrl="https://ik.imagekit.io/beansofbodhi/Videos/1-Planet_1-transcode.mp4?updatedAt=1761228828643" />

    </>
  );
};

export default Home;