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
    'w-full px-3.5 py-2.5 bg-roast-card border rounded-xl text-roast-cream placeholder-roast-muted text-sm outline-none transition-all duration-300 admin-copper-ring';
  const errorClasses = 'border-rust-DEFAULT bg-rust-muted/5';
  const normalClasses = 'border-roast-border focus:border-copper/50';

  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-roast-dust mb-1.5 tracking-wide">
        {label}
        {required && <span className="text-copper ml-0.5">*</span>}
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
        <p className="text-[11px] text-rust-DEFAULT mt-1.5 flex items-center gap-1 animate-fade-in-up">
          <span className="text-[10px]">!</span> {displayError}
        </p>
      )}
    </div>
  );
};

export default AdminFormField;
