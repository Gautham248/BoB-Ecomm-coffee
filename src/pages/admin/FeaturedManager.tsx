import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField from '../../components/admin/AdminFormField';
import { readCache, updateCacheField } from '../../services/cacheService';
import type { FeaturedProductEntry } from '../../types/admin';
import { Plus, Trash2, Save } from 'lucide-react';

const FeaturedManager: React.FC = () => {
  const cache = readCache();
  const [entries, setEntries] = useState<FeaturedProductEntry[]>(cache.featuredProducts);
  const [saved, setSaved] = useState(false);

  const updateEntry = (index: number, field: keyof FeaturedProductEntry, value: string) => {
    setEntries((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, { productId: '', displayTitle: '', displayImage: '' }]);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateCacheField('featuredProducts', entries);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <div className="flex gap-3">
            <button
              onClick={addEntry}
              className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No featured products. Click "Add Product" to select some.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Product {index + 1}</span>
                  <button
                    onClick={() => removeEntry(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <AdminFormField
                    label="Product ID"
                    name={`prod-${index}`}
                    value={entry.productId}
                    onChange={(v) => updateEntry(index, 'productId', v)}
                    placeholder="the-origin"
                    required
                    tooltip="The internal database identifier for the featured product (e.g. the-origin)."
                  />
                  <AdminFormField
                    label="Display Title (optional)"
                    name={`title-${index}`}
                    value={entry.displayTitle || ''}
                    onChange={(v) => updateEntry(index, 'displayTitle', v)}
                    placeholder="Custom display name"
                    tooltip="Custom title to display on the storefront instead of the default Shopify title."
                  />
                </div>

                <AdminFormField
                  label="Display Image URL (optional)"
                  name={`img-${index}`}
                  type="url"
                  value={entry.displayImage || ''}
                  onChange={(v) => updateEntry(index, 'displayImage', v)}
                  placeholder="Custom thumbnail URL"
                  tooltip="Custom image URL to display on the storefront instead of the main hero image."
                />

                {entry.displayImage && (
                  <img
                    src={entry.displayImage}
                    alt=""
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FeaturedManager;
