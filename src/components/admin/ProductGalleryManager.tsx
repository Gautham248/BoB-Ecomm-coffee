import React, { useState } from 'react';
import { GripVertical, X, Plus, Image as ImageIcon } from 'lucide-react';

interface ProductGalleryManagerProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}

const ProductGalleryManager: React.FC<ProductGalleryManagerProps> = ({
  label,
  values,
  onChange,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragActiveIndex, setDragActiveIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newValues = [...values];
    const draggedItem = newValues[draggedIndex];
    newValues.splice(draggedIndex, 1);
    newValues.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    onChange(newValues);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragActiveIndex(null);
  };

  const handleUrlChange = (index: number, val: string) => {
    const newValues = [...values];
    newValues[index] = val;
    onChange(newValues);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...values, '']);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-600 tracking-wide">
        {label}
      </label>

      {values.length > 0 && (
        <div className="space-y-2">
          {values.map((url, i) => (
            <div
              key={i}
              draggable={dragActiveIndex === i}
              onDragStart={(e) => handleDragStart(e, i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200 ${
                draggedIndex === i ? 'opacity-40 border-dashed border-gray-400 bg-gray-50' : ''
              }`}
            >
              {/* Drag Handle */}
              <div
                className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 select-none shrink-0"
                onMouseDown={() => setDragActiveIndex(i)}
                onMouseUp={() => setDragActiveIndex(null)}
              >
                <GripVertical className="w-4 h-4" />
              </div>

              {/* URL Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleUrlChange(i, e.target.value)}
                  placeholder="https://ik.imagekit.io/..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all duration-300 admin-copper-ring focus:border-gray-400"
                />
              </div>

              {/* Image Preview */}
              <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                {url && /^https?:\/\/.+/.test(url) ? (
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="p-1 text-red-500 hover:text-red-700 transition shrink-0"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Button */}
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 border border-gray-300 transition text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Image URL
      </button>
    </div>
  );
};

export default ProductGalleryManager;
