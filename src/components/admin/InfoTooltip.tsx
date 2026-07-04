import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center ml-1.5 cursor-help group/tooltip shrink-0"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
      
      {/* Tooltip bubble */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-gray-950 text-white text-[10px] font-normal leading-relaxed rounded-xl shadow-xl pointer-events-none z-30 transition-all duration-200 origin-bottom ${
          visible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-1 scale-95'
        }`}
      >
        {content}
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 border-4 border-transparent border-t-gray-950" />
      </div>
    </div>
  );
};

export default InfoTooltip;
