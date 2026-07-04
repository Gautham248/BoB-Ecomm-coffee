import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

interface ChipInputProps {
  label: string;
  name: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  type?: 'text' | 'url';
  tooltip?: string;
}

const ChipInput: React.FC<ChipInputProps> = ({
  label,
  name,
  values,
  onChange,
  placeholder,
  type = 'text',
  tooltip,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const validate = (val: string): string => {
    if (type === 'url' && val && !/^https?:\/\/.+/.test(val)) return 'Enter a valid URL';
    return '';
  };

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const err = validate(trimmed);
    if (err) {
      setError(err);
      return;
    }
    onChange([...values, trimmed]);
    setInputValue('');
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const baseClasses =
    'flex-1 min-w-0 w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all duration-300 admin-copper-ring';
  const errorClasses = 'border-red-500 bg-red-50';
  const normalClasses = 'border-gray-300 focus:border-gray-400';

  return (
    <div>
      <label htmlFor={name} className="flex items-center text-xs font-medium text-gray-600 mb-1.5 tracking-wide">
        <span>{label}</span>
        {tooltip && <InfoTooltip content={tooltip} />}
      </label>
      <div className="flex gap-2">
        <input
          id={name}
          name={name}
          type="text"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${baseClasses} ${error ? errorClasses : normalClasses}`}
        />
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 px-3.5 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 border border-gray-300 transition text-sm font-medium shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>
      {error && <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 animate-fade-in-up">{error}</p>}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {values.map((val, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border bg-gray-100 text-gray-700 border-gray-200 group"
            >
              <span className="max-w-[180px] truncate">{val}</span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="hover:text-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChipInput;

