import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField from '../../components/admin/AdminFormField';
import ProductMultiSelect from '../../components/admin/ProductMultiSelect';
import { readCache, writeCache } from '../../services/cacheService';
import { writeCollection } from '../../services/firestoreService';
import { getAllProducts } from '../../services/adminService';
import type { Collection, Product } from '../../types/product';
import { Plus, Trash2, Save, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showMatrix, setShowMatrix] = useState(false);

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

  const productNameLookup = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of getAllProducts()) {
      map.set(p.id, p);
    }
    return map;
  }, []);

  const collectionProductMap = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const col of collections) {
      for (const pid of col.products) {
        const existing = map.get(pid) || [];
        existing.push(col.name || col.title || col.id);
        map.set(pid, existing);
      }
    }
    return map;
  }, [collections]);

  const toggleProductInCollection = (productId: string, collectionIdx: number) => {
    setCollections((prev) => {
      const updated = [...prev];
      const col = { ...updated[collectionIdx] };
      if (col.products.includes(productId)) {
        col.products = col.products.filter((pid) => pid !== productId);
      } else {
        col.products = [...col.products, productId];
      }
      updated[collectionIdx] = col;
      return updated;
    });
  };

  const sharedProducts = useMemo(() => {
    const entries = Array.from(collectionProductMap.entries());
    return entries
      .filter(([, cols]) => cols.length >= 2)
      .sort(([, a], [, b]) => b.length - a.length);
  }, [collectionProductMap]);

  const orphanProducts = useMemo(() => {
    return Array.from(collectionProductMap.entries())
      .filter(([, cols]) => cols.length === 1)
      .sort(([, a], [, b]) => a[0].localeCompare(b[0]));
  }, [collectionProductMap]);
  const handleSave = () => {
    const cache = readCache();

    const productToCategory = new Map<string, string>();
    for (const col of collections) {
      for (const pid of col.products) {
        if (!productToCategory.has(pid)) {
          productToCategory.set(pid, col.id);
        }
      }
    }

    const metadata = { ...cache.productMetadata };
    for (const [pid, categoryId] of productToCategory) {
      metadata[pid] = {
        ...(metadata[pid] || {}),
        category: categoryId,
      };
    }

    cache.collections = collections;
    cache.productMetadata = metadata;
    writeCache(cache);
    writeCollection('collections', collections).catch(console.error);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Collections</h2>
          <div className="flex gap-3">
            <button
              onClick={addCollection}
              className="flex items-center gap-1 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm"
            >
              <Plus className="w-4 h-4" /> Add Collection
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

        {collections.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No collections yet. Click "Add Collection" to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((collection, index) => (
              <div key={collection.id || index} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {collection.name || 'New Collection'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCollection(index, 'upcoming', !collection.upcoming)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${
                        collection.upcoming
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-green-50 text-green-700'
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

                <ProductMultiSelect
                  label="Products"
                  selectedIds={collection.products}
                  onChange={(ids) => updateCollection(index, 'products', ids)}
                  allCollections={collections}
                  currentCollectionId={collection.id}
                />

                {collection.image && (
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {collections.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowMatrix(!showMatrix)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  Product Assignment Overview
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {collectionProductMap.size} products assigned
                </span>
                {sharedProducts.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {sharedProducts.length} shared
                  </span>
                )}
              </div>
              {showMatrix ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {showMatrix && (
              <div className="border-t border-gray-200 p-4">
                {sharedProducts.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Shared Across Multiple Collections
                    </h4>
                    <div className="space-y-1">
                      {sharedProducts.map(([pid, cols]) => {
                        const product = productNameLookup.get(pid);
                        return (
                          <div
                            key={pid}
                            className="flex items-center gap-2 text-sm py-1.5 px-3 rounded-lg bg-amber-50/50 border border-amber-100"
                          >
                            {product?.heroImage && (
                              <img src={product.heroImage} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                            )}
                            <span className="text-gray-900 font-medium min-w-0 truncate">
                              {product?.title || pid}
                            </span>
                            <span className="text-[10px] text-amber-600 flex-shrink-0">
                              in: {cols.join(', ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {collections.length >= 2 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Quick Assign by Collection
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 pr-3 font-medium text-gray-500">Product</th>
                            {collections.map((col) => (
                              <th key={col.id} className="text-center py-2 px-2 font-medium text-gray-500 whitespace-nowrap">
                                {col.name || col.id}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {orphanProducts.map(([pid]) => {
                            const product = productNameLookup.get(pid);
                            if (!product) return null;
                            return (
                              <tr key={pid} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-2 pr-3">
                                  <div className="flex items-center gap-2">
                                    {product.heroImage && (
                                      <img src={product.heroImage} alt="" className="w-5 h-5 rounded object-cover" />
                                    )}
                                    <span className="text-gray-700 truncate max-w-[160px]">{product.title}</span>
                                  </div>
                                </td>
                                {collections.map((col, ci) => (
                                  <td key={col.id} className="text-center py-2 px-2">
                                    <input
                                      type="checkbox"
                                      checked={col.products.includes(pid)}
                                      onChange={() => toggleProductInCollection(pid, ci)}
                                      className="rounded border-gray-300"
                                    />
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                          {sharedProducts.map(([pid]) => {
                            const product = productNameLookup.get(pid);
                            if (!product) return null;
                            return (
                              <tr key={pid} className="border-b border-gray-100 bg-amber-50/30 hover:bg-amber-50/60">
                                <td className="py-2 pr-3">
                                  <div className="flex items-center gap-2">
                                    {product.heroImage && (
                                      <img src={product.heroImage} alt="" className="w-5 h-5 rounded object-cover" />
                                    )}
                                    <span className="text-gray-700 truncate max-w-[160px]">{product.title}</span>
                                  </div>
                                </td>
                                {collections.map((col, ci) => (
                                  <td key={col.id} className="text-center py-2 px-2">
                                    <input
                                      type="checkbox"
                                      checked={col.products.includes(pid)}
                                      onChange={() => toggleProductInCollection(pid, ci)}
                                      className="rounded border-gray-300"
                                    />
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                          {collectionProductMap.size === 0 && (
                            <tr>
                              <td colSpan={collections.length + 1} className="py-6 text-center text-gray-400">
                                No products assigned yet. Use the dropdowns above to assign products to collections.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CollectionsManager;
