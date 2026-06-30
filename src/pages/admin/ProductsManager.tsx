import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField from '../../components/admin/AdminFormField';
import {
  readCache,
  updateCacheField,
} from '../../services/cacheService';
import { fetchAllProducts } from '../../services/shopifyService';
import type { Product } from '../../types/product';
import { Save, RefreshCw, Search } from 'lucide-react';

const ProductsManager: React.FC = () => {
  const cache = readCache();
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [categoryLabels, setCatLabels] = useState<Record<string, string>>(cache.categoryLabels);
  const [headerIds, setHeaderIds] = useState<string[]>(cache.headerProducts);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setSyncError('');
    try {
      const products = await fetchAllProducts();
      setShopifyProducts(products);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sync from Shopify';
      setSyncError(message);
      console.error('Shopify sync error:', new Error().stack, err);
    }
    setLoading(false);
  };

  const selected = selectedId ? shopifyProducts.find((p) => p.id === selectedId) : null;
  const metadata = selectedId ? cache.productMetadata[selectedId] || {} : {};

  const updateMeta = (field: string, value: unknown) => {
    if (!selectedId) return;
    const cache = readCache();
    cache.productMetadata[selectedId] = { ...cache.productMetadata[selectedId], [field]: value };
    updateCacheField('productMetadata', cache.productMetadata);
  };

  const handleSave = () => {
    updateCacheField('categoryLabels', categoryLabels);
    updateCacheField('headerProducts', headerIds);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const filtered = shopifyProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-roast-cream">Products</h2>
          <div className="flex gap-3">
            <button
              onClick={loadProducts}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-2 bg-roast-card text-roast-dust rounded-lg hover:bg-roast-hover transition text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Sync from Shopify
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-copper text-roast-base rounded-lg hover:bg-copper-dark transition text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-roast-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-3 py-2 border border-roast-border rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none"
              />
            </div>

            {syncError && (
              <div className="p-3 bg-rust-muted/10 border border-rust-DEFAULT/20 text-rust-DEFAULT rounded-lg text-sm flex items-start gap-2">
                <span className="shrink-0 mt-0.5">!</span>
                <div>
                  <p className="font-medium">Sync failed</p>
                  <p className="text-xs text-rust-DEFAULT mt-0.5">{syncError}</p>
                  <button
                    onClick={() => loadProducts()}
                    className="text-xs text-rust-DEFAULT underline mt-1 hover:text-rust-muted"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div className="bg-roast-surface rounded-xl border border-roast-border divide-y divide-gray-100 max-h-[600px] overflow-auto">
              {loading ? (
                <div className="p-6 text-center text-roast-muted text-sm">Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-center text-roast-muted text-sm">No products found</div>
              ) : (
                filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left p-3 hover:bg-roast-base transition text-sm ${
                      selectedId === p.id ? 'bg-roast-card font-medium' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {p.heroImage && (
                        <img src={p.heroImage} alt="" className="w-8 h-8 rounded object-cover" />
                      )}
                      <span className="truncate">{p.title}</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="bg-roast-surface rounded-xl border border-roast-border p-4 space-y-2">
              <h4 className="text-sm font-semibold text-roast-cream">Header Products</h4>
              <p className="text-xs text-roast-muted">Select products to show in nav dropdown (max 5)</p>
              {shopifyProducts.slice(0, 10).map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={headerIds.includes(p.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setHeaderIds((prev) => [...prev, p.id]);
                      } else {
                        setHeaderIds((prev) => prev.filter((id) => id !== p.id));
                      }
                    }}
                    className="rounded border-roast-border"
                  />
                  {p.title}
                </label>
              ))}
            </div>

            <div className="bg-roast-surface rounded-xl border border-roast-border p-4 space-y-2">
              <h4 className="text-sm font-semibold text-roast-cream">Category Labels</h4>
              {Object.entries(categoryLabels).map(([key, val]) => (
                <AdminFormField
                  key={key}
                  label={key}
                  name={`cat-${key}`}
                  value={val}
                  onChange={(v) => setCatLabels((prev) => ({ ...prev, [key]: v }))}
                />
              ))}
              <button
                onClick={() => {
                  const newKey = prompt('New category key (e.g. micro-lots):');
                  if (newKey) setCatLabels((prev) => ({ ...prev, [newKey]: 'New Category' }));
                }}
                className="text-xs text-roast-muted hover:text-roast-cream transition"
              >
                + Add category
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            {selected ? (
              <div className="bg-roast-surface rounded-xl border border-roast-border p-6 space-y-5">
                <div className="flex items-center gap-3">
                  {selected.heroImage && (
                    <img src={selected.heroImage} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-roast-cream">{selected.title}</h3>
                    <p className="text-sm text-roast-muted">ID: {selected.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AdminFormField
                    label="Name (uppercase)"
                    name="name"
                    value={(metadata as Record<string, string>).name || selected.name}
                    onChange={(v) => updateMeta('name', v)}
                  />
                  <AdminFormField
                    label="Price"
                    name="price"
                    value={(metadata as Record<string, string>).price || selected.price}
                    onChange={(v) => updateMeta('price', v)}
                  />
                  <AdminFormField
                    label="Category"
                    name="category"
                    value={(metadata as Record<string, string>).category || selected.category}
                    onChange={(v) => updateMeta('category', v)}
                  />
                  <AdminFormField
                    label="Hero Image URL"
                    name="heroImage"
                    type="url"
                    value={(metadata as Record<string, string>).heroImage || selected.heroImage}
                    onChange={(v) => updateMeta('heroImage', v)}
                  />
                  <AdminFormField
                    label="Hero Image (Mobile)"
                    name="heroImageMobile"
                    type="url"
                    value={(metadata as Record<string, string>).heroImageMobile || selected.heroImageMobile || ''}
                    onChange={(v) => updateMeta('heroImageMobile', v)}
                  />
                  <AdminFormField
                    label="Product Card Image"
                    name="productCardImage"
                    type="url"
                    value={(metadata as Record<string, string>).productCardImage || selected.productCardImage || ''}
                    onChange={(v) => updateMeta('productCardImage', v)}
                  />
                </div>

                <AdminFormField
                  label="Description"
                  name="desc"
                  type="textarea"
                  value={(metadata as Record<string, string>).description || selected.description}
                  onChange={(v) => updateMeta('description', v)}
                />

                <fieldset className="border border-roast-border rounded-lg p-4 space-y-3">
                  <legend className="text-sm font-semibold text-roast-cream px-1">Traceability</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <AdminFormField
                      label="Source"
                      name="source"
                      value={(metadata as Record<string, string>).traceability?.source || selected.traceability.source}
                      onChange={(v) => updateMeta('traceability', { ...(metadata.traceability || selected.traceability), source: v })}
                    />
                    <AdminFormField
                      label="Process"
                      name="process"
                      value={(metadata as Record<string, string>).traceability?.process || selected.traceability.process}
                      onChange={(v) => updateMeta('traceability', { ...(metadata.traceability || selected.traceability), process: v })}
                    />
                    <AdminFormField
                      label="Elevation"
                      name="elevation"
                      value={(metadata as Record<string, string>).traceability?.elevation || selected.traceability.elevation}
                      onChange={(v) => updateMeta('traceability', { ...(metadata.traceability || selected.traceability), elevation: v })}
                    />
                    <AdminFormField
                      label="Tasting Notes"
                      name="tasteNotes"
                      value={Array.isArray((metadata.traceability || selected.traceability).tasteNotes) ? (metadata.traceability || selected.traceability).tasteNotes.join(', ') : ''}
                      onChange={(v) =>
                        updateMeta('traceability', {
                          ...(metadata.traceability || selected.traceability),
                          tasteNotes: v.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Chocolate, Nutty, Sweet"
                    />
                  </div>
                </fieldset>

                <fieldset className="border border-roast-border rounded-lg p-4 space-y-3">
                  <legend className="text-sm font-semibold text-roast-cream px-1">Description Content</legend>
                  <AdminFormField
                    label="Title"
                    name="descTitle"
                    value={(metadata as Record<string, string>).descriptionContent?.title || selected.descriptionContent.title}
                    onChange={(v) => updateMeta('descriptionContent', { ...(metadata.descriptionContent || selected.descriptionContent), title: v })}
                  />
                  <AdminFormField
                    label="Content"
                    name="descContent"
                    type="textarea"
                    value={(metadata as Record<string, string>).descriptionContent?.content || selected.descriptionContent.content}
                    onChange={(v) => updateMeta('descriptionContent', { ...(metadata.descriptionContent || selected.descriptionContent), content: v })}
                  />
                  <AdminFormField
                    label="Image URL"
                    name="descImage"
                    type="url"
                    value={(metadata as Record<string, string>).descriptionContent?.image || selected.descriptionContent.image}
                    onChange={(v) => updateMeta('descriptionContent', { ...(metadata.descriptionContent || selected.descriptionContent), image: v })}
                  />
                </fieldset>

                <fieldset className="border border-roast-border rounded-lg p-4 space-y-3">
                  <legend className="text-sm font-semibold text-roast-cream px-1">Gallery Images</legend>
                  <AdminFormField
                    label="Gallery URLs (one per line)"
                    name="gallery"
                    type="textarea"
                    value={((metadata as Record<string, string[]>).galleryImages || selected.galleryImages).join('\n')}
                    onChange={(v) => updateMeta('galleryImages', v.split('\n').map((s: string) => s.trim()).filter(Boolean))}
                  />
                  <div className="flex flex-wrap gap-2">
                    {((metadata as Record<string, string[]>).galleryImages || selected.galleryImages).map((url: string, i: number) => (
                      <img key={i} src={url} alt="" className="w-20 h-20 object-cover rounded border border-roast-border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ))}
                  </div>
                </fieldset>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(metadata.featured || selected.featured) || false}
                      onChange={(e) => updateMeta('featured', e.target.checked)}
                      className="rounded border-roast-border"
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(metadata.upcoming || selected.upcoming) || false}
                      onChange={(e) => updateMeta('upcoming', e.target.checked)}
                      className="rounded border-roast-border"
                    />
                    Upcoming
                  </label>
                </div>
              </div>
            ) : (
              <div className="bg-roast-surface rounded-xl border border-roast-border p-12 text-center">
                <p className="text-roast-muted">Select a product from the list to edit its metadata.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductsManager;
