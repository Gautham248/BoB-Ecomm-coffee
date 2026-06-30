import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField from '../../components/admin/AdminFormField';
import { readCache, updateCacheField } from '../../services/cacheService';
import type { Collection } from '../../types/product';
import { Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';

const EMPTY_COLLECTION: Collection = {
  id: '',
  name: '',
  title: '',
  description: '',
  price: '',
  image: '',
  products: [],
  featured: true,
  upcoming: false,
};

const CollectionsManager: React.FC = () => {
  const cache = readCache();
  const [collections, setCollections] = useState<Collection[]>(cache.collections);
  const [saved, setSaved] = useState(false);

  const updateCollection = (index: number, field: keyof Collection, value: unknown) => {
    setCollections((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addCollection = () => {
    const newCol = { ...EMPTY_COLLECTION, id: `collection-${Date.now()}` };
    setCollections((prev) => [...prev, newCol]);
  };

  const removeCollection = (index: number) => {
    setCollections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateCacheField('collections', collections);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-roast-cream">Collections</h2>
          <div className="flex gap-3">
            <button
              onClick={addCollection}
              className="flex items-center gap-1 px-4 py-2 bg-roast-card text-roast-dust rounded-lg hover:bg-roast-hover transition text-sm"
            >
              <Plus className="w-4 h-4" /> Add Collection
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-copper text-roast-base rounded-lg hover:bg-copper-dark transition text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {collections.length === 0 ? (
          <div className="bg-roast-surface rounded-xl border border-roast-border p-12 text-center">
            <p className="text-roast-muted">No collections yet. Click "Add Collection" to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((collection, index) => (
              <div key={collection.id || index} className="bg-roast-surface rounded-xl border border-roast-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-roast-cream">
                    {collection.name || 'New Collection'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCollection(index, 'upcoming', !collection.upcoming)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${
                        collection.upcoming
                          ? 'bg-amber-DEFAULT/15 text-amber-DEFAULT'
                          : 'bg-sage-DEFAULT/15 text-sage-DEFAULT'
                      }`}
                    >
                      {collection.upcoming ? (
                        <><EyeOff className="w-3 h-3" /> Coming Soon</>
                      ) : (
                        <><Eye className="w-3 h-3" /> Active</>
                      )}
                    </button>
                    <button
                      onClick={() => removeCollection(index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AdminFormField
                    label="Name"
                    name={`name-${index}`}
                    value={collection.name}
                    onChange={(v) => updateCollection(index, 'name', v)}
                    required
                  />
                  <AdminFormField
                    label="Title"
                    name={`title-${index}`}
                    value={collection.title}
                    onChange={(v) => updateCollection(index, 'title', v)}
                  />
                  <AdminFormField
                    label="Price (e.g. From ₹749)"
                    name={`price-${index}`}
                    value={collection.price}
                    onChange={(v) => updateCollection(index, 'price', v)}
                  />
                  <AdminFormField
                    label="Thumbnail URL"
                    name={`image-${index}`}
                    type="url"
                    value={collection.image}
                    onChange={(v) => updateCollection(index, 'image', v)}
                  />
                </div>

                <AdminFormField
                  label="Description"
                  name={`desc-${index}`}
                  type="textarea"
                  value={collection.description}
                  onChange={(v) => updateCollection(index, 'description', v)}
                />

                <AdminFormField
                  label="Product IDs (comma-separated)"
                  name={`products-${index}`}
                  value={collection.products.join(', ')}
                  onChange={(v) =>
                    updateCollection(
                      index,
                      'products',
                      v.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="the-origin, the-wild-fire-rush"
                />

                {collection.image && (
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-32 h-32 object-cover rounded-lg border border-roast-border"
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

export default CollectionsManager;
