import React, { useState, useEffect, useRef, useMemo } from 'react';
import { fetchAllProducts } from '../../services/shopifyService';
import type { Product } from '../../types/product';
import type { Collection } from '../../types/product';
import { Search, X, Check } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

interface ProductMultiSelectProps {
  label: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  allCollections: Collection[];
  currentCollectionId: string;
  tooltip?: string;
}

const ProductMultiSelect: React.FC<ProductMultiSelectProps> = ({
  label,
  selectedIds,
  onChange,
  allCollections,
  currentCollectionId,
  tooltip,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAllProducts()
      .then((result) => {
        if (!cancelled) setProducts(result);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const otherCollections = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const col of allCollections) {
      if (col.id === currentCollectionId) continue;
      for (const pid of col.products) {
        const normPid = pid.startsWith('the-') ? pid.substring(4) : pid;
        const existing = map.get(normPid) || [];
        existing.push(col.name || col.title || col.id);
        map.set(normPid, existing);
      }
    }
    return map;
  }, [allCollections, currentCollectionId]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q)
    );
  }, [products, search]);

  const selectedChips = useMemo(() => {
    const productMap = new Map(products.map((p) => {
      const normId = p.id.startsWith('the-') ? p.id.substring(4) : p.id;
      return [normId, p];
    }));
    return selectedIds.map((id) => {
      const normId = id.startsWith('the-') ? id.substring(4) : id;
      return { id, product: productMap.get(normId) || null };
    });
  }, [products, selectedIds]);

  const toggleProduct = (id: string) => {
    const normId = id.startsWith('the-') ? id.substring(4) : id;
    const exists = selectedIds.some((selectedId) => {
      const normSelected = selectedId.startsWith('the-') ? selectedId.substring(4) : selectedId;
      return normSelected === normId;
    });

    if (exists) {
      onChange(selectedIds.filter((selectedId) => {
        const normSelected = selectedId.startsWith('the-') ? selectedId.substring(4) : selectedId;
        return normSelected !== normId;
      }));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeProduct = (id: string) => {
    const normId = id.startsWith('the-') ? id.substring(4) : id;
    onChange(selectedIds.filter((selectedId) => {
      const normSelected = selectedId.startsWith('the-') ? selectedId.substring(4) : selectedId;
      return normSelected !== normId;
    }));
  };

  return (
    <div ref={wrapperRef}>
      <label className="flex items-center text-xs font-medium text-gray-600 mb-1.5 tracking-wide">
        <span>{label}</span>
        {tooltip && <InfoTooltip content={tooltip} />}
      </label>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedChips.map(({ id, product }) => (
            <span
              key={id}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs border group ${
                product
                  ? 'bg-gray-100 text-gray-700 border-gray-200'
                  : 'bg-gray-50 text-gray-400 border-gray-200'
              }`}
            >
              {product?.heroImage && (
                <img src={product.heroImage} alt="" className="w-4 h-4 rounded object-cover" />
              )}
              <span className="max-w-[140px] truncate">{product?.title || id}</span>
              <button
                type="button"
                onClick={() => removeProduct(id)}
                className="hover:text-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={loading ? 'Loading products...' : 'Search products...'}
            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all duration-300 admin-copper-ring"
          />
        </div>

        {isOpen && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-[260px] overflow-auto admin-scrollbar">
            {loading ? (
              <div className="p-4 text-center text-gray-400 text-sm">Loading products...</div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                {search ? 'No products match your search' : 'No products available'}
              </div>
            ) : (
              filtered.map((p) => {
                const normPid = p.id.startsWith('the-') ? p.id.substring(4) : p.id;
                const isSelected = selectedIds.some((selectedId) => {
                  const normSelected = selectedId.startsWith('the-') ? selectedId.substring(4) : selectedId;
                  return normSelected === normPid;
                });
                const inOther = otherCollections.get(normPid) || [];
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProduct(p.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-gray-50 ${
                      isSelected ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition ${
                        isSelected
                          ? 'bg-gray-900 border-gray-900'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {p.heroImage || p.productCardImage ? (
                      <img
                        src={p.heroImage || p.productCardImage}
                        alt=""
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 truncate">{p.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">{p.id}</p>
                    </div>
                    {inOther.length > 0 && (
                      <span className="text-[10px] text-gray-400 flex-shrink-0 hidden sm:inline">
                        also in: {inOther.slice(0, 2).join(', ')}
                        {inOther.length > 2 && ` +${inOther.length - 2}`}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMultiSelect;
