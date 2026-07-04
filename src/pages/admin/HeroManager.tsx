import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField from '../../components/admin/AdminFormField';
import { readCache, updateCacheField } from '../../services/cacheService';
import type { MediaSlide, HeroSettings } from '../../types/admin';
import { Plus, Trash2, GripVertical, Save, ChevronDown, ChevronUp } from 'lucide-react';
import InfoTooltip from '../../components/admin/InfoTooltip';

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

const HeroManager: React.FC = () => {
  const cache = readCache();
  const [settings, setSettings] = useState<HeroSettings>({ ...cache.heroSettings });
  const [saved, setSaved] = useState(false);

  const updateSlide = (index: number, field: keyof MediaSlide, value: string) => {
    setSettings((prev) => {
      const slides = [...prev.slides];
      slides[index] = { ...slides[index], [field]: value };
      return { ...prev, slides };
    });
  };

  const addSlide = () => {
    setSettings((prev) => ({ ...prev, slides: [...prev.slides, { ...EMPTY_SLIDE }] }));
  };

  const removeSlide = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index),
    }));
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    setSettings((prev) => {
      const slides = [...prev.slides];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= slides.length) return prev;
      [slides[index], slides[newIndex]] = [slides[newIndex], slides[index]];
      return { ...prev, slides };
    });
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

        <CollapsibleSection
          title="Auto-play Settings"
          subtitle="Hero carousel display duration"
        >
          <AdminFormField
            label="Display Duration (ms)"
            name="duration"
            type="number"
            value={String(settings.imageDisplayDuration)}
            onChange={(v) => setSettings((s) => ({ ...s, imageDisplayDuration: Number(v) }))}
            tooltip="Duration in milliseconds before the homepage hero carousel auto-scrolls to the next slide (e.g. 5000)."
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Shop Banner Images"
          subtitle={`${settings.shopBannerImages?.length || 0} image(s) — shown on the /store page`}
        >
          <div className="flex items-center justify-end mb-3">
            <button
              onClick={() => setSettings((s) => ({ ...s, shopBannerImages: [...(s.shopBannerImages || []), ''] }))}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm"
            >
              <Plus className="w-4 h-4" /> Add Image
            </button>
          </div>

          {(settings.shopBannerImages || []).length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No shop banner images yet. Click "Add Image" to add one.</p>
          ) : (
            <div className="space-y-4">
              {(settings.shopBannerImages || []).map((url, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Image {index + 1}</span>
                    <button
                      onClick={() => setSettings((s) => ({
                        ...s,
                        shopBannerImages: (s.shopBannerImages || []).filter((_, i) => i !== index),
                      }))}
                      className="ml-auto px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
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
                    tooltip="URL of the banner image displayed at the top of the /store page."
                  />
                  {url && (
                    <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden max-w-sm">
                      <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
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
            <div className="space-y-4">
              {settings.slides.map((slide, index) => (
                <SlideEditor
                  key={index}
                  slide={slide}
                  index={index}
                  total={settings.slides.length}
                  onChange={(field, value) => updateSlide(index, field, value)}
                  onRemove={() => removeSlide(index)}
                  onMove={(dir) => moveSlide(index, dir)}
                />
              ))}
            </div>
          )}
        </CollapsibleSection>
      </div>
    </AdminLayout>
  );
};

function SlideEditor({
  slide,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  slide: MediaSlide;
  index: number;
  total: number;
  onChange: (field: keyof MediaSlide, value: string) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-600">Slide {index + 1}</span>
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="px-2 py-1 text-xs bg-gray-50 rounded hover:bg-gray-100 disabled:opacity-30 transition"
          >
            ↑
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="px-2 py-1 text-xs bg-gray-50 rounded hover:bg-gray-100 disabled:opacity-30 transition"
          >
            ↓
          </button>
          <button
            onClick={onRemove}
            className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
            <span>Type</span>
            <InfoTooltip content="Choose whether this slide displays a video background or a static image." />
          </label>
          <select
            value={slide.type}
            onChange={(e) => onChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none animate-fade-in-up"
          >
            <option value="video">Video</option>
            <option value="image">Image</option>
          </select>
        </div>
        <AdminFormField
          label="Poster URL"
          name={`poster-${index}`}
          value={slide.posterUrl || ''}
          onChange={(v) => onChange('posterUrl', v)}
          placeholder="Optional poster image"
          tooltip="URL of the cover/poster image displayed while the video is loading or buffer state."
        />
      </div>
      <AdminFormField
        label="URL"
        name={`url-${index}`}
        type="url"
        value={slide.url}
        onChange={(v) => onChange('url', v)}
        placeholder={slide.type === 'video' ? '/videos/hero.mp4' : 'https://ik.imagekit.io/...'}
        required
        tooltip="Desktop media resource URL (either MP4 video or JPG/PNG image)."
      />
      <AdminFormField
        label="Mobile URL"
        name={`mobile-${index}`}
        type="url"
        value={slide.mobileUrl || ''}
        onChange={(v) => onChange('mobileUrl', v)}
        placeholder="Optional mobile-specific URL"
        tooltip="Optional mobile-optimized media URL (vertical format, lower file size)."
      />
      {slide.url && (
        <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden max-w-sm">
          {slide.type === 'video' ? (
            <video src={slide.url} className="w-full h-full object-cover" muted controls preload="metadata" />
          ) : (
            <img src={slide.url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
        </div>
      )}
    </div>
  );
}

export default HeroManager;
