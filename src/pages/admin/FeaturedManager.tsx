import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField from '../../components/admin/AdminFormField';
import { readCache, updateCacheField } from '../../services/cacheService';
import { getAllProducts } from '../../services/adminService';
import type { FeaturedProductEntry } from '../../types/admin';
import type { Product } from '../../types/product';
import { Plus, Trash2, Save, Search, X, Pencil } from 'lucide-react';

const FeaturedManager: React.FC = () => {
  const cache = readCache();
  const [entries, setEntries] = useState<FeaturedProductEntry[]>(cache.featuredProducts);
  const [saved, setSaved] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editImage, setEditImage] = useState('');

  const allProducts = useMemo(() => getAllProducts(), []);

  const productLookup = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of allProducts) {
      map.set(p.id, p);
      map.set(`the-${p.id}`, p);
      map.set(p.id.replace(/^the-/, ''), p);
    }
    return map;
  }, [allProducts]);

  const existingProductIds = useMemo(() => new Set(entries.map((e) => e.productId)), [entries]);

  const filteredPickerProducts = useMemo(() => {
    const q = pickerSearch.toLowerCase();
    return allProducts.filter(
      (p) =>
        !existingProductIds.has(p.id) &&
        (p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
    );
  }, [allProducts, pickerSearch, existingProductIds]);

  const addEntry = (p: Product) => {
    setEntries((prev) => [
      ...prev,
      { productId: p.id, displayTitle: p.title, displayImage: p.heroImage || p.productCardImage || '' },
    ]);
    setShowPicker(false);
    setPickerSearch('');
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof FeaturedProductEntry, value: string) => {
    setEntries((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const startEdit = (index: number, entry: FeaturedProductEntry) => {
    setEditingIndex(index);
    setEditTitle(entry.displayTitle);
    setEditImage(entry.displayImage);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    updateEntry(editingIndex, 'displayTitle', editTitle);
    updateEntry(editingIndex, 'displayImage', editImage);
    setEditingIndex(null);
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
              onClick={() => setShowPicker(true)}
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
            <p className="text-gray-500 mb-4">No featured products yet.</p>
            <button
              onClick={() => setShowPicker(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry, index) => {
              const product = productLookup.get(entry.productId);
              const img = entry.displayImage || product?.heroImage || product?.productCardImage || '';

              if (editingIndex === index) {
                return (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Edit Product {index + 1}</span>
                        <button onClick={saveEdit} className="text-xs text-gray-900 hover:underline font-medium">Done</button>
                      </div>
                      <AdminFormField label="Display Title" name={`edit-title-${index}`} value={editTitle} onChange={setEditTitle} />
                      <AdminFormField label="Display Image URL" name={`edit-img-${index}`} type="url" value={editImage} onChange={setEditImage} />
                      {editImage && (
                        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                          <img src={editImage} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
                  <div className="aspect-square bg-gray-50 relative">
                    {img ? (
                      <img src={img} alt={entry.displayTitle} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeEntry(index)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{entry.displayTitle || entry.productId}</h3>
                      <button
                        onClick={() => startEdit(index, entry)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {product && (
                      <p className="text-xs text-gray-500 truncate">{product.title}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showPicker && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
            <div className="absolute inset-0 bg-black/40" onClick={() => { setShowPicker(false); setPickerSearch(''); }} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[70vh] flex flex-col mx-4 animate-fade-in-up">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">Add Featured Product</h3>
                <button onClick={() => { setShowPicker(false); setPickerSearch(''); }} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:border-gray-400"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex-1 overflow-auto p-2">
                {filteredPickerProducts.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-8">
                    {pickerSearch ? 'No matching products' : 'All products are already featured'}
                  </p>
                ) : (
                  filteredPickerProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addEntry(p)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition text-left"
                    >
                      {p.heroImage || p.productCardImage ? (
                        <img src={p.heroImage || p.productCardImage} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                        <p className="text-xs text-gray-400 truncate">{p.id}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FeaturedManager;
