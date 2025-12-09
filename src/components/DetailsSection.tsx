// import React, { useEffect, useRef } from 'react';

// const DetailsSection = ({ children, className = '', bgColor = 'bg-white' }) => {
//   const sectionRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const elements = entry.target.querySelectorAll('[data-fade-in]');
//             elements.forEach((el, index) => {
//               setTimeout(() => {
//                 el.style.opacity = '1';
//                 el.style.transform = 'translateY(0)';
//               }, index * 150);
//             });
//           }
//         });
//       },
//       { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, []);

//   return (
//     <header ref={sectionRef} className={`py-16 md:py-24 lg:py-32 px-6 ${bgColor} ${className}`}>
//       <div className="max-w-5xl mx-auto">
//         <div className="text-center">
//           {children}
//         </div>
//       </div>
//     </header>
//   );
// };

// const Heading = ({ children, className = '' }) => (
//   <h1 
//     data-fade-in
//     className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 opacity-0 transition-all duration-700 ease-out transform translate-y-8 text-gray-900 ${className}`}
//     style={{ fontFamily: 'Montserrat, sans-serif' }}
//   >
//     {children}
//   </h1>
// );

// const SubHeading = ({ children, className = '' }) => (
//   <h2 
//     data-fade-in
//     className={`text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 opacity-0 transition-all duration-700 ease-out transform translate-y-8 text-gray-900 ${className}`}
//     style={{ fontFamily: 'Montserrat, sans-serif' }}
//   >
//     {children}
//   </h2>
// );

// const Text = ({ children, className = '', size = 'large', bold = false }) => {
//   const sizeClasses = {
//     xlarge: 'text-xl md:text-2xl lg:text-3xl',
//     large: 'text-lg md:text-xl lg:text-2xl',
//     medium: 'text-base md:text-lg lg:text-xl',
//     small: 'text-sm md:text-base lg:text-lg'
//   };

//   const fontWeight = bold ? 'font-semibold' : 'font-normal';

//   return (
//     <div 
//       data-fade-in
//       className={`${sizeClasses[size]} ${fontWeight} leading-relaxed mb-6 opacity-0 transition-all duration-700 ease-out transform translate-y-8 text-gray-700 ${className}`}
//       style={{ fontFamily: 'Open Sans, sans-serif' }}
//     >
//       {children}
//     </div>
//   );
// };

// const Spacer = ({ size = 'small' }) => {
//   const heights = {
//     xsmall: 'h-2',
//     small: 'h-4',
//     medium: 'h-8',
//     large: 'h-12',
//     xlarge: 'h-16'
//   };
  
//   return <div className={heights[size]}></div>;
// };

// DetailsSection.Heading = Heading;
// DetailsSection.SubHeading = SubHeading;
// DetailsSection.Text = Text;
// DetailsSection.Spacer = Spacer;

// export default DetailsSection;