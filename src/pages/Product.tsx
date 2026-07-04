import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import SEOHead from '../components/SEO/SEOHead';
import StructuredData from '../components/SEO/StructuredData';
import ProductPage from '../components/ProductPage';
import { getProductById } from '../services/adminService';

const CATEGORY_REDIRECTS: Record<string, string> = {
  gadgets: '/movement',
};

const Product: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  
  const product = getProductById(productId || '');
  
  if (!product) {
    return <Navigate to="/" replace />;
  }

  if (product.category && CATEGORY_REDIRECTS[product.category]) {
    return <Navigate to={CATEGORY_REDIRECTS[product.category]} replace />;
  }

  return (
    <>
      <SEOHead
        title={`${product.title} - Premium Coffee`}
        description={product.description}
        canonical={`https://beansofbodhi.com/product/${product.id}`}
        keywords={`${product.name}, specialty coffee, ${Array.isArray(product.traceability.tasteNotes) ? product.traceability.tasteNotes.join(', ') : ''}, Western Ghats coffee, premium coffee`}
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
        onProductClick={() => {}}
      />
    </>
  );
};

export default Product;