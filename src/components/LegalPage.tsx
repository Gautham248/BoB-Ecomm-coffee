import { ReactNode } from 'react';

type ContentBlock = 
  | { type: 'text'; content: string | ReactNode }
  | { type: 'list'; items: string[]; listType: 'bullet' | 'number' };

interface LegalSection {
  heading: string;
  blocks: ContentBlock[];
}

interface LegalPageProps {
  title?: string;
  lastUpdated?: string;
  sections?: LegalSection[];
  contactEmail?: string;
}

const LegalPage = ({ 
  title = "Legal Document",
  lastUpdated = "October 24, 2025",
  sections = [],
  contactEmail = "support@example.com"
}: LegalPageProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-gray-600">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          {sections.length > 0 ? (
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {section.heading}
                  </h2>
                  
                  {/* Render blocks in order */}
                  <div className="space-y-4">
                    {section.blocks.map((block, blockIndex) => {
                      if (block.type === 'text') {
                        return (
                          <p key={blockIndex} className="text-gray-700 leading-relaxed">
                            {block.content}
                          </p>
                        );
                      } else if (block.type === 'list') {
                        return (
                          <div key={blockIndex}>
                            {block.listType === 'number' ? (
                              <ol className="list-decimal list-inside space-y-2 text-gray-700 leading-relaxed">
                                {block.items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="pl-2">
                                    {item}
                                  </li>
                                ))}
                              </ol>
                            ) : (
                              <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
                                {block.items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="pl-2">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No content available. Please provide sections data.
              </p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Have questions? Contact us at{' '}
            <a 
              href={`mailto:${contactEmail}`}
              className="text-gray-900 font-medium hover:underline"
            >
              {contactEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;