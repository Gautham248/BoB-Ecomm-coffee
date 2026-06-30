import React from 'react';

interface StructuredDataProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  type: 'organization' | 'product' | 'breadcrumb' | 'website' | 'coffeeshop';
}

const StructuredData: React.FC<StructuredDataProps> = ({ data, type }) => {
  const getSchema = () => {
    switch(type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://beansofbodhi.com/#organization",
          "name": "Beans of Bodhi",
          "url": "https://beansofbodhi.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://beansofbodhi.com/logo.png",
            "width": 200,
            "height": 200
          },
          "description": "Premium specialty coffee from the Western Ghats, rooted in adventure and sustainability",
          "foundingDate": "2020",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN",
            "addressRegion": "Western Ghats"
          },
          "sameAs": [
            "https://instagram.com/beansofbodhi",
            "https://facebook.com/beansofbodhi",
            "https://twitter.com/beansofbodhi"
          ]
        };
      
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://beansofbodhi.com/#website",
          "url": "https://beansofbodhi.com",
          "name": "Beans of Bodhi",
          "description": "Premium specialty coffee from the Western Ghats",
          "publisher": {
            "@id": "https://beansofbodhi.com/#organization"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://beansofbodhi.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        };
      
      case 'coffeeshop':
        return {
          "@context": "https://schema.org",
          "@type": "CoffeeShop",
          "name": "Beans of Bodhi",
          "description": "Premium specialty coffee roaster from the Western Ghats",
          "url": "https://beansofbodhi.com",
          "telephone": "+91-XXXXXXXXXX",
          "priceRange": "₹₹₹",
          "servesCuisine": "Coffee",
          "hasMenu": "https://beansofbodhi.com/products",
          "acceptsReservations": false
        };
      
      case 'product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.name,
          "description": data.description,
          "image": data.heroImage,
          "brand": {
            "@type": "Brand",
            "name": "Beans of Bodhi"
          },
          "category": "Coffee",
          "offers": {
            "@type": "Offer",
            "price": data.price.replace('INR ', '').replace('.00', ''),
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "Beans of Bodhi"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127"
          }
        };
      
      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "itemListElement": data.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };
      
      default:
        return {};
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchema()) }}
    />
  );
};

export default StructuredData;