// ShippingPolicy.tsx
import LegalPage from '../components/LegalPage';

const ShippingPolicy = () => {
  const shippingPolicySections = [
    {
      heading: "Order Processing and Shipping Times",
      blocks: [
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "All online orders are processed and shipped within 48 hours of receipt, excluding Sundays.",
            "Orders placed on weekends will be processed on the next business day."
          ]
        }
      ]
    },
    {
      heading: "Shipping Locations",
      blocks: [
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "We currently ship all over India.",
            "International shipping is not available at this time."
          ]
        }
      ]
    },
    {
      heading: "Delivery Timeframes",
      blocks: [
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "Estimated delivery time: 3–7 business days after dispatch.",
            "Delivery times may vary depending on your location and courier service.",
            "If your order has not arrived within the estimated timeframe, contact us at mail@beansofbodhi.com or +91 7012 433195 with your order number for assistance."
          ]
        }
      ]
    },
    {
      heading: "Shipping Carriers",
      blocks: [
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "We partner with trusted courier services to ensure safe and timely delivery.",
            "Once your order is shipped, you will receive an email with tracking information."
          ]
        }
      ]
    },
    {
      heading: "Damages and Lost Packages",
      blocks: [
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "Inspect your order upon delivery.",
            "Report missing or damaged items within 48 hours of receipt.",
            "For damaged items, please provide a photo of the product and the shipping box to mail@beansofbodhi.com."
          ]
        }
      ]
    },
    {
      heading: "Shipping & Return Address",
      blocks: [
        {
          type: 'text' as const,
          content: (
            <>
              All returns and deliveries are sent to:<br/><br/>
              <strong>Beans of Bodhi</strong><br/>
              Kambalakkad, Wayanad, Kerala – 673124<br/>
              Phone: +91 7012 433195
            </>
          )
        }
      ]
    },
    {
      heading: "Notes",
      blocks: [
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "We do not offer in-store pickup.",
            "We do not offer same-day delivery.",
            "Ensure your shipping address is accurate to avoid delays."
          ]
        }
      ]
    }
  ];

  return (
    <LegalPage 
      title="Shipping Policy"
      lastUpdated="October 23, 2025"
      sections={shippingPolicySections}
      contactEmail="mail@beansofbodhi.com"
    />
  );
};

export default ShippingPolicy;