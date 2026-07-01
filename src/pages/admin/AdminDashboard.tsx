import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { readCache } from '../../services/cacheService';
import { Coffee, Image, Layers, Star, Package, Bike } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const cache = readCache();

  const stats = [
    { label: 'Hero Slides', value: cache.heroSettings.slides.length, icon: Image, color: 'text-gray-600' },
    { label: 'Collections', value: cache.collections.length, icon: Layers, color: 'text-gray-600' },
    { label: 'Featured', value: cache.featuredProducts.length, icon: Star, color: 'text-gray-500' },
    { label: 'Movement', value: cache.movementProducts.length, icon: Bike, color: 'text-gray-500' },
  ];

  const activeCollections = cache.collections.filter((c) => !c.upcoming);
  const upcomingCollections = cache.collections.filter((c) => c.upcoming);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="animate-fade-in-up">
          <h2 className="text-xl font-pangaia font-semibold text-gray-900 tracking-wide">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome to the roastery workshop</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="animate-fade-in-up bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all duration-300 group"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:border-gray-300 transition-colors duration-300`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-fade-in-up stagger-2 bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">Active Collections</h3>
            </div>
            {activeCollections.length === 0 ? (
              <p className="text-sm text-gray-500">No active collections</p>
            ) : (
              <div className="space-y-2">
                {activeCollections.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-300 transition-all duration-200"
                    style={{ animationDelay: `${0.1 + i * 0.04}s` }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {c.image ? (
                        <img src={c.image} alt={c.name} className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <Coffee className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                        <p className="text-[11px] text-gray-500">{c.products.length} products</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 shrink-0 ml-2">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="animate-fade-in-up stagger-3 bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">Coming Soon</h3>
            </div>
            {upcomingCollections.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">Nothing in the pipeline</p>
                <p className="text-[11px] text-gray-400 mt-1">Add upcoming collections from the Collections tab</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingCollections.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50 border border-gray-100"
                    style={{ animationDelay: `${0.1 + i * 0.04}s` }}
                  >
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      Coming Soon
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="animate-fade-in-up stagger-4 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">Hero Configuration</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <DetailRow label="Slides" value={String(cache.heroSettings.slides.length)} />
            <DetailRow label="Duration" value={`${cache.heroSettings.imageDisplayDuration / 1000}s`} />
            <DetailRow label="Arrows" value={cache.heroSettings.showArrows ? 'On' : 'Off'} />
            <DetailRow label="Dots" value={cache.heroSettings.showDots ? 'On' : 'Off'} />
            <DetailRow label="Mobile Ratio" value={cache.heroSettings.mobileAspectRatio} />
            <DetailRow label="Desktop Ratio" value={cache.heroSettings.desktopAspectRatio} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-gray-50 border border-gray-100">
      <span className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</span>
      <span className="text-xs font-mono text-gray-900">{value}</span>
    </div>
  );
}

export default AdminDashboard;
