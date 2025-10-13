import React from "react";
import { useNavigate } from "react-router-dom";

function BusinessSection() {
  const navigate = useNavigate();

  const handleEnquireClick = () => {
    navigate('/business-enquiry');
  };

  return (
    <section
      className="relative h-screen w-full bg-cover bg-center flex flex-col justify-center items-center text-white"
      style={{
        backgroundImage:
          "url('https://ik.imagekit.io/7ujz6ljli/Story/Rectangle-22-p-1080.png?updatedAt=1760240648560')",
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Centered Heading */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 font-pangaia font-medium leading-tight">
          <em>Need a</em> <br /> subscription <em>for</em> <br /> Business ?
        </h1>
      </div>

      {/* Bottom-Aligned Button */}
      <div className="absolute bottom-16 flex justify-center w-full z-10">
        <button 
          onClick={handleEnquireClick}
          className="px-10 py-4 border-2 border-white text-white text-lg md:text-xl font-pangaia font-semibold rounded-full hover:bg-white/10 transition"
        >
          Enquire Now
        </button>
      </div>
    </section>
  );
}

export default BusinessSection;