import { useState } from 'react';
import { Building2, User, Mail, Phone, MapPin, Coffee, MessageSquare, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import HeroImageSection from '../components/HeroImageSection';

// Types
interface FormData {
  businessName: string;
  businessType: string;
  location: string;
  contactName: string;
  email: string;
  phone: string;
  monthlyVolume: string;
  interests: string[];
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

// Main Page Component
const BusinessSubscriptionEnquiry = () => {
  return (
    <div className="min-h-screen bg-white">
        <HeroImageSection
         backgroundImageDesktop="https://ik.imagekit.io/beansofbodhi/Business/B2B%20Landscape.webp?updatedAt=1761229026645"
         backgroundImageMobile="https://ik.imagekit.io/beansofbodhi/Business/B2B%20Portrait.webp?updatedAt=1761229026662"
         alt="Hero Image Description"
        />
      <div className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
            Business Subscription Enquiry
          </h1>
          
          <div className="prose prose-lg mx-auto mb-12">
            <p className="text-gray-700 mb-6">
              Looking to elevate your business with premium coffee solutions? At Beans of Bodhi, we understand that every business has unique needs when it comes to coffee supply. Our business subscription service is tailored to meet your specific requirements, ensuring a consistent supply of high-quality coffee for your establishment.
            </p>
            
            <p className="text-gray-700 mb-6">
              Whether you're a café, restaurant, hotel, or office space, we offer flexible subscription plans that can be customized to your volume needs and delivery preferences. Our coffee experts are here to help you select the perfect blend that aligns with your business values and customer preferences.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-4">Why Choose Our Business Subscription?</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>Customized delivery schedules</li>
                <li>Volume-based pricing</li>
                <li>Dedicated account manager</li>
                <li>Quality assurance guarantee</li>
                <li>Barista training support</li>
                <li>Equipment consultation</li>
              </ul>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-700 mb-6">
                Fill out the form below and our team will get back to you within 24 hours to discuss your specific requirements.
              </p>
            </div>
          </div>

          {/* Integrated Form Component */}
          <B2BEnquiryForm />
        </div>
      </div>
    </div>
  );
};

// Form Component
const B2BEnquiryForm = () => {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    location: '',
    contactName: '',
    email: '',
    phone: '',
    monthlyVolume: '',
    interests: [],
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // EmailJS Configuration
  // IMPORTANT: Replace these with your actual EmailJS credentials
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter(item => item !== value)
        : [...prev.interests, value]
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.monthlyVolume) newErrors.monthlyVolume = 'Monthly volume is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = async () => {
    try {
      // Initialize EmailJS (only needs to be done once, but doing it here is fine)
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Prepare template parameters
      const templateParams = {
        business_name: formData.businessName,
        business_type: formData.businessType,
        location: formData.location,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        monthly_volume: formData.monthlyVolume,
        interests: formData.interests.length > 0 ? formData.interests.join(', ') : 'None selected',
        message: formData.message || 'No additional information provided',
        // You can add a formatted date if needed
        submission_date: new Date().toLocaleString()
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send enquiry. Please try again or contact us directly at info@beansofbodhi.com');
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    // Send email via EmailJS
    const emailSent = await sendEmail();

    if (emailSent) {
      // Show success message
      setSubmitted(true);
      
      // Reset form after 4 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          businessName: '',
          businessType: '',
          location: '',
          contactName: '',
          email: '',
          phone: '',
          monthlyVolume: '',
          interests: [],
          message: ''
        });
        setIsSubmitting(false);
      }, 4000);
    } else {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600">We've received your business enquiry and will be in touch within 24 hours to discuss your coffee requirements.</p>
        </div>
      </div>
    );
  }

  const interests = [
    { value: 'espresso', label: 'Espresso Blends' },
    { value: 'filter', label: 'Filter Coffee' },
    { value: 'single-origin', label: 'Single Origin' },
    { value: 'decaf', label: 'Decaf Options' },
    { value: 'equipment', label: 'Equipment & Training' },
    { value: 'custom', label: 'Custom Blends' }
  ];

  return (
    <>
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 space-y-6">
        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-900" />
            Business Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.businessName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition`}
              placeholder="Your Coffee Shop Ltd."
            />
            {errors.businessName && <p className="text-red-600 text-xs mt-1">{errors.businessName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Type <span className="text-red-600">*</span>
            </label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.businessType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition`}
            >
              <option value="">Select business type</option>
              <option value="cafe">Café</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="office">Office</option>
              <option value="retailer">Retailer</option>
              <option value="other">Other</option>
            </select>
            {errors.businessType && <p className="text-red-600 text-xs mt-1">{errors.businessType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition`}
                placeholder="City, State/Region"
              />
            </div>
            {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-900" />
            Contact Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.contactName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition`}
              placeholder="John Smith"
            />
            {errors.contactName && <p className="text-red-600 text-xs mt-1">{errors.contactName}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition`}
                  placeholder="+91 98765 43210"
                />
              </div>
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Coffee Requirements */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Coffee className="w-5 h-5 text-gray-900" />
            Coffee Requirements
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Monthly Volume <span className="text-red-600">*</span>
            </label>
            <select
              name="monthlyVolume"
              value={formData.monthlyVolume}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.monthlyVolume ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition`}
            >
              <option value="">Select volume range</option>
              <option value="0-5kg">0-5 kg</option>
              <option value="5-10kg">5-10 kg</option>
              <option value="10-25kg">10-25 kg</option>
              <option value="25-50kg">25-50 kg</option>
              <option value="50+kg">50+ kg</option>
            </select>
            {errors.monthlyVolume && <p className="text-red-600 text-xs mt-1">{errors.monthlyVolume}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests (Select all that apply)
            </label>
            <div className="space-y-2">
              {interests.map(interest => (
                <label key={interest.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest.value)}
                    onChange={() => handleCheckboxChange(interest.value)}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <span className="text-gray-700">{interest.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-900" />
            Additional Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tell us about your coffee needs
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition resize-none"
              placeholder="Share any specific requirements, preferences, or questions you have about partnering with us..."
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to be contacted by our wholesale team regarding partnership opportunities.
        </p>
      </div>
    </div>
    </>
  );
};

export default BusinessSubscriptionEnquiry;