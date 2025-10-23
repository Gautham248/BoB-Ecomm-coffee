import React from "react";
import { useNavigate } from "react-router-dom";

function BusinessSection() {
  const navigate = useNavigate();

  const handleEnquireClick = () => {
    navigate('/business-enquiry');
  };

  return (
    <section
      className="relative py-6 md:py-12 w-full bg-cover bg-center flex flex-col justify-center items-center text-white overflow-hidden"
      style={{
        // backgroundColor: 'rgb(16, 18, 22)',
        backgroundImage:
          "url('https://ik.imagekit.io/7ujz6ljli/Story/Rectangle-22-p-1080.png?updatedAt=1760240648560')",
        backgroundBlendMode: 'overlay',
        minHeight: 'calc(500px + 3rem)', // matches carousel height + padding on mobile
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content Container - matches carousel dimensions */}
      <div className="relative z-10 h-[500px] md:h-[600px] flex flex-col justify-center items-center w-full px-4">
        {/* Centered Heading */}
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 font-pangaia font-medium leading-tight">
            <em>Need a</em> <br /> subscription <em>for</em> <br /> Business ?
          </h1>
        </div>
        
        {/* Bottom-Aligned Button within content area */}
        <div className="absolute bottom-8 flex justify-center w-full">
          <button 
            onClick={handleEnquireClick}
            className="px-10 py-4 border-2 border-white text-white text-lg md:text-xl font-pangaia font-semibold rounded-full hover:bg-white/10 transition"
          >
            Enquire Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default BusinessSection;