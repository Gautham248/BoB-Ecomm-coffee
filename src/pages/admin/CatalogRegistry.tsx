import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllProducts } from '../../services/adminService';
import { fetchAllProducts } from '../../services/shopifyService';
import { readCache } from '../../services/cacheService';
import type { Product } from '../../types/product';
import { Search, Copy, Check, RefreshCw, BookOpen, Tag, Layers } from 'lucide-react';

const CatalogRegistry: React.FC = () => {
  const [productsList, setProductsList] = useState<Product[]>(() => getAllProducts());
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const cache = readCache();

  useEffect(() => {
    refreshLive();
  }, []);

  const refreshLive = async () => {
    setLoading(true);
    try {
      await fetchAllProducts();
      setProductsList(getAllProducts());
    } catch (err) {
      console.error('Failed to sync live Shopify products:', err);
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of productsList) {
      if (p.category) set.add(p.category);
    }
    return Array.from(set).sort();
  }, [productsList]);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [productsList, selectedCategory, search]);

  const getCollectionNames = (pid: string, cat: string) => {
    const matched: string[] = [];
    const variations = [pid, `the-${pid}`, pid.replace(/^the-/, '')];
    for (const col of cache.collections) {
      if (col.products.some((id) => variations.includes(id))) {
        matched.push(col.name || col.title || col.id);
      }
    }
    if (matched.length === 0 && cat) {
      return [cache.categoryLabels[cat] || cat];
    }
    return matched;
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Catalog Registry</h1>
              <p className="text-xs text-gray-500">
                Live read-only reference of all products, IDs, variants, and metadata synced from Shopify & Firestore
              </p>
            </div>
          </div>

          <button
            onClick={refreshLive}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition disabled:opacity-50 self-start md:self-auto shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Refresh Live Data'}
          </button>
        </div>

        {/* Filter / Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Product ID, Shopify Handle, Title, or Category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-400 ml-1" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition cursor-pointer"
            >
              <option value="ALL">All Categories ({productsList.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cache.categoryLabels[cat] || cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Registry Table / Grid */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-16">Image</th>
                  <th className="py-3.5 px-4">Identifiers (1-Click Copy)</th>
                  <th className="py-3.5 px-4">Title & Name</th>
                  <th className="py-3.5 px-4">Collections / Category</th>
                  <th className="py-3.5 px-4">Price & Variants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      No matching products found in the catalog registry.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const shopifyHandle = p.id.replace(/^the-/, '');
                    const collectionsList = getCollectionNames(p.id, p.category);

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/60 transition group">
                        {/* Image */}
                        <td className="py-4 px-4 align-top">
                          {p.heroImage ? (
                            <img
                              src={p.heroImage}
                              alt={p.title}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                              No Img
                            </div>
                          )}
                        </td>

                        {/* Identifiers */}
                        <td className="py-4 px-4 align-top space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 w-16">
                              CMS ID:
                            </span>
                            <code className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-mono">
                              {p.id}
                            </code>
                            <button
                              onClick={() => copyToClipboard(p.id, `cms-${p.id}`)}
                              title="Copy CMS Product ID"
                              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-900 transition"
                            >
                              {copiedKey === `cms-${p.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 w-16">
                              Shopify:
                            </span>
                            <code className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-xs font-mono">
                              {shopifyHandle}
                            </code>
                            <button
                              onClick={() => copyToClipboard(shopifyHandle, `shp-${p.id}`)}
                              title="Copy Shopify Handle"
                              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-900 transition"
                            >
                              {copiedKey === `shp-${p.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Title & Name */}
                        <td className="py-4 px-4 align-top space-y-1">
                          <div className="font-semibold text-gray-900">{p.title}</div>
                          {p.name && p.name !== p.title && (
                            <div className="text-xs text-gray-500 font-mono">Upper: {p.name}</div>
                          )}
                        </td>

                        {/* Collections */}
                        <td className="py-4 px-4 align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {collectionsList.map((colName, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700"
                              >
                                <Tag className="w-3 h-3 text-gray-400" />
                                {colName}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Price & Variants */}
                        <td className="py-4 px-4 align-top space-y-1.5">
                          <div className="text-sm font-semibold text-gray-900">{p.price || 'N/A'}</div>
                          {p.shopifyVariants && p.shopifyVariants.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {p.shopifyVariants.map((v) => (
                                <span
                                  key={v.id}
                                  onClick={() => copyToClipboard(`${v.title} (${v.price})`, `var-${v.id}`)}
                                  title="Click to copy variant details"
                                  className="cursor-pointer px-2 py-0.5 bg-gray-50 border border-gray-200 hover:border-gray-400 rounded text-[11px] text-gray-600 transition flex items-center gap-1"
                                >
                                  {v.title}
                                  {copiedKey === `var-${v.id}` && (
                                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                                  )}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CatalogRegistry;
