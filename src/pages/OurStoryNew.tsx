import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalSnapSectionProps {
  children: ReactNode;
  panelCount?: number;
}

const HorizontalSnapSection = ({ children, panelCount = 2 }: HorizontalSnapSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    const index = Math.round(container.scrollLeft / container.offsetWidth);
    setCurrentIndex(index);
  };

  return (
    <div className="h-full w-full relative">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-x-scroll snap-x snap-mandatory scroll-smooth flex scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
      
      {panelCount > 1 && (
  <>
    {currentIndex > 0 && (
      <button
        onClick={() => scroll('left')}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-opacity z-20 hidden sm:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
    )}

    {currentIndex < panelCount - 1 && (
      <button
        onClick={() => scroll('right')}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-opacity z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    )}
  </>
)}


      {panelCount > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {Array.from({ length: panelCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const container = scrollRef.current;
                if (container) {
                  container.scrollTo({
                    left: index * container.offsetWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index 
                  ? 'bg-white w-8' 
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface HorizontalPanelProps {
  bgImage?: string;
  bgVideo?: string;
  children?: ReactNode;
}

const HorizontalPanel = ({ bgImage, bgVideo, children }: HorizontalPanelProps) => (
  <div className="h-full min-w-full snap-start snap-always flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative">
    {bgVideo && (
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
    )}
    {bgImage && !bgVideo && (
      <img 
        src={bgImage} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
    )}
    
    <div className="absolute inset-0 bg-black/30" />
    
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      {children}
    </div>
  </div>
);

const navigationItems = [
  { id: 'heritage', label: 'Heritage' },
  { id: 'redefining', label: 'Purpose' },
  { id: 'promise', label: 'Integrity' },
  { id: 'guarantee', label: 'Craft' },
  { id: 'responsibility', label: 'Impact' },
  { id: 'process', label: 'Truth' },
  { id: 'commitment', label: 'Vision' },
  { id: 'era', label: 'Movement' }
];

export default function OurStoryNew() {
  const [activeSection, setActiveSection] = useState('heritage');
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mainScrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const sections = container.querySelectorAll('section[data-section]');
      const scrollPosition = container.scrollTop + container.clientHeight / 2;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionBottom = sectionTop + (section as HTMLElement).offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          const sectionId = section.getAttribute('data-section');
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const navContainer = navScrollRef.current;
    if (!navContainer) return;

    const activeButton = navContainer.querySelector(`[data-nav="${activeSection}"]`);
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    const container = mainScrollRef.current;
    if (!container) return;

    const section = container.querySelector(`[data-section="${sectionId}"]`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-[110vh] w-full">
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          .snap-container::-webkit-scrollbar {
            display: none;
          }
          
          .snap-container {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .nav-scroll::-webkit-scrollbar {
            display: none;
          }
          
          .nav-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `
      }} />

      <div 
        ref={mainScrollRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth snap-container"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
          <section data-section="heritage" className="h-full w-full snap-start snap-always">
            <HorizontalSnapSection panelCount={1}>
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/0%20Desktop.webp?updatedAt=1761228062335">
                <div className="text-center px-6 max-w-5xl">
                  <div className="inline-block mb-6 px-4 py-2">
                    <div className="text-white/70 text-sm tracking-[0.2em] uppercase">
                      OUR STORY
                    </div>
                  </div>
                  
                  <h1 className="block md:hidden text-4xl font-pangaia font-normal tracking-wider leading-tight text-white">
                    From <br/><em className='font-pangaia font-normal'>heritage</em><br />
                    to Horizons,<br />
                    A Journey of Bold<br />
                    <em className='font-pangaia font-normal'>Adventures.</em>
                  </h1>
                  
                  <h1 className="hidden md:block text-4xl md:text-6xl lg:text-6xl font-pangaia font-normal tracking-wider leading-tight text-white">
                    From <em className='font-pangaia font-normal'>heritage</em> to Horizons,<br />
                    A Journey of Bold <em className='font-pangaia font-normal'>Adventures.</em>
                  </h1>

                  <ChevronDown className="w-8 h-8 animate-bounce mx-auto mt-12 text-white" />
                </div>
              </HorizontalPanel>
            </HorizontalSnapSection>
          </section>

          <section data-section="redefining" className="h-full w-full snap-start snap-always">
            <HorizontalSnapSection panelCount={2}>
              <HorizontalPanel bgVideo="https://ik.imagekit.io/beansofbodhi/OurStory/Home_Video_02-transcode.mp4?updatedAt=1761228289772">
                <div className="text-center px-6 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">
                    Redefining the <br/> <em className="font-pangaia font-normal italic">Rules</em> of <em className="font-pangaia font-normal italic">Coffee</em>
                  </h1>
                </div>
              </HorizontalPanel>
              
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/1_2.webp?updatedAt=1761228062782">
                <div className="text-center px-6 pb-2 md:pb-0 max-w-3xl ">
                  <p className="text-sm md:text-xl text-white/90 leading-relaxed">
                    We don't follow trends-we follow purpose. Beans of Bodhi was born to rewrite what coffee stands for. From India to the World, here quality is a lived practice. From the high-altitude farms of Western Ghats to our in-house curing works, we obsess over every detail. We believe coffee should move people-not just with caffeine, but with meaning. That's why we do things differently, not for approval, but for excellence. For us, craft means care, and purpose means progress. And the Youth? They deserve better. We don't just roast beans-we ignite journeys. Rooted in craft, driven by values, and never bound by convention
                  </p>
                </div>
              </HorizontalPanel>
            </HorizontalSnapSection>
          </section>

          <section data-section="promise" className="h-full w-full snap-start snap-always">
            <HorizontalSnapSection panelCount={2}>
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/2_1.webp?updatedAt=1761228062763">
                <div className="text-center px-6 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">
                    Our <em className="font-pangaia font-normal italic">Promise,</em> Our <em className="font-pangaia font-normal italic">Practice</em>
                  </h1>
                </div>
              </HorizontalPanel>
              
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/2_2.webp?updatedAt=1761228062744">
                <div className="text-center px-6 pb-2 md:pb-0 max-w-3xl ">
                  <p className="text-sm md:text-xl text-white/90 leading-relaxed">
                    Integrity at Beans of Bodhi isn't just an accessory-it's the foundation. We look in the mirror often: questioning, evolving, and never settling. From farm to roast, we maintain full transparency, take accountability, and honor every commitment we make-to farmers, to customers, to the planet. Our promise? That every sip reflects our values, our craft, and our courage to do things differently
                  </p>
                </div>
              </HorizontalPanel>
            </HorizontalSnapSection>
          </section>

          <section data-section="guarantee" className="h-full w-full snap-start snap-always">
            <HorizontalSnapSection panelCount={2}>
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/3_1.webp?updatedAt=1761228062682">
                <div className="text-center px-6 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">
                    Our <em className="font-pangaia font-normal italic">Guarantee</em>
                  </h1>
                </div>
              </HorizontalPanel>
              
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/3_2.webp?updatedAt=1761228062826">
                <div className="text-center px-6 pb-2 md:pb-0 max-w-3xl ">
                  <p className="text-sm md:text-xl text-white/90 leading-relaxed">
                    We stand behind everything we make. If it's not extraordinary, it's not Bodhi. We work directly with trusted farmers who share our passion for sustainability and craftsmanship. Each bean is hand-selected and slow-cured in our own facilities to bring out the natural depth and flavor that defines Beans of Bodhi
                  </p>
                </div>
              </HorizontalPanel>
            </HorizontalSnapSection>
          </section>

          <section data-section="responsibility" className="h-full w-full snap-start snap-always">
            <HorizontalSnapSection panelCount={2}>
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/4_1.webp?updatedAt=1761228062760">
                <div className="text-center px-6 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">
                    We take <em className="font-pangaia font-normal italic">Responsibility</em> for our <em className="font-pangaia font-normal italic">Impact</em> on <em className="font-pangaia font-normal italic">People, Planet</em> & <em className="font-pangaia font-normal italic">Purpose</em>
                  </h1>
                </div>
              </HorizontalPanel>
              
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/4_2.webp?updatedAt=1761228062632">
                <div className="text-center px-6 pb-2 md:pb-0 max-w-3xl ">
                  <p className="text-sm md:text-xl text-white/90 leading-relaxed">
                    We're more than a coffee brand-we're a mindful movement driven by quality. We empower the farmers behind our beans and the lives they fuel, supporting fair wages and regenerative farming. Our purpose goes beyond coffee. We believe India's youth find purpose, discipline and impact when they reconnect with nature through action sports and bold movement-because real change begins outside comfort zones
                  </p>
                </div>
              </HorizontalPanel>
            </HorizontalSnapSection>
          </section>

          <section data-section="process" className="h-full w-full snap-start snap-always">
            <HorizontalSnapSection panelCount={2}>
              <HorizontalPanel bgVideo="https://ik.imagekit.io/beansofbodhi/OurStory/Our-Storr_Kind_-transcode.webm/ik-video.mp4?updatedAt=1761228231849">
                <div className="text-center px-6 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">
                    The more you <em className="font-pangaia font-normal italic">Know,</em> The more you <em className="font-pangaia font-normal italic">Need</em>
                  </h1>
                </div>
              </HorizontalPanel>
              
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/5_2.webp?updatedAt=1761228062737">
                <div className="text-center px-6 pb-2 md:pb-0 max-w-3xl ">
                  <p className="text-sm md:text-xl text-white/90 leading-relaxed">
                    Because once you understand where your coffee comes from-how it's sourced, cured, and crafted- there's no going back. Our mission is to make Indian coffee extraordinary again. We work from root to roast with intention, crafting high-performance brews that carry culture, complexity, and care. Because the more truth in your cup, the more meaning in your day
                  </p>
                </div>
              </HorizontalPanel>
            </HorizontalSnapSection>
          </section>

          <section data-section="commitment" className="h-full w-full snap-start snap-always">
            <HorizontalSnapSection panelCount={2}>
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/6_1.webp?updatedAt=1761228062652">
                <div className="text-center px-6 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">
                    The <em className="font-pangaia font-normal italic">Commitment</em> Forward
                  </h1>
                </div>
              </HorizontalPanel>
              
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/6_2.webp?updatedAt=1761228062844">
                <div className="text-center px-6 pb-2 md:pb-0 max-w-3xl ">
                  <p className="text-sm md:text-xl text-white/90 leading-relaxed">
                    Every decision starts with responsibility-to people, planet, and purpose. We're not just building a coffee company-we're shaping a more mindful future. Our vision: a world where every sip fuels not just energy, but impact. With our 1% for the Planet and 1% for the Community pledge, we channel profit into purpose-regenerating ecosystems and uplifting local cultures. Each blend is proof that progress can taste good.
                  </p>
                </div>
              </HorizontalPanel>
            </HorizontalSnapSection>
          </section>

          <section data-section="era" className="h-full w-full snap-start snap-always">
            <HorizontalSnapSection panelCount={2}>
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/6_2.webp?updatedAt=1761228062844">
                <div className="text-center px-6 max-w-4xl">
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-pangaia font-medium tracking-wide leading-relaxed text-white">
                    <em className="font-pangaia font-normal italic">Stepping</em> into a new <em className="font-pangaia font-normal italic">Era</em>
                  </h2>
                </div>
              </HorizontalPanel>
              
              <HorizontalPanel bgImage="https://ik.imagekit.io/beansofbodhi/OurStory/7_2.webp?updatedAt=1761228062721">
                <div className="text-center px-6 pb-2 md:pb-0 max-w-3xl ">
                  <p className="text-sm md:text-xl text-white/90 leading-relaxed">
                    This isn't just about coffee. It's a shift in mindset-towards purpose, quality, and conscious consumption. Dedicating to a generation that refuses to compromise
                  </p>
                </div>
              </HorizontalPanel>
            </HorizontalSnapSection>
          </section>
        </div>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-black/70 z-50">
          <div 
            ref={navScrollRef}
            className="overflow-x-auto nav-scroll"
          >
            <div className="flex min-w-max px-4 md:px-8 justify-center">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  data-nav={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative px-6 py-4 text-white text-sm md:text-base whitespace-nowrap transition-all hover:text-white/80"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all ${
                      activeSection === item.id ? 'opacity-100 h-1' : 'opacity-40'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    );
  }