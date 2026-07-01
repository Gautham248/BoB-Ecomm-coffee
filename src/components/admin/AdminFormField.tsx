import React, { useState } from 'react';

interface AdminFormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'url' | 'number' | 'textarea';
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  error?: string;
}

const AdminFormField: React.FC<AdminFormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  pattern,
  error,
}) => {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState('');

  const validate = (val: string): string => {
    if (required && !val.trim()) return 'This field is required';
    if (type === 'url' && val && !/^https?:\/\/.+/.test(val)) return 'Enter a valid URL';
    if (pattern && val && !new RegExp(pattern).test(val)) return 'Invalid format';
    return '';
  };

  const handleBlur = () => {
    setTouched(true);
    setLocalError(validate(value));
  };

  const handleChange = (val: string) => {
    onChange(val);
    if (touched) setLocalError(validate(val));
  };

  const displayError = error || localError;

  const baseClasses =
    'w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all duration-300 admin-copper-ring';
  const errorClasses = 'border-red-500 bg-red-50';
  const normalClasses = 'border-gray-300 focus:border-gray-400';

  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wide">
        {label}
        {required && <span className="text-gray-900 ml-0.5">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={`${baseClasses} ${displayError ? errorClasses : normalClasses}`}
          placeholder={placeholder}
          rows={3}
          required={required}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={`${baseClasses} ${displayError ? errorClasses : normalClasses}`}
          placeholder={placeholder}
          required={required}
        />
      )}
      {displayError && (
        <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 animate-fade-in-up">
          <span className="text-[10px]">!</span> {displayError}
        </p>
      )}
    </div>
  );
};

export default AdminFormField;
