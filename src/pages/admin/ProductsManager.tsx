import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField from '../../components/admin/AdminFormField';
import {
  readCache,
  updateCacheField,
} from '../../services/cacheService';
import { fetchAllProducts } from '../../services/shopifyService';
import { getAllProducts } from '../../services/adminService';
import { writeCollection } from '../../services/firestoreService';
import type { Product } from '../../types/product';
import { Save, RefreshCw, Search } from 'lucide-react';
import ChipInput from '../../components/admin/ChipInput';
import ProductGalleryManager from '../../components/admin/ProductGalleryManager';
import InfoTooltip from '../../components/admin/InfoTooltip';

const resolveMetaKey = (pid: string, metaMap: Record<string, unknown>): string => {
  const prefixed = pid.startsWith('the-') ? pid : `the-${pid}`;
  if (metaMap[prefixed]) return prefixed;
  if (metaMap[pid]) return pid;
  const stripped = pid.replace(/^the-/, '');
  if (metaMap[stripped]) return stripped;
  return prefixed;
};

const ProductsManager: React.FC = () => {
  const [cache, setCache] = useState(() => readCache());
  const [productsList, setProductsList] = useState<Product[]>(() => getAllProducts());
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [categoryLabels, setCatLabels] = useState<Record<string, string>>(cache.categoryLabels);
  const [headerIds, setHeaderIds] = useState<string[]>(cache.headerProducts);

  const refreshData = () => {
    setCache(readCache());
    setProductsList(getAllProducts());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setSyncError('');
    try {
      const liveProducts = await fetchAllProducts();
      const currentCache = readCache();
      const movementShopifyIds = new Set(
        currentCache.movementProducts.map((p) => p.shopifyId).filter(Boolean)
      );
      // Handles that must never be stored as regular productMetadata entries.
      const MOVEMENT_HANDLES = new Set(['movement', 'the-movement']);
      let modified = false;

      // Synchronize movement product images and shopifyId if they are empty
      const updatedMovementProducts = currentCache.movementProducts.map((mp) => {
        const lp = liveProducts.find(
          (item) => (item.shopifyId && item.shopifyId === mp.shopifyId) || MOVEMENT_HANDLES.has(item.id) || item.id === mp.id
        );
        if (lp) {
          let mpModified = false;
          const updated = { ...mp };
          if (!updated.shopifyId && lp.shopifyId) {
            updated.shopifyId = lp.shopifyId;
            mpModified = true;
          }
          if (!updated.heroImage && lp.heroImage) {
            updated.heroImage = lp.heroImage;
            mpModified = true;
          }
          if (!updated.heroImageMobile && lp.heroImageMobile) {
            updated.heroImageMobile = lp.heroImageMobile;
            mpModified = true;
          }
          if (!updated.productCardImage && lp.productCardImage) {
            updated.productCardImage = lp.productCardImage;
            mpModified = true;
          }
          if (mpModified) {
            modified = true;
            return updated;
          }
        }
        return mp;
      });

      if (modified) {
        currentCache.movementProducts = updatedMovementProducts;
        updateCacheField('movementProducts', updatedMovementProducts);
      }

      for (const lp of liveProducts) {
        if (lp.shopifyId && movementShopifyIds.has(lp.shopifyId)) continue;
        if (MOVEMENT_HANDLES.has(lp.id)) continue;
        const metaKey = resolveMetaKey(lp.id, currentCache.productMetadata);
        if (!currentCache.productMetadata[metaKey]) {
          currentCache.productMetadata[metaKey] = {
            shopifyId: lp.shopifyId,
            name: lp.name || lp.title,
            title: lp.title || lp.name,
            price: lp.price,
            heroImage: lp.heroImage,
            description: lp.description,
            category: lp.category,
          };
          modified = true;
        }
      }
      if (modified) {
        updateCacheField('productMetadata', currentCache.productMetadata);
      }
      refreshData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sync from Shopify';
      setSyncError(message);
      console.error('Shopify sync error:', new Error().stack, err);
    }
    setLoading(false);
  };

  const selected = selectedId
    ? productsList.find((p) => p.id === selectedId || p.id === `the-${selectedId}` || p.id === selectedId.replace(/^the-/, ''))
    : null;

  const metaKey = selectedId ? resolveMetaKey(selectedId, cache.productMetadata) : null;
  const metadata = (metaKey ? cache.productMetadata[metaKey] : null) || {};

  const categories = useMemo(() => {
    const list: { id: string; label: string }[] = [];
    const seen = new Set<string>();
    for (const col of cache.collections) {
      list.push({ id: col.id, label: col.name || col.title || col.id });
      seen.add(col.id);
    }
    for (const [key, label] of Object.entries(categoryLabels)) {
      if (!seen.has(key)) {
        list.push({ id: key, label: label || key });
        seen.add(key);
      }
    }
    return list;
  }, [cache.collections, categoryLabels]);

  const updateMeta = (field: string, value: unknown) => {
    if (!selectedId) return;
    const currentCache = readCache();
    const key = resolveMetaKey(selectedId, currentCache.productMetadata);
    currentCache.productMetadata[key] = {
      ...(currentCache.productMetadata[key] || {}),
      [field]: value,
    };
    updateCacheField('productMetadata', currentCache.productMetadata);
    refreshData();
  };

  const handleCategoryChange = (newCat: string) => {
    if (!selectedId) return;
    const currentCache = readCache();
    const key = resolveMetaKey(selectedId, currentCache.productMetadata);
    currentCache.productMetadata[key] = {
      ...(currentCache.productMetadata[key] || {}),
      category: newCat,
    };

    const variations = [selectedId, key, selectedId.startsWith('the-') ? selectedId : `the-${selectedId}`, selectedId.replace(/^the-/, '')];
    let colModified = false;
    for (const col of currentCache.collections) {
      if (col.id === newCat) {
        if (!col.products.some(pid => variations.includes(pid))) {
          col.products.push(key);
          colModified = true;
        }
      }
    }

    updateCacheField('productMetadata', currentCache.productMetadata);
    if (colModified) {
      updateCacheField('collections', currentCache.collections);
      writeCollection('collections', currentCache.collections).catch(console.error);
    }
    refreshData();
  };

  const handleSave = () => {
    updateCacheField('categoryLabels', categoryLabels);
    updateCacheField('headerProducts', headerIds);
    writeCollection('products', getAllProducts()).catch(console.error);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const filtered = productsList.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <div className="flex gap-3">
            <button
              onClick={loadProducts}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Sync from Shopify
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none"
              />
            </div>

            {syncError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-start gap-2">
                <span className="shrink-0 mt-0.5">!</span>
                <div>
                  <p className="font-medium">Sync failed</p>
                  <p className="text-xs text-red-600 mt-0.5">{syncError}</p>
                  <button
                    onClick={() => loadProducts()}
                    className="text-xs text-red-600 underline mt-1 hover:text-red-400"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 max-h-[600px] overflow-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500 text-sm">Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">No products found</div>
              ) : (
                filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left p-3 hover:bg-gray-50 transition text-sm ${
                      selectedId === p.id ? 'bg-gray-50 font-medium' : ''
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

            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Header Products</h4>
              <p className="text-xs text-gray-500">Select products to show in nav dropdown</p>
              {productsList.map((p) => (
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
                    className="rounded border-gray-300"
                  />
                  {p.title}
                </label>
              ))}
            </div>

          </div>

          <div className="md:col-span-2">
            {selected ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <div className="flex items-center gap-3">
                  {selected.heroImage && (
                    <img src={selected.heroImage} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selected.title}</h3>
                    <p className="text-sm text-gray-500">ID: {selected.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AdminFormField
                    label="Name (uppercase)"
                    name="name"
                    value={(metadata as Record<string, string>).name || selected.name}
                    onChange={(v) => updateMeta('name', v)}
                    tooltip="The uppercase name displayed in storefront headings and checkout details."
                  />
                  <AdminFormField
                    label="Price"
                    name="price"
                    value={(metadata as Record<string, string>).price || selected.price}
                    onChange={(v) => updateMeta('price', v)}
                    tooltip="Price text displayed on storefront product detail cards (e.g. ₹749)."
                  />
                  <div className="space-y-1">
                    <label htmlFor="admin-product-category" className="flex items-center text-xs font-medium text-gray-700">
                      <span>Category</span>
                      <InfoTooltip content="The primary collection or group this product belongs to." />
                    </label>
                    <select
                      id="admin-product-category"
                      name="category"
                      value={(metadata as Record<string, string>).category || selected.category || ''}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-gray-900 outline-none"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label} ({cat.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <AdminFormField
                    label="Hero Image URL"
                    name="heroImage"
                    type="url"
                    value={(metadata as Record<string, string>).heroImage || selected.heroImage}
                    onChange={(v) => updateMeta('heroImage', v)}
                    tooltip="Direct URL of the high-res image displayed on the product's banner section."
                  />
                  <AdminFormField
                    label="Hero Image (Mobile)"
                    name="heroImageMobile"
                    type="url"
                    value={(metadata as Record<string, string>).heroImageMobile || selected.heroImageMobile || ''}
                    onChange={(v) => updateMeta('heroImageMobile', v)}
                    tooltip="Direct URL of the mobile-optimized image displayed on the product's mobile banner."
                  />
                  <AdminFormField
                    label="Product Card Image"
                    name="productCardImage"
                    type="url"
                    value={(metadata as Record<string, string>).productCardImage || selected.productCardImage || ''}
                    onChange={(v) => updateMeta('productCardImage', v)}
                    tooltip="The square image displayed on collection catalog grids and search results."
                  />
                </div>                 <AdminFormField
                  label="Description"
                  name="desc"
                  type="textarea"
                  value={(metadata as Record<string, string>).description || selected.description}
                  onChange={(v) => updateMeta('description', v)}
                  tooltip="Main paragraph describing the coffee profile, origin flavor notes, or body characteristics."
                />

                <fieldset className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <legend className="text-sm font-semibold text-gray-900 px-1">Traceability</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ChipInput
                      label="Source"
                      name="source"
                      values={Array.isArray((metadata.traceability || selected.traceability).source) ? (metadata.traceability || selected.traceability).source as string[] : (typeof (metadata.traceability || selected.traceability).source === 'string' ? [(metadata.traceability || selected.traceability).source as string] : [])}
                      onChange={(v) => updateMeta('traceability', { ...(metadata.traceability || selected.traceability), source: v })}
                      placeholder="Enter source location"
                      tooltip="Specific estates, co-ops, regions, or farms where the beans were harvested."
                    />
                    <ChipInput
                      label="Process"
                      name="process"
                      values={Array.isArray((metadata.traceability || selected.traceability).process) ? (metadata.traceability || selected.traceability).process as string[] : (typeof (metadata.traceability || selected.traceability).process === 'string' ? [(metadata.traceability || selected.traceability).process as string] : [])}
                      onChange={(v) => updateMeta('traceability', { ...(metadata.traceability || selected.traceability), process: v })}
                      placeholder="Enter process method"
                      tooltip="The coffee bean processing method (e.g. Natural, Washed, Honey, anaerobic)."
                    />
                    <AdminFormField
                      label="Elevation"
                      name="elevation"
                      value={(metadata as Record<string, string>).traceability?.elevation || selected.traceability.elevation}
                      onChange={(v) => updateMeta('traceability', { ...(metadata.traceability || selected.traceability), elevation: v })}
                      tooltip="The altitude/elevation where the coffee was grown (e.g. 1500m or 4900ft)."
                    />
                    <ChipInput
                      label="Tasting Notes"
                      name="tasteNotes"
                      values={Array.isArray((metadata.traceability || selected.tasteNotes).tasteNotes) ? (metadata.traceability || selected.tasteNotes).tasteNotes : []}
                      onChange={(v) => updateMeta('traceability', { ...(metadata.traceability || selected.traceability), tasteNotes: v })}
                      placeholder="Enter tasting note"
                      tooltip="Flavor characteristics, aromas, or notes observed (e.g., Citrus, Chocolate, Caramel)."
                    />
                  </div>
                </fieldset>

                <fieldset className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <legend className="text-sm font-semibold text-gray-900 px-1">Description Content</legend>
                  <AdminFormField
                    label="Title"
                    name="descTitle"
                    value={(metadata as Record<string, string>).descriptionContent?.title || selected.descriptionContent.title}
                    onChange={(v) => updateMeta('descriptionContent', { ...(metadata.descriptionContent || selected.descriptionContent), title: v })}
                    tooltip="Heading for the secondary product story or details section."
                  />
                  <AdminFormField
                    label="Content"
                    name="descContent"
                    type="textarea"
                    value={(metadata as Record<string, string>).descriptionContent?.content || selected.descriptionContent.content}
                    onChange={(v) => updateMeta('descriptionContent', { ...(metadata.descriptionContent || selected.descriptionContent), content: v })}
                    tooltip="Rich body text detailing the brand/product story or background narrative."
                  />
                  <AdminFormField
                    label="Image URL"
                    name="descImage"
                    type="url"
                    value={(metadata as Record<string, string>).descriptionContent?.image || selected.descriptionContent.image}
                    onChange={(v) => updateMeta('descriptionContent', { ...(metadata.descriptionContent || selected.descriptionContent), image: v })}
                    tooltip="URL of the descriptive image rendered alongside the product story text."
                  />
                </fieldset>

                <fieldset className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <legend className="text-sm font-semibold text-gray-900 px-1">Gallery Images</legend>
                  <ProductGalleryManager
                    label="Gallery URLs"
                    values={Array.isArray((metadata as Record<string, string[]>).galleryImages || selected.galleryImages) ? ((metadata as Record<string, string[]>).galleryImages || selected.galleryImages) : []}
                    onChange={(v) => updateMeta('galleryImages', v)}
                    tooltip="A list of additional product photos that can be reordered via drag-and-drop."
                  />
                </fieldset>

                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="product-status"
                      checked={!(metadata as Record<string, boolean>).featured && !(metadata as Record<string, boolean>).upcoming}
                      onChange={() => { updateMeta('featured', false); updateMeta('upcoming', false); }}
                      className="rounded-full border-gray-300"
                    />
                    None
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="product-status"
                      checked={Boolean((metadata as Record<string, boolean>).featured)}
                      onChange={() => { updateMeta('featured', true); updateMeta('upcoming', false); }}
                      className="rounded-full border-gray-300"
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="product-status"
                      checked={Boolean((metadata as Record<string, boolean>).upcoming)}
                      onChange={() => { updateMeta('featured', false); updateMeta('upcoming', true); }}
                      className="rounded-full border-gray-300"
                    />
                    Upcoming
                  </label>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">Select a product from the list to edit its metadata.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductsManager;
