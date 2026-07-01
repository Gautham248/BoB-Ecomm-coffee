import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFormField from '../../components/admin/AdminFormField';
import { readCache, updateCacheField } from '../../services/cacheService';
import type { MediaSlide, HeroSettings } from '../../types/admin';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';

const EMPTY_SLIDE: MediaSlide = { type: 'video', url: '', mobileUrl: '', posterUrl: '' };

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Hero Section</h2>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Auto-play Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AdminFormField
              label="Display Duration (ms)"
              name="duration"
              type="number"
              value={String(settings.imageDisplayDuration)}
              onChange={(v) => setSettings((s) => ({ ...s, imageDisplayDuration: Number(v) }))}
            />
            <AdminFormField
              label="Mobile Aspect"
              name="mobileAspect"
              value={settings.mobileAspectRatio}
              onChange={(v) => setSettings((s) => ({ ...s, mobileAspectRatio: v }))}
            />
            <AdminFormField
              label="Desktop Aspect"
              name="desktopAspect"
              value={settings.desktopAspectRatio}
              onChange={(v) => setSettings((s) => ({ ...s, desktopAspectRatio: v }))}
            />
            <AdminFormField
              label="Desktop Height"
              name="desktopHeight"
              value={settings.desktopHeight}
              onChange={(v) => setSettings((s) => ({ ...s, desktopHeight: v }))}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Slides ({settings.slides.length})
            </h3>
            <button
              onClick={addSlide}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm"
            >
              <Plus className="w-4 h-4" /> Add Slide
            </button>
          </div>

          {settings.slides.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No slides yet. Click "Add Slide" to create one.</p>
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
        </div>
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
          <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
          <select
            value={slide.type}
            onChange={(e) => onChange('type', e.target.value)}
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
          onChange={(v) => onChange('posterUrl', v)}
          placeholder="Optional poster image"
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
      />
      <AdminFormField
        label="Mobile URL"
        name={`mobile-${index}`}
        type="url"
        value={slide.mobileUrl || ''}
        onChange={(v) => onChange('mobileUrl', v)}
        placeholder="Optional mobile-specific URL"
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
