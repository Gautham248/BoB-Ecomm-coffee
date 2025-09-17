import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEO/SEOHead';
import StructuredData from '../components/SEO/StructuredData';
import MovementPage from '../components/MovementPage';
import { getProductById, products } from '../data/collections';

const Movement: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleProductClick = (productName: string) => {
    const product = products.find(p => p.name === productName);
    if (product) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <>
      <SEOHead
        title="The Movement - Sustainable Coffee Adventure"
        description="Join the Beans of Bodhi movement. Every cup supports environmental conservation, sustainable farming, and the adventurous spirit of coffee exploration in the Western Ghats."
        canonical="https://beansofbodhi.com/movement"
        keywords="coffee movement, sustainable coffee, environmental conservation, Western Ghats conservation, adventure coffee, eco-friendly coffee"
        ogImage="https://beansofbodhi.com/og-movement.jpg"
      />
      
      <StructuredData 
        type="breadcrumb" 
        data={[
          { name: 'Home', url: 'https://beansofbodhi.com/' },
          { name: 'The Movement', url: 'https://beansofbodhi.com/movement' }
        ]} 
      />
      
      <MovementPage 
        onBackToHome={handleBackToHome}
        onProductClick={handleProductClick}
      />
    </>
  );
};

export default Movement;