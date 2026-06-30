import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField from '../../components/admin/AdminFormField';
import { readCache, updateCacheField } from '../../services/cacheService';
import type { Product } from '../../types/product';
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';

const EMPTY_PRODUCT: Product = {
  id: '',
  name: '',
  title: '',
  description: '',
  price: '',
  heroImage: '',
  heroImageMobile: '',
  productCardImage: '',
  galleryImages: [],
  traceability: { source: '', tasteNotes: [], process: '', elevation: '' },
  descriptionContent: { title: '', content: '', image: '' },
  category: 'movement',
  featured: false,
  upcoming: false,
};

const MovementManager: React.FC = () => {
  const cache = readCache();
  const [products, setProducts] = useState<Product[]>(cache.movementProducts);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const updateProduct = (index: number, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const addProduct = () => {
    setProducts((prev) => [...prev, { ...EMPTY_PRODUCT, id: `movement-${Date.now()}` }]);
    setExpanded(products.length);
  };

  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
    if (expanded === index) setExpanded(null);
  };

  const handleSave = () => {
    updateCacheField('movementProducts', products);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateNested = <K extends keyof Product>(
    index: number,
    key: K,
    nestedKey: string,
    value: unknown
  ) => {
    setProducts((prev) => {
      const updated = [...prev];
      const current = updated[index][key] as Record<string, unknown>;
      updated[index] = {
        ...updated[index],
        [key]: { ...current, [nestedKey]: value },
      };
      return updated;
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-roast-cream">Movement</h2>
          <div className="flex gap-3">
            <button
              onClick={addProduct}
              className="flex items-center gap-1 px-3 py-2 bg-roast-card text-roast-dust rounded-lg hover:bg-roast-hover transition text-sm"
            >
              <Plus className="w-4 h-4" /> Add Product
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

        {products.length === 0 ? (
          <div className="bg-roast-surface rounded-xl border border-roast-border p-12 text-center">
            <p className="text-roast-muted">No movement products yet. Click "Add Product" to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={product.id || index} className="bg-roast-surface rounded-xl border border-roast-border overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 hover:bg-roast-base transition"
                >
                  <div className="flex items-center gap-3">
                    {product.heroImage && (
                      <img src={product.heroImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <span className="text-sm font-medium text-roast-cream">
                      {product.name || 'New Movement Product'}
                    </span>
                    <span className="text-xs text-roast-muted">{product.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeProduct(index); }}
                      className="p-1 text-rust-DEFAULT hover:bg-rust-muted/10 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expanded === index ? (
                      <ChevronUp className="w-4 h-4 text-roast-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-roast-muted" />
                    )}
                  </div>
                </button>

                {expanded === index && (
                  <div className="p-4 border-t border-roast-border space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <AdminFormField
                        label="Name (uppercase)"
                        name={`mv-name-${index}`}
                        value={product.name}
                        onChange={(v) => updateProduct(index, { name: v })}
                        required
                      />
                      <AdminFormField
                        label="Title"
                        name={`mv-title-${index}`}
                        value={product.title}
                        onChange={(v) => updateProduct(index, { title: v })}
                      />
                      <AdminFormField
                        label="Price"
                        name={`mv-price-${index}`}
                        value={product.price}
                        onChange={(v) => updateProduct(index, { price: v })}
                      />
                      <AdminFormField
                        label="Shopify ID (optional)"
                        name={`mv-shopify-${index}`}
                        value={product.shopifyId || ''}
                        onChange={(v) => updateProduct(index, { shopifyId: v })}
                      />
                    </div>

                    <AdminFormField
                      label="Description"
                      name={`mv-desc-${index}`}
                      type="textarea"
                      value={product.description}
                      onChange={(v) => updateProduct(index, { description: v })}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <AdminFormField
                        label="Hero Image URL"
                        name={`mv-hero-${index}`}
                        type="url"
                        value={product.heroImage}
                        onChange={(v) => updateProduct(index, { heroImage: v })}
                      />
                      <AdminFormField
                        label="Hero Image (Mobile)"
                        name={`mv-hero-mob-${index}`}
                        type="url"
                        value={product.heroImageMobile}
                        onChange={(v) => updateProduct(index, { heroImageMobile: v })}
                      />
                      <AdminFormField
                        label="Product Card Image"
                        name={`mv-card-${index}`}
                        type="url"
                        value={product.productCardImage}
                        onChange={(v) => updateProduct(index, { productCardImage: v })}
                      />
                    </div>

                    <fieldset className="border border-roast-border rounded-lg p-3 space-y-2">
                      <legend className="text-xs font-semibold text-roast-dust px-1">Traceability</legend>
                      <div className="grid grid-cols-2 gap-2">
                        <AdminFormField
                          label="Source"
                          name={`mv-source-${index}`}
                          value={product.traceability.source}
                          onChange={(v) => updateNested(index, 'traceability', 'source', v)}
                        />
                        <AdminFormField
                          label="Process"
                          name={`mv-process-${index}`}
                          value={product.traceability.process}
                          onChange={(v) => updateNested(index, 'traceability', 'process', v)}
                        />
                        <AdminFormField
                          label="Elevation"
                          name={`mv-elev-${index}`}
                          value={product.traceability.elevation}
                          onChange={(v) => updateNested(index, 'traceability', 'elevation', v)}
                        />
                        <AdminFormField
                          label="Tasting Notes"
                          name={`mv-notes-${index}`}
                          value={product.traceability.tasteNotes.join(', ')}
                          onChange={(v) =>
                            updateNested(
                              index,
                              'traceability',
                              'tasteNotes',
                              v.split(',').map((s) => s.trim()).filter(Boolean)
                            )
                          }
                          placeholder="Chocolate, Nutty"
                        />
                      </div>
                    </fieldset>

                    <fieldset className="border border-roast-border rounded-lg p-3 space-y-2">
                      <legend className="text-xs font-semibold text-roast-dust px-1">Description Content</legend>
                      <AdminFormField
                        label="Title"
                        name={`mv-dt-${index}`}
                        value={product.descriptionContent.title}
                        onChange={(v) => updateNested(index, 'descriptionContent', 'title', v)}
                      />
                      <AdminFormField
                        label="Content"
                        name={`mv-dc-${index}`}
                        type="textarea"
                        value={product.descriptionContent.content}
                        onChange={(v) => updateNested(index, 'descriptionContent', 'content', v)}
                      />
                      <AdminFormField
                        label="Image URL"
                        name={`mv-di-${index}`}
                        type="url"
                        value={product.descriptionContent.image}
                        onChange={(v) => updateNested(index, 'descriptionContent', 'image', v)}
                      />
                    </fieldset>

                    <AdminFormField
                      label="Gallery URLs (one per line)"
                      name={`mv-gal-${index}`}
                      type="textarea"
                      value={product.galleryImages.join('\n')}
                      onChange={(v) =>
                        updateProduct(index, {
                          galleryImages: v.split('\n').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                    />

                    <div className="flex flex-wrap gap-2">
                      {product.galleryImages.map((url, i) => (
                        <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MovementManager;
