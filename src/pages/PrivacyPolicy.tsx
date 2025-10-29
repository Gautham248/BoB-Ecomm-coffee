// PrivacyPolicyPage.tsx
import LegalPage from '../components/LegalPage';

const PrivacyPolicyPage = () => {
  const privacyPolicySections = [
    {
      heading: "Introduction",
      blocks: [
        {
          type: 'text' as const,
          content: `This Privacy Policy describes how Beans of Bodhi (the "Site", "we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from www.beansofbodhi.com (the "Site") or otherwise communicate with us (collectively, the "Services"). For purposes of this Privacy Policy, "you" and "your" means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.`
        },
        {
          type: 'text' as const,
          content: `By using the Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree, please do not use the Services.`
        }
      ]
    },
    {
      heading: "Changes to This Privacy Policy",
      blocks: [
        {
          type: 'text' as const,
          content: `We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or operational needs. The revised policy will be posted on the Site with an updated "Last Updated" date.`
        }
      ]
    },
    {
      heading: "How We Collect and Use Your Personal Information",
      blocks: [
        {
          type: 'text' as const,
          content: `We collect personal information to provide the Services, process orders, communicate with you, comply with legal obligations, and protect our rights.`
        }
      ]
    },
    {
      heading: "Information We Collect Directly from You",
      blocks: [
        {
          type: 'text' as const,
          content: `When you use our Services, we may collect the following types of information directly from you:`
        },
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "Basic Contact Details: Name, email address, and phone number",
            "Account Information: Username, password, and security questions",
            "Order Information: Billing and shipping address, payment conformation",
            "Shopping Behavior: Items viewed, added to cart or wishlist",
            "Customer Support Communications"
          ]
        },
        {
          type: 'text' as const,
          content: `Some features require certain information; opting out may prevent access to those 
features.`
        }
      ]
    },
    {
      heading: " Information We Collect Through Cookies",
      blocks: [
        {
          type: 'text' as const,
          content: `We automatically collect information about your interaction with the Site (“Usage Data”) using 
cookies, pixels, and similar technologies. This may include device type, browser, IP address, and 
network information.`
        },
      ]
    },
    {
      heading: "How We Use Your Personal Information",
      blocks: [
        {
          type: 'text' as const,
          content: `We use your personal information for the following purposes:`
        },
        {
          type: 'list' as const,
          listType: 'bullet' as const,
          items: [
            "Providing Products and Services: Processing payments, fulfilling orders, managing accounts, shipping, returns, and exchanges",
            "Marketing and Advertising: Sending promotional communications and tailored advertising.",
            "Security and Fraud Prevention: Detecting and responding to fraudulent or malicious activity.",
            "Communication: Responding to inquiries and improving Services.",
           
          ]
        },
      ]
    },
    {
      heading: "Cookies",
      blocks: [
        {
          type: 'text' as const,
          content: (
            <>
              We use cookies to improve your experience, track usage, and optimize the Site. Blocking cookies may affect functionality. For Shopify-powered stores, see:{' '}
              <a 
                href="https://www.shopify.com/in/legal/cookies" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-900 font-medium underline hover:text-gray-700"
              >
                Shopify Cookies
              </a>.
            </>
          )
        }
      ]
    },
    {
      heading: " Disclosure of Personal Information",
      blocks: [
        {
          type: 'text' as const,
          content: ` We may disclose personal information to:`
        },
        {
            type: 'list' as const,
            listType: 'bullet' as const,
            items: [
              "Vendors and service providers performing services on our behalf.",
              "Business and marketing partners, in accordance with their policies.",
              "Affiliates or within our corporate group.",
              "Comply with legal obligations or enforce terms of service.",
             
            ]
          },
      ]
    },
    {
      heading: " User Generated Content",
      blocks: [
        {
          type: 'text' as const,
          content: `Any content you post publicly may be accessible by others. We are not responsible for its security 
or use by third parties.`
        },
      ]
    },
    {
      heading: "Children’s Data",
      blocks: [
        {
          type: 'text' as const,
          content: `The Services are not intended for children. Users under 18 may only place orders under the 
supervision of a parent or guardian`
        }
      ]
    },
    {
      heading: " Security and Retention",
      blocks: [
        {
          type: 'text' as const,
          content: `We implement reasonable security measures but cannot guarantee perfect security. Information is 
retained as long as necessary to provide Services, comply with laws, or resolve disputes.`
        }
      ]
    },
    {
        heading: "  Your Rights",
        blocks: [
          {
            type: 'text' as const,
            content: `You may have rights to access, correct, delete, or restrict processing of your personal information, 
withdraw consent, or manage communication preferences. Contact us at mail@beansofbodhi.com 
or +91-7012433195 to exercise your rights`
          }
        ]
      },
      {
        heading: "  International Users",
        blocks: [
          {
            type: 'text' as const,
            content: ` Your information may be processed outside your country, including in countries where our service 
providers operate.`
          }
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
      title="Privacy Policy"
      lastUpdated="October 23, 2025"
      sections={privacyPolicySections}
      contactEmail="mail@beansofbodhi.com"
    />
  );
};

export default PrivacyPolicyPage;