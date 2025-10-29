// RefundAndReturns.tsx
import LegalPage from '../components/LegalPage';

const RefundAndReturns = () => {
  const refundReturnsSections = [
    {
      heading: "Introduction",
      blocks: [
        {
          type: 'text' as const,
          content: `At Beans of Bodhi, we specialize in providing freshly roasted, high-quality coffee products. Due to the nature of our products, all coffee sales are final and are considered non-cancellable and non-returnable, even if unopened.`
        },
        {
          type: 'text' as const,
          content: `For brewing equipment and serveware, limited returns are accepted under the conditions described below.`
        }
      ]
    },
    {
      heading: "Order Errors",
      blocks: [
        {
          type: 'text' as const,
          content: `If there was an error with your order, please contact us within 48 hours of delivery at mail@beansofbodhi.com or +91 7012 433195. Our team will evaluate the issue and help make it right.`
        }
      ]
    },
    {
      heading: "Damages and Issues",
      blocks: [
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "Inspect your order upon delivery.",
            "Report defective, damaged, or incorrect items within 48 hours of receipt.",
            "For damaged brewing equipment or serveware, email mail@beansofbodhi.com with: Photo of the damaged item and Photo of the shipping box."
          ]
        },
        {
          type: 'text' as const,
          content: `If your return is accepted, we will provide:`
        },
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "A return shipping label",
            "Instructions on how and where to send the item"
          ]
        },
        {
          type: 'text' as const,
          content: (
            <>
              <strong>Important:</strong> Returns sent without requesting approval will not be accepted.
              <br/><br/>
              <strong>Return Address:</strong><br/>
              Beans of Bodhi<br/>
              Kambalakkad, Wayanad, Kerala – 673124<br/>
              Phone: +91 7012 433195
            </>
          )
        }
      ]
    },
    {
      heading: "Exceptions / Non-Returnable Items",
      blocks: [
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "Coffee products (all sales final)",
            "Sale items and gift cards"
          ]
        }
      ]
    },
    {
      heading: "Exchanges",
      blocks: [
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "Only applicable for serveware and brewing equipment.",
            "Coffee products cannot be exchanged.",
            "To exchange an item, return the original item following the above process, then place a separate order for the replacement."
          ]
        }
      ]
    },
    {
      heading: "Refunds",
      blocks: [
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "Once we receive and inspect your return, we will notify you if the refund is approved.",
            "Approved refunds will be credited to your original payment method within 15 business days.",
            "Banking or card processing times may vary.",
            "If more than 15 business days have passed after approval, contact mail@beansofbodhi.com."
          ]
        }
      ]
    }
  ];

  return (
    <LegalPage 
      title="Refund & Return Policy"
      lastUpdated="October 23, 2025"
      sections={refundReturnsSections}
      contactEmail="mail@beansofbodhi.com"
    />
  );
};

export default RefundAndReturns;