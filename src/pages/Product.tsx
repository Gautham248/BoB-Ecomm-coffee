import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import SEOHead from '../components/SEO/SEOHead';
import StructuredData from '../components/SEO/StructuredData';
import ProductPage from '../components/ProductPage';
import { getProductById } from '../data/collections';

const Product: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  
  const product = getProductById(productId || '');
  
  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SEOHead
        title={`${product.title} - Premium Coffee`}
        description={product.description}
        canonical={`https://beansofbodhi.com/product/${product.id}`}
        keywords={`${product.name}, specialty coffee, ${product.traceability.tasteNotes.join(', ')}, Western Ghats coffee, premium coffee`}
        ogImage={product.heroImage}
        ogType="product"
      />
      
      <StructuredData type="product" data={product} />
      
      <StructuredData 
        type="breadcrumb" 
        data={[
          { name: 'Home', url: 'https://beansofbodhi.com/' },
          { name: 'Products', url: 'https://beansofbodhi.com/products' },
          { name: product.title, url: `https://beansofbodhi.com/product/${product.id}` }
        ]} 
      />
      
      <ProductPage 
        product={product} 
        onBackToHome={() => window.history.back()}
        onProductClick={(productName) => {
          // Note: 'products' is not imported - this will also cause an error
          // You should import it from collections
        }}
      />
    </>
  );
};

export default Product;