import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface BusinessSectionProps {
  backgroundImage?: string;
  heading?: string;
  buttonText?: string;
  mobileAspectRatio?: string; // e.g., '1 / 1', '4 / 3', '16 / 9'
  desktopHeight?: string; // e.g., '100vh', '80vh', '600px'
  mobileObjectFit?: 'cover' | 'contain' | 'fill';
  desktopObjectFit?: 'cover' | 'contain' | 'fill';
  overlayOpacity?: number; // 0 to 1
  headingFontSize?: { mobile: string; desktop: string };
  buttonPadding?: { mobile: string; desktop: string };
  buttonFontSize?: { mobile: string; desktop: string };
}

function BusinessSection({
  backgroundImage = "https://ik.imagekit.io/beansofbodhi/OurStory/4_1.webp?updatedAt=1761228062760",
  heading = "<em>Need a</em> <br /> subscription <em>for</em> <br /> Business ?",
  buttonText = "Enquire Now",
  mobileAspectRatio = "1 / 1",
  desktopHeight = "700px",
  mobileObjectFit = "cover",
  desktopObjectFit = "cover",
  overlayOpacity = 0.5,
  headingFontSize = { mobile: "24px", desktop: "60px" },
  buttonPadding = { mobile: "8px 24px", desktop: "16px 40px" },
  buttonFontSize = { mobile: "12px", desktop: "18px" }
}: BusinessSectionProps) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleEnquireClick = () => {
    navigate("/business-enquiry");
  };

  const objectFitClass = isMobile ? `bg-${mobileObjectFit}` : `bg-${desktopObjectFit}`;
  const currentHeadingFontSize = isMobile ? headingFontSize.mobile : headingFontSize.desktop;
  const currentButtonPadding = isMobile ? buttonPadding.mobile : buttonPadding.desktop;
  const currentButtonFontSize = isMobile ? buttonFontSize.mobile : buttonFontSize.desktop;

  const containerStyle: React.CSSProperties = {
    height: isMobile ? '100vw' : desktopHeight,
    aspectRatio: isMobile ? mobileAspectRatio : 'auto',
    backgroundImage: `url('${backgroundImage}')`,
    backgroundBlendMode: 'overlay',
  };
  
  return (
    <section
      className={`relative w-full bg-center flex flex-col justify-center items-center text-white overflow-hidden ${objectFitClass}`}
      style={containerStyle}
    >
      {/* Overlay for better contrast */}
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center w-full px-4">
        {/* Centered Heading */}
        <div className="text-center px-2">
          <h1 
            className="font-medium leading-tight mb-4 sm:mb-6 md:mb-6"
            style={{ 
              fontSize: currentHeadingFontSize,
              fontFamily: "'Pangaia', sans-serif"
            }}
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        </div>
        
        {/* Bottom-Aligned Button */}
        <div className="absolute bottom-6 sm:bottom-8 flex justify-center w-full">
          <button
            onClick={handleEnquireClick}
            className="border-2 border-white font-semibold rounded-full hover:bg-white/10 transition"
            style={{
              padding: currentButtonPadding,
              fontSize: currentButtonFontSize,
              fontFamily: "'Pangaia', sans-serif"
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}

export default BusinessSection;