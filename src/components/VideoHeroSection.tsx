import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VideoHeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  
  // Refs for second section
  const section2Ref = useRef<HTMLDivElement>(null);
  const heading2Ref = useRef<HTMLHeadingElement>(null);
  const button2Ref = useRef<HTMLAnchorElement>(null);

  // Video loading states
  const [video1Loaded, setVideo1Loaded] = useState(false);
  const [video2Loaded, setVideo2Loaded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the heading with stagger for each line/word
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animate the button
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animate second section heading
      gsap.fromTo(
        heading2Ref.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section2Ref.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animate second section button
      gsap.fromTo(
        button2Ref.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section2Ref.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* First Section */}
      <section
        ref={sectionRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Placeholder Image */}
        {!video1Loaded && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: 'src/assets/videos/Home_Video_02-poster-00001.jpg',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}

        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideo1Loaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            video1Loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source
            src="src/assets/videos/Home_Video_02-transcode.mp4"
            type="video/mp4"
          />
          <source
            src="src/assets/videos/Home_Video_02-transcode.webm"
            type="video/webm"
          />
        </video>

        {/* Dark Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Main heading in rounded rectangle */}
          <div
            ref={headingRef}
            className="bg-white bg-opacity-0 border border-white border-opacity-50 rounded-full px-10 py-12 md:px-16 md:py-16 mb-8 inline-block"
          >
            <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-light leading-tight">
              Responsibly <em className="italic font-serif">Sourced</em>
              <br />
              <em className="italic font-serif">Rooted in</em> Purpose
            </h2>
          </div>
        </div>
      </section>

      {/* Second Section - Business Subscription */}
      <section
        ref={section2Ref}
        className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden py-20"
      >
        {/* Placeholder Image */}
        {!video2Loaded && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: 'src/assets/videos/Our-Storr_Kind_-poster-00001.jpg',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}

        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideo2Loaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            video2Loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source
            src="src/assets/videos/Our-Storr_Kind_-transcode.mp4"
            type="video/mp4"
          />
          <source
            src="src/assets/videos/Our-Storr_Kind_-transcode.webm"
            type="video/webm"
          />
        </video>

        {/* Dark Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Centered Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
          <div className="text-center px-6 max-w-4xl mx-auto">
            <h2
              ref={heading2Ref}
              className="text-white text-5xl md:text-7xl lg:text-8xl font-light leading-tight"
            >
              <em className="italic font-serif">Need a</em>
              <br />
              subscription <em className="italic font-serif">for</em>
              <br />
              Business?
            </h2>
          </div>
        </div>

        {/* Button at bottom with rounded rectangle style */}
        <div className="relative z-10 pb-16 w-full flex justify-center">
          <a
            ref={button2Ref}
            href="/business"
            className="inline-block bg-transparent border-2 border-white text-white px-12 py-4 md:px-16 md:py-5 text-sm md:text-base tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 font-medium rounded-full"
          >
            ENQUIRE NOW
          </a>
        </div>
      </section>
    </>
  );
};

export default VideoHeroSection;