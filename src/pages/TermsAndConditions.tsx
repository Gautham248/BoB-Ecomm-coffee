// PrivacyPolicyPage.tsx
import LegalPage from '../components/LegalPage';

const TermsAndConditions= () => {
  const TermsAndConditionsSections = [
    {
      heading: "Introduction",
      blocks: [
        {
          type: 'text' as const,
          content: ` Welcome to Beans of Bodhi. By using our website (www.beansofbodhi.com) and services, you 
agree to comply with and be bound by the following terms and conditions. Please read them 
carefully`
        },
      ]
    },
    {
        heading: " Company Information",
        blocks: [
        
          {
            type: 'list' as const,
            listType: 'bullet' as const,
            items: [
              "Business Name: Beans of Bodhi",
              "Business Type: Partnership",
              "Registered Office: Building No./Flat No.: 9/15-A, Kaithakkal, Cherukottur, Wayanad, Kerala – 670721",
              "Email: mail@beansofbodhi.com",
              "Phone: +91 7012433195",
              "Website: www.beansofbodhi.com"
            ]
          },
        ]
      },
    {
      heading: "Age Requirement",
      blocks: [
        {
            type: 'list' as const,
            listType: 'bullet' as const,
            items: [
              "Users must be18 years or older to place an order.",
              "Minors may place orders under supervision of a parent or guardian.",
              
            ]
          },
      ]
    },
    {
      heading: "Account Registration",
      blocks: [
        {
            type: 'list' as const,
            listType: 'bullet' as const,
            items: [
              "Users may create an account to place orders and track deliveries.",
              "You are responsible for maintaining the confidentiality of your account credentials.",
              "Beans of Bodhi is not responsible for any unauthorized use of your account.",   
            ]
          },
      ]
    },
    {
        heading: "Payments",
        blocks: [
          {
              type: 'list' as const,
              listType: 'bullet' as const,
              items: [
                "Payments are processed securely through Razorpay.",
                "All prices are in INR, inclusive of applicable taxes.",
                "Orders will not be processed until payment is successfully completed.",   
              ]
            },
        ]
      },
      {
        heading: "Shipping & Delivery",
        blocks: [
          {
              type: 'list' as const,
              listType: 'bullet' as const,
              items: [
                "Shipping is available all over India.",
                "Delivery timeframes are typically 3–7 business days.",
                "Beans of Bodhi is not responsible for delays caused by courier services or circumstances beyond our control.",   
                "Please refer to our Shipping Policy for full details.",   
              ]
            },
        ]
      },
      {
        heading: "Returns, Refunds, and Exchanges",
        blocks: [
          {
              type: 'list' as const,
              listType: 'bullet' as const,
              items: [
                "Please refer to our Refund & Return Policy for details on returns, refunds, and exchanges.",
              ]
            },
        ]
      },
      {
        heading: "Intellectual Property",
        blocks: [
          {
              type: 'list' as const,
              listType: 'bullet' as const,
              items: [
                "All content on www.beansofbodhi.com, including text, images, graphics, and branding, is the property of Beans of Bodhi or its licensors.",
                " You may not reproduce, distribute, or use our content for commercial purposes without written permission.",
              ]
            },
        ]
      },
      {
        heading: "Limitation of Liability",
        blocks: [
          {
              type: 'list' as const,
              listType: 'bullet' as const,
              items: [
                "Beans of Bodhi is not liable for any indirect, incidental, or consequential damages arising from use of the website or services",
                "We do not guarentee uninterrupted or error-free access to our website.",
              ]
            },
        ]
      },
      {
        heading: "Governing Law",
        blocks: [
          {
              type: 'list' as const,
              listType: 'bullet' as const,
              items: [
                "These terms are governed by Indian law.",
                " Any disputes arising from the use of our website or services will be subject to the exclusive jurisdiction of the courts in Kerala, India",
              ]
            },
        ]
      },
      {
        heading: "Modifications to Terms",
        blocks: [
          {
              type: 'list' as const,
              listType: 'bullet' as const,
              items: [
                "Beans of Bodhi reserves the right to modify these terms at any time.",
                "Updated terms will be posted on the website with the \"Last Updated\" date.",
                "Continued use of the website constitutes acceptance of the revised terms.",
              ]
            },
        ]
      },
      {
        heading: " Contact",
        blocks: [
          {
            type: 'text' as const,
            content: (
                <>
                Email: mail@beansofbodhi.com <br/>
                Phone: +91 7012433195 <br/>
                Address: Building No./Flat No.: 9/15-A, Kaithakkal, Cherukottur, Wayanad, Kerala – 670721<br/>
                </>
              )
          }
        ]
      }

  ];

  return (
    <LegalPage 
      title="Terms & Conditions"
      lastUpdated="October 23, 2025"
      sections={TermsAndConditionsSections}
      contactEmail="mail@beansofbodhi.com"
    />
  );
};

export default TermsAndConditions;