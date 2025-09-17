import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, Float } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface MovementPageProps {
  onBackToHome: () => void;
  onProductClick: (productName: string) => void;
}

// 3D Bottle Component
const Bottle: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const bottleRef = useRef<THREE.Group>(null);
  const capRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (bottleRef.current) {
      // Rotate bottle based on scroll
      bottleRef.current.rotation.y = scrollProgress * Math.PI * 2;
      bottleRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    
    if (capRef.current) {
      // Open bottle cap based on scroll progress
      const openAmount = Math.max(0, (scrollProgress - 0.3) * 3);
      capRef.current.position.y = 2 + openAmount * 2;
      capRef.current.rotation.z = openAmount * Math.PI * 0.5;
    }
  });

  return (
    <group ref={bottleRef}>
      {/* Bottle Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 1, 4, 32]} />
        <meshStandardMaterial 
          color="#2d1810" 
          roughness={0.3} 
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Bottle Neck */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.4, 0.6, 1, 32]} />
        <meshStandardMaterial 
          color="#2d1810" 
          roughness={0.3} 
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Bottle Cap */}
      <mesh ref={capRef} position={[0, 2, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.3, 32]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>
      
      {/* Coffee Beans Effect */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 3,
              Math.random() * 2 - 1,
              (Math.random() - 0.5) * 3
            ]}
            scale={0.1}
          >
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#3d2914" />
          </mesh>
        ))}
      </Float>
      
      {/* 3D Text */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.5}
        color="#2d1810"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        BEANS OF BODHI
      </Text>
    </group>
  );
};

// 3D Scene Component
const Scene: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <Bottle scrollProgress={scrollProgress} />
      
      <Environment preset="warehouse" />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        enableRotate={true}
        autoRotate={false}
      />
    </>
  );
};

const MovementPage: React.FC<MovementPageProps> = ({ onBackToHome, onProductClick }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollTop / scrollHeight, 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // GSAP Animations
    gsap.fromTo('.movement-hero-text',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }
    );

    gsap.fromTo('.movement-section',
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.movement-content',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef}>
      {/* Hero Section with 3D Scene */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <Scene scrollProgress={scrollProgress} />
          </Canvas>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        
        {/* Back to Home Button */}
        <div className="absolute top-24 left-6 z-20">
          <button 
            onClick={onBackToHome}
            className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-300 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white movement-hero-text">
            <h1 className="text-6xl md:text-8xl font-serif mb-6">
              The Movement
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
              Every cup tells a story of adventure, sustainability, and the untamed spirit of exploration
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="movement-content py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Section 1 */}
          <div className="movement-section grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                Born from Adventure
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our movement began in the misty peaks of the Western Ghats, where coffee grows wild 
                and free. Each bean carries the essence of untamed landscapes and the spirit of those 
                who dare to explore beyond the ordinary.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe that great coffee should fuel great adventures, connecting people to the 
                natural world and inspiring them to push their boundaries.
              </p>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Western Ghats landscape"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className="movement-section grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="lg:order-2">
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                Sustainable Impact
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our commitment goes beyond exceptional coffee. We're dedicated to preserving the 
                ecosystems that nurture our beans and supporting the communities that cultivate them.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Through direct partnerships and sustainable practices, we ensure that every cup 
                contributes to a better future for both people and planet.
              </p>
            </div>
            <div className="lg:order-1">
              <img
                src="https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Sustainable farming"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Section 3 */}
          <div className="movement-section grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                Community of Explorers
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Join a global community of adventurers, dreamers, and coffee lovers who share a 
                passion for exploration and exceptional experiences.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Together, we're not just drinking coffee – we're fueling a movement that celebrates 
                the wild, the sustainable, and the extraordinary.
              </p>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Coffee community"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="movement-section text-center py-20">
            <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mb-8">
              Join the Movement
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
              Be part of something bigger. Every cup you drink supports sustainable practices, 
              wild preservation, and the adventurous spirit that drives us all.
            </p>
            <button className="bg-black text-white px-12 py-4 text-lg font-medium hover:bg-gray-800 transition-colors duration-300">
              DISCOVER OUR COFFEES
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovementPage;