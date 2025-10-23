import { useState, useEffect, useRef } from 'react';
import SEOHead from '../components/SEO/SEOHead';
import StructuredData from '../components/SEO/StructuredData';


// Type definitions
interface NavArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  hidden: boolean;
}

interface HorizontalIndicatorsProps {
  total: number;
  active: number;
  onSelect: (index: number) => void;
}

interface HorizontalSectionProps {
  children: React.ReactNode;
  showSwipeHint?: boolean;
}

interface HorizontalScrollContainerProps {
  sections: React.ReactNode[];
}

// Navigation Arrow Component
const NavArrow = ({ direction, onClick, hidden }: NavArrowProps) => (
  <div
    className={`nav-arrow nav-arrow-${direction} ${hidden ? 'hidden' : ''}`}
    onClick={onClick}
  >
    {direction === 'left' ? '‹' : '›'}
  </div>
);

// Horizontal Indicators Component
const HorizontalIndicators = ({ total, active, onSelect }: HorizontalIndicatorsProps) => (
  <div className="horizontal-indicators">
    {Array.from({ length: total }).map((_, index) => (
      <div
        key={index}
        className={`horizontal-indicator ${index === active ? 'active' : ''}`}
        onClick={() => onSelect(index)}
      />
    ))}
  </div>
);

// Horizontal Section Component
const HorizontalSection = ({ children, showSwipeHint = false }: HorizontalSectionProps) => (
  <div className="horizontal-section">
    {children}
    {showSwipeHint && <div className="swipe-hint">Swipe →</div>}
  </div>
);

// Horizontal Scroll Container Component
const HorizontalScrollContainer = ({ sections }: HorizontalScrollContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleTouchStart = useRef({ x: 0, y: 0 });

  const navigateToSection = (index: number) => {
    if (index >= 0 && index < sections.length && containerRef.current) {
      setCurrentIndex(index);
      setIsScrolling(true);

      const targetScrollLeft = index * containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(() => setIsScrolling(false), 500);
    }
  };

  const updateCurrentIndex = () => {
    if (!isScrolling && containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const containerWidth = containerRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / containerWidth);

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < sections.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      updateCurrentIndex();

      if (containerRef.current) {
        const scrollLeft = containerRef.current.scrollLeft;
        const containerWidth = containerRef.current.clientWidth;
        const targetIndex = Math.round(scrollLeft / containerWidth);
        const targetScrollLeft = targetIndex * containerWidth;

        if (Math.abs(scrollLeft - targetScrollLeft) > 5) {
          containerRef.current.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }, 100);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const deltaX = Math.abs(touchEndX - handleTouchStart.current.x);
    const deltaY = Math.abs(touchEndY - handleTouchStart.current.y);

    // Allow vertical scrolling if gesture is more vertical than horizontal
    if (deltaY > deltaX && deltaY > 30) {
      return;
    }

    // Only navigate horizontally if swipe is significant and horizontal
    if (deltaX > 50 && deltaX > deltaY) {
      e.preventDefault();
      if (touchEndX < handleTouchStart.current.x) {
        navigateToSection(currentIndex + 1);
      } else {
        navigateToSection(currentIndex - 1);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const targetScrollLeft = currentIndex * containerRef.current.clientWidth;
        containerRef.current.scrollTo({
          left: targetScrollLeft,
          behavior: 'auto'
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  return (
    <>
      <div
        ref={containerRef}
        className="horizontal-container"
        onScroll={handleScroll}
        onTouchStart={(e) => {
          handleTouchStart.current = {
            x: e.changedTouches[0].screenX,
            y: e.changedTouches[0].screenY
          };
        }}
        onTouchEnd={handleTouchEnd}
      >
        {sections}
      </div>
      <NavArrow
        direction="left"
        onClick={() => navigateToSection(currentIndex - 1)}
        hidden={currentIndex === 0}
      />
      <NavArrow
        direction="right"
        onClick={() => navigateToSection(currentIndex + 1)}
        hidden={currentIndex === sections.length - 1}
      />
      <HorizontalIndicators
        total={sections.length}
        active={currentIndex}
        onSelect={navigateToSection}
      />
    </>
  );
};

// Hero Section Component (Section 0)
const HeroSection = () => (
  <section
  id="Section0"
  className="snap-section-new snap-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('https://ik.imagekit.io/beansofbodhi/OurStory/0%20Desktop.webp?updatedAt=1761228062335')",
  }}
>
<div className="uui-padding-vertical-xhuge-6">
  <a href="#" className="uui-blogpost02_category-link-2 w-inline-block">
    <div className="text-block-31">OUR STORY</div>
  </a>
  
  {/* Mobile version */}
  <h1 className="block md:hidden text-4xl font-pangaia font-normal tracking-wider leading-tight text-white">
    From <br/><em className='font-pangaia font-normal'>heritage</em><br />
    to Horizons,<br />
    A Journey of Bold<br />
  </h1>
  
  {/* Desktop version */}
  <h1 className="hidden md:block text-4xl md:text-6xl lg:text-7xl font-pangaia font-normal tracking-wider leading-tight text-white">
    From <em className='font-pangaia font-normal'>heritage</em> to Horizons,<br />
    A Journey of Bold <em className='font-pangaia font-normal'>Adventures.</em>
  </h1>
</div>
</section>

);

// Main Our Story Component
const OurStory = () => {
  return (
    <>
      <SEOHead
        title="Our Story - Beans of Bodhi"
        description="Discover the story behind Beans of Bodhi. From adventure-inspired beginnings to sustainable coffee innovation in the Western Ghats, learn about our purpose, craft, and commitment to excellence."
        canonical="https://beansofbodhi.com/our-story"
        keywords="coffee story, adventure coffee, sustainable coffee, Western Ghats coffee, coffee innovation, Indian coffee, specialty coffee"
        ogImage="https://beansofbodhi.com/og-our-story.jpg"
      />
      
      <StructuredData 
        type="breadcrumb" 
        data={[
          { name: 'Home', url: 'https://beansofbodhi.com/' },
          { name: 'Our Story', url: 'https://beansofbodhi.com/our-story' }
        ]} 
      />

      <div className="our-story-wrapper">
        <style>{`
          @font-face {
            font-family: 'PPPangaia-Medium';
            src: url('../fonts/PPPangaia-Medium.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: "PPPangaia-Medium", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overscroll-behavior: none;
          }

          html, body {
            height: 100%;
            scroll-snap-type: y mandatory;
            overflow-y: scroll;
            scroll-behavior: smooth;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          html::-webkit-scrollbar, body::-webkit-scrollbar {
            display: none;
          }

          .our-story-wrapper {
            width: 100%;
          }

          .main-section {
            height: 100vh;
            width: 100%;
            scroll-snap-align: start;
            position: relative;
          }

          .horizontal-container {
            display: flex;
            height: 100vh;
            width: 100%;
            overflow-x: scroll;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .horizontal-container::-webkit-scrollbar {
            display: none;
          }

          .horizontal-section {
            flex: none;
            width: 100vw;
            height: 100vh;
            scroll-snap-align: start;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .horizontal-section img,
          .horizontal-section video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
          }

          .section-content {
            position: relative;
            z-index: 10;
            text-align: center;
            color: white;
            padding: 20px;
            max-width: 600px;
          }

          .text-color-white-3 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
            font-family: "PPPangaia-Medium", sans-serif;
          }

          .section-subtitle {
            font-size: 1.2rem;
            font-weight: 300;
            opacity: 0.9;
            line-height: 1.6;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }

          .horizontal-indicators {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 20;
            display: flex;
            gap: 10px;
          }

          .horizontal-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .horizontal-indicator.active {
            background: rgba(255, 255, 255, 0.9);
            transform: scale(1.2);
          }

          .horizontal-indicator:hover {
            background: rgba(255, 255, 255, 0.7);
          }

          .nav-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 25;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.5);
            background: rgba(0, 0, 0, 0.3);
            color: white;
            font-size: 18px;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.8;
          }

          .nav-arrow:hover {
            background: rgba(0, 0, 0, 0.5);
            border-color: rgba(255, 255, 255, 0.8);
            opacity: 1;
            transform: translateY(-50%) scale(1.05);
          }

          .nav-arrow:active {
            transform: translateY(-50%) scale(0.95);
          }

          .nav-arrow.hidden {
            opacity: 0;
            pointer-events: none;
          }

          .nav-arrow-left {
            left: 20px;
          }

          .nav-arrow-right {
            right: 20px;
          }

          .swipe-hint {
            position: absolute;
            bottom: 80px;
            right: 20px;
            z-index: 15;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            opacity: 0.8;
            writing-mode: vertical-lr;
            text-orientation: mixed;
            animation: fadeInOut 3s infinite;
          }

          @keyframes fadeInOut {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }

          .horizontal-container {
            touch-action: pan-x pan-y;
          }

          @media (max-width: 768px) {
            .horizontal-container {
              touch-action: manipulation;
            }
          }

          .snap-section-new {
            height: 100vh;
            width: 100%;
            scroll-snap-align: start;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          }

          .uui-padding-vertical-xhuge-6 {
            padding: 80px 20px;
            text-align: center;
          }

          .uui-blogpost02_category-link-2 {
            display: inline-block;
            margin-bottom: 20px;
            text-decoration: none;
          }

          .text-block-31 {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .uui-heading-large-2 {
            font-size: 4rem;
            font-weight: 700;
            color: white;
            line-height: 1.2;
            font-family: "PPPangaia-Medium", sans-serif;
          }

          .uui-heading-large-2 em {
            font-style: italic;
            color: #f0f0f0;
          }

          /* Newsletter section styling */
          .newsletter-section-wrapper {
            scroll-snap-align: start;
            scroll-snap-stop: always;
            height: 100vh;
            width: 100vw;
            // display: flex;
            align-items: center;
            justify-content: center;
            // background: #f5f5f5;
          }

          @media (max-width: 768px) {
            .text-color-white-3 {
              font-size: 2.5rem;
            }
            
            .section-subtitle {
              font-size: 1rem;
            }
            
            .section-content {
              max-width: 90%;
              padding: 15px;
            }

            .nav-arrow {
              width: 45px;
              height: 45px;
              font-size: 16px;
            }

            .nav-arrow-left {
              left: 15px;
            }

            .nav-arrow-right {
              right: 15px;
            }

            .swipe-hint {
              font-size: 0.8rem;
              right: 15px;
            }

            .uui-heading-large-2 {
              font-size: 2.5rem;
            }
          }

          @media (max-width: 480px) {
            .text-color-white-3 {
              font-size: 2rem;
            }
            
            .section-subtitle {
              font-size: 0.9rem;
            }
            
            .section-content {
              max-width: 90%;
              padding: 12px;
            }

            .nav-arrow {
              width: 40px;
              height: 40px;
              font-size: 14px;
            }

            .nav-arrow-left {
              left: 10px;
            }

            .nav-arrow-right {
              right: 10px;
            }

            .uui-heading-large-2 {
              font-size: 2rem;
            }
          }
        `}</style>

        {/* Hero Section */}
        <HeroSection />

        {/* Section 1: Redefining */}
        <div className="main-section">
          <HorizontalScrollContainer
            sections={[
              <HorizontalSection key="1a" showSwipeHint>
                <video autoPlay muted loop playsInline>
                  <source src="https://ik.imagekit.io/beansofbodhi/OurStory/Home_Video_02-transcode.mp4?updatedAt=1761228289772" type="video/mp4" />
                </video>
                <div className="section-content">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">
                    Redefining the <em>Rules</em> of <em>Coffee</em>
                  </h1>
                </div>

              </HorizontalSection>,
              <HorizontalSection key="1b">
                <img src="https://ik.imagekit.io/beansofbodhi/OurStory/1_2.webp?updatedAt=1761228062782" alt="Redefining" loading="lazy" />
                <div className="section-content">
                  <p className="section-subtitle">We don't follow trends-we follow purpose. Beans of Bodhi was born to rewrite what coffee stands for. From India to the World, here quality is a lived practice. From the high-altitude farms of Western Ghats to our in-house curing works, we obsess over every detail. We believe coffee should move people-not just with caffeine, but with meaning. That's why we do things differently, not for approval, but for excellence. For us, craft means care, and purpose means progress. And the Youth? They deserve better. We don't just roast beans-we ignite journeys. Rooted in craft, driven by values, and never bound by convention</p>
                </div>
              </HorizontalSection>
            ]}
          />
        </div>

        {/* Section 2: Our Promise */}
        <div className="main-section">
          <HorizontalScrollContainer
            sections={[
              <HorizontalSection key="2a" showSwipeHint>
                <img src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Our%20Promise/02Promise.webp?updatedAt=1757728817710" alt="Our Promise" loading="lazy" />
                <div className="section-content">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">
                    Our <em>Promise,</em> Our <em>Practice</em>
                  </h1>
                </div>

              </HorizontalSection>,
              <HorizontalSection key="2b">
                <img src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Our%20Promise/02Promise2.webp?updatedAt=1757728818039" alt="Our Promise" loading="lazy" />
                <div className="section-content">
                  <p className="section-subtitle">Integrity at Beans of Bodhi isn't just an accessory-it's the foundation. We look in the mirror often: questioning, evolving, and never settling. From farm to roast, we maintain full transparency, take accountability, and honor every commitment we make-to farmers, to customers, to the planet. Our promise? That every sip reflects our values, our craft, and our courage to do things differently</p>
                </div>
              </HorizontalSection>
            ]}
          />
        </div>

        {/* Section 3: Our Guarantee */}
        <div className="main-section">
          <HorizontalScrollContainer
            sections={[
              <HorizontalSection key="3a" showSwipeHint>
                <img src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Our%20Guarentee/03Guarentee.webp?updatedAt=1757728650876" alt="Our Guarantee" loading="lazy" />
                <div className="section-content">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">Our <em>Guarantee</em></h1>
                </div>
              </HorizontalSection>,
              <HorizontalSection key="3b">
                <img src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Our%20Guarentee/03Guarentee2.webp?updatedAt=1757728752562" alt="Our Guarantee" loading="lazy" />
                <div className="section-content">
                  <p className="section-subtitle">We stand behind everything we make. If it's not extraordinary, it's not Bodhi. We work directly with trusted farmers who share our passion for sustainability and craftsmanship. Each bean is hand-selected and slow-cured in our own facilities to bring out the natural depth and flavor that defines Beans of Bodhi</p>
                </div>
              </HorizontalSection>
            ]}
          />
        </div>

        {/* Section 4: Responsibility */}
        <div className="main-section">
          <HorizontalScrollContainer
            sections={[
              <HorizontalSection key="4a" showSwipeHint>
                <img src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Responsibility/04Impact.webp?updatedAt=1757728597869" alt="Responsibility" loading="lazy" />
                <div className="section-content">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">We take <em>Responsibility</em> for our <em>Impact</em> on <em>People, Planet</em> & <em>Purpose</em></h1>
                </div>
              </HorizontalSection>,
              <HorizontalSection key="4b">
                <img src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Responsibility/R-2.webp?updatedAt=1757551486012" alt="Responsibility" loading="lazy" />
                <div className="section-content">
                  <p className="section-subtitle">We're more than a coffee brand-we're a mindful movement driven by quality. We empower the farmers behind our beans and the lives they fuel, supporting fair wages and regenerative farming. Our purpose goes beyond coffee. We believe India's youth find purpose, discipline and impact when they reconnect with nature through action sports and bold movement-because real change begins outside comfort zones</p>
                </div>
              </HorizontalSection>
            ]}
          />
        </div>

        {/* Section 5: Process */}
        <div className="main-section">
          <HorizontalScrollContainer
            sections={[
              <HorizontalSection key="5a" showSwipeHint>
                <video autoPlay muted loop playsInline>
                  <source src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Process.mp4?updatedAt=1757551521435" type="video/mp4" />
                </video>
                <div className="section-content">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">The more you <em>Know,</em> The more you <em>Need</em></h1>
                </div>
              </HorizontalSection>,
              <HorizontalSection key="5b">
                <img src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Our%20Guarentee/OG-2.webp?updatedAt=1757551486055" alt="Process" loading="lazy" />
                <div className="section-content">
                  <p className="section-subtitle">Because once you understand where your coffee comes from-how it's sourced, cured, and crafted- there's no going back. Our mission is to make Indian coffee extraordinary again. We work from root to roast with intention, crafting high-performance brews that carry culture, complexity, and care. Because the more truth in your cup, the more meaning in your day</p>
                </div>
              </HorizontalSection>
            ]}
          />
        </div>

        {/* Section 6: Commitment */}
        <div className="main-section">
          <HorizontalScrollContainer
            sections={[
              <HorizontalSection key="6a" showSwipeHint>
                <img src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Commitment/Commitment1.webp?updatedAt=1757728489266" alt="Commitment" loading="lazy" />
                <div className="section-content">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">The <em>Commitment</em> Forward</h1>
                </div>
              </HorizontalSection>,
              <HorizontalSection key="6b">
                <img src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Commitment/Commitment2.webp?updatedAt=1757728488952" alt="Commitment" loading="lazy" />
                <div className="section-content">
                  <p className="section-subtitle">Every decision starts with responsibility-to people, planet, and purpose. We're not just building a coffee company-we're shaping a more mindful future. Our vision: a world where every sip fuels not just energy, but impact. With our 1% for the Planet and 1% for the Community pledge, we channel profit into purpose-regenerating ecosystems and uplifting local cultures. Each blend is proof that progress can taste good.</p>
                </div>
              </HorizontalSection>
            ]}
          />
        </div>

        {/* Section 7: Era */}
        <div className="main-section">
          <HorizontalScrollContainer
            sections={[
              <HorizontalSection key="7a" showSwipeHint>
                <img src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Era/Era1.webp?updatedAt=1757728389579" alt="New Era" loading="lazy" />
                <div className="section-content">
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white"><em>Stepping</em> into a new <em>Era</em></h2>
                </div>
              </HorizontalSection>,
              <HorizontalSection key="7b">
                <img src="https://ik.imagekit.io/clc2tp5mo/About%20Us/Era/Era2.webp?updatedAt=1757728389360" alt="New Era" loading="lazy" />
                <div className="section-content">
                  <p className="section-subtitle">This isn't just about coffee. It's a shift in mindset-towards purpose, quality, and conscious consumption. Dedicating to a generation that refuses to compromise</p>
                </div>
              </HorizontalSection>
            ]}
          />
        </div>

     
      </div>
    </>
  );
};

export default OurStory;