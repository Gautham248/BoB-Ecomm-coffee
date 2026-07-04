import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField from '../../components/admin/AdminFormField';
import { readCache, updateCacheField } from '../../services/cacheService';
import type { MediaSlide, HeroSettings } from '../../types/admin';
import { Plus, Trash2, Save, ChevronDown, ChevronUp, Pencil } from 'lucide-react';

const EMPTY_SLIDE: MediaSlide = { type: 'video', url: '', mobileUrl: '', posterUrl: '' };

function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition rounded-xl"
      >
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

function KanbanCard({
  label,
  thumbnail,
  type = 'image',
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  children,
  isOpen,
}: {
  label: string;
  thumbnail?: string;
  type?: 'video' | 'image';
  onEdit: () => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  children?: React.ReactNode;
  isOpen: boolean;
}) {
  return (
    <div className={`bg-white rounded-xl border transition-shadow ${isOpen ? 'border-gray-400 shadow-md' : 'border-gray-200 hover:shadow-sm'}`}>
      <div
        className="aspect-video bg-gray-50 rounded-t-xl overflow-hidden cursor-pointer relative group"
        onClick={onEdit}
      >
        {thumbnail ? (
          type === 'video' ? (
            <video
              src={thumbnail}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <img src={thumbnail} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-xs">No preview</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onMoveUp && (
            <button
              onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
              disabled={isFirst}
              className="p-1 bg-white/90 rounded shadow-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 transition"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
              disabled={isLast}
              className="p-1 bg-white/90 rounded shadow-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 transition"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1 bg-white/90 rounded shadow-sm text-red-600 hover:text-red-800 transition"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600 truncate">{label}</span>
        <button onClick={onEdit} className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
          <Pencil className="w-3 h-3" />
        </button>
      </div>
      {isOpen && children && (
        <div className="px-3 pb-3 border-t border-gray-100 pt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

const HeroManager: React.FC = () => {
  const cache = readCache();
  const [settings, setSettings] = useState<HeroSettings>({ ...cache.heroSettings });
  const [saved, setSaved] = useState(false);
  const [expandedBanner, setExpandedBanner] = useState<number | null>(null);
  const [expandedSlide, setExpandedSlide] = useState<number | null>(null);

  const updateSlide = (index: number, field: keyof MediaSlide, value: string) => {
    setSettings((prev) => {
      const slides = [...prev.slides];
      slides[index] = { ...slides[index], [field]: value };
      return { ...prev, slides };
    });
  };

  const addSlide = () => {
    setSettings((prev) => ({ ...prev, slides: [...prev.slides, { ...EMPTY_SLIDE }] }));
    setExpandedSlide(settings.slides.length);
  };

  const removeSlide = (index: number) => {
    setSettings((prev) => ({ ...prev, slides: prev.slides.filter((_, i) => i !== index) }));
    setExpandedSlide(null);
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    setSettings((prev) => {
      const slides = [...prev.slides];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= slides.length) return prev;
      [slides[index], slides[newIndex]] = [slides[newIndex], slides[index]];
      return { ...prev, slides };
    });
    setExpandedSlide(null);
  };

  const moveBannerImage = (index: number, direction: -1 | 1) => {
    setSettings((prev) => {
      const images = [...(prev.shopBannerImages || [])];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= images.length) return prev;
      [images[index], images[newIndex]] = [images[newIndex], images[index]];
      return { ...prev, shopBannerImages: images };
    });
    setExpandedBanner(null);
  };

  const handleSave = () => {
    updateCacheField('heroSettings', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Media</h2>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <CollapsibleSection title="Auto-play Settings" subtitle="Hero carousel display duration">
          <AdminFormField
            label="Display Duration (ms)"
            name="duration"
            type="number"
            value={String(settings.imageDisplayDuration)}
            onChange={(v) => setSettings((s) => ({ ...s, imageDisplayDuration: Number(v) }))}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Shop Banner Images"
          subtitle={`${settings.shopBannerImages?.length || 0} image(s) — shown on the /store page`}
        >
          <div className="flex items-center justify-end mb-3">
            <button
              onClick={() => {
                setSettings((s) => ({ ...s, shopBannerImages: [...(s.shopBannerImages || []), ''] }));
                setExpandedBanner((settings.shopBannerImages || []).length);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm"
            >
              <Plus className="w-4 h-4" /> Add Image
            </button>
          </div>

          {(settings.shopBannerImages || []).length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No shop banner images yet. Click "Add Image" to add one.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(settings.shopBannerImages || []).map((url, index) => (
                <KanbanCard
                  key={index}
                  label={`Banner ${index + 1}`}
                  thumbnail={url}
                  isOpen={expandedBanner === index}
                  onEdit={() => setExpandedBanner(expandedBanner === index ? null : index)}
                  onRemove={() => {
                    setSettings((s) => ({ ...s, shopBannerImages: (s.shopBannerImages || []).filter((_, i) => i !== index) }));
                    setExpandedBanner(null);
                  }}
                  onMoveUp={() => moveBannerImage(index, -1)}
                  onMoveDown={() => moveBannerImage(index, 1)}
                  isFirst={index === 0}
                  isLast={index === (settings.shopBannerImages || []).length - 1}
                >
                  <AdminFormField
                    label="Image URL"
                    name={`banner-${index}`}
                    type="url"
                    value={url}
                    onChange={(v) => setSettings((s) => {
                      const images = [...(s.shopBannerImages || [])];
                      images[index] = v;
                      return { ...s, shopBannerImages: images };
                    })}
                    placeholder="https://ik.imagekit.io/..."
                  />
                  {url && (
                    <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden mt-2">
                      <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                </KanbanCard>
              ))}
            </div>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          title="Hero Slides"
          subtitle={`${settings.slides.length} slide(s) — shown on the homepage`}
        >
          <div className="flex items-center justify-end mb-3">
            <button
              onClick={addSlide}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm"
            >
              <Plus className="w-4 h-4" /> Add Slide
            </button>
          </div>

          {settings.slides.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No slides yet. Click "Add Slide" to create one.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {settings.slides.map((slide, index) => (
                <KanbanCard
                  key={index}
                  label={`Slide ${index + 1}` + (slide.type ? ` · ${slide.type}` : '')}
                  thumbnail={slide.url || slide.posterUrl}
                  type={slide.type}
                  isOpen={expandedSlide === index}
                  onEdit={() => setExpandedSlide(expandedSlide === index ? null : index)}
                  onRemove={() => removeSlide(index)}
                  onMoveUp={() => moveSlide(index, -1)}
                  onMoveDown={() => moveSlide(index, 1)}
                  isFirst={index === 0}
                  isLast={index === settings.slides.length - 1}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                      <select
                        value={slide.type}
                        onChange={(e) => updateSlide(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none"
                      >
                        <option value="video">Video</option>
                        <option value="image">Image</option>
                      </select>
                    </div>
                    <AdminFormField
                      label="Poster URL"
                      name={`poster-${index}`}
                      value={slide.posterUrl || ''}
                      onChange={(v) => updateSlide(index, 'posterUrl', v)}
                      placeholder="Optional poster image"
                    />
                  </div>
                  <AdminFormField
                    label="URL"
                    name={`url-${index}`}
                    type="url"
                    value={slide.url}
                    onChange={(v) => updateSlide(index, 'url', v)}
                    placeholder={slide.type === 'video' ? '/videos/hero.mp4' : 'https://ik.imagekit.io/...'}
                    required
                  />
                  <AdminFormField
                    label="Mobile URL"
                    name={`mobile-${index}`}
                    type="url"
                    value={slide.mobileUrl || ''}
                    onChange={(v) => updateSlide(index, 'mobileUrl', v)}
                    placeholder="Optional mobile-specific URL"
                  />
                  {slide.url && (
                    <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden mt-2">
                      {slide.type === 'video' ? (
                        <video src={slide.url} className="w-full h-full object-cover" muted controls preload="metadata" />
                      ) : (
                        <img src={slide.url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                    </div>
                  )}
                </KanbanCard>
              ))}
            </div>
          )}
        </CollapsibleSection>
      </div>
    </AdminLayout>
  );
};

export default HeroManager;
