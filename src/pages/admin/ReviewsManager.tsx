import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField from '../../components/admin/AdminFormField';
import { readCache, writeCache } from '../../services/cacheService';
import { getAllProducts, getProductReviews } from '../../services/adminService';
import type { Product, Review } from '../../types/product';
import { Save, Trash2, Plus, Star } from 'lucide-react';

const EMPTY_REVIEW: Review = {
  customerName: '',
  rating: 5,
  date: '',
  purchase: '',
  title: '',
  content: '',
};

const StarPicker: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="transition-colors"
      >
        <Star
          className={`w-5 h-5 ${star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      </button>
    ))}
  </div>
);

const ReviewsManager: React.FC = () => {
  const cache = readCache();
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>({ ...(cache.productReviews || {}) });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const productsList = useMemo(() => {
    const prods = getAllProducts();
    prods.sort((a, b) => a.title.localeCompare(b.title));
    return prods;
  }, []);

  const selectedReviews: Review[] = selectedId ? (reviewsMap[selectedId] || []) : [];

  const updateReviews = (productId: string, reviews: Review[]) => {
    setReviewsMap((prev) => ({ ...prev, [productId]: reviews }));
  };

  const handleSave = () => {
    cache.productReviews = reviewsMap;
    writeCache(cache);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addReview = () => {
    if (!selectedId) return;
    updateReviews(selectedId, [...selectedReviews, { ...EMPTY_REVIEW }]);
  };

  const updateReviewField = (index: number, field: keyof Review, value: unknown) => {
    if (!selectedId) return;
    const updated = [...selectedReviews];
    updated[index] = { ...updated[index], [field]: value };
    updateReviews(selectedId, updated);
  };

  const removeReview = (index: number) => {
    if (!selectedId) return;
    updateReviews(selectedId, selectedReviews.filter((_, i) => i !== index));
  };

  const selectedProduct = selectedId ? productsList.find((p) => p.id === selectedId || p.id === `the-${selectedId}` || p.id === selectedId.replace(/^the-/, '')) : null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 max-h-[600px] overflow-auto">
              {productsList.map((p) => {
                const count = (reviewsMap[p.id] || []).length;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left p-3 hover:bg-gray-50 transition text-sm flex items-center gap-2 ${
                      selectedId === p.id ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    {p.heroImage && (
                      <img src={p.heroImage} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                    )}
                    <span className="truncate flex-1">{p.title}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2">
            {selectedProduct ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedProduct.heroImage && (
                      <img src={selectedProduct.heroImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{selectedProduct.title}</h3>
                      <p className="text-xs text-gray-500">{selectedReviews.length} review(s)</p>
                    </div>
                  </div>
                  <button
                    onClick={addReview}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Review
                  </button>
                </div>

                {selectedReviews.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-sm text-gray-500">No reviews yet. Click "Add Review" to create one.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedReviews.map((review, index) => (
                      <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Review {index + 1}</span>
                          <button
                            onClick={() => removeReview(index)}
                            className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-500">Rating</label>
                          <StarPicker
                            value={review.rating}
                            onChange={(v) => updateReviewField(index, 'rating', v)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <AdminFormField
                            label="Customer Name"
                            name={`rv-name-${index}`}
                            value={review.customerName}
                            onChange={(v) => updateReviewField(index, 'customerName', v)}
                            placeholder="John D."
                          />
                          <AdminFormField
                            label="Date"
                            name={`rv-date-${index}`}
                            value={review.date}
                            onChange={(v) => updateReviewField(index, 'date', v)}
                            placeholder="1 January 2026"
                          />
                        </div>

                        <AdminFormField
                          label="Purchased Item"
                          name={`rv-purchase-${index}`}
                          value={review.purchase}
                          onChange={(v) => updateReviewField(index, 'purchase', v)}
                          placeholder="V60 Grind, 250g"
                        />
                        <AdminFormField
                          label="Review Title"
                          name={`rv-title-${index}`}
                          value={review.title}
                          onChange={(v) => updateReviewField(index, 'title', v)}
                          placeholder="Great coffee!"
                        />
                        <AdminFormField
                          label="Review Content"
                          name={`rv-content-${index}`}
                          type="textarea"
                          value={review.content}
                          onChange={(v) => updateReviewField(index, 'content', v)}
                          placeholder="Write the review..."
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">Select a product to manage its reviews.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReviewsManager;
