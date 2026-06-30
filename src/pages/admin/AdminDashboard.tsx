import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { readCache } from '../../services/cacheService';
import { Coffee, Image, Layers, Star, Package, Bike } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const cache = readCache();

  const stats = [
    { label: 'Hero Slides', value: cache.heroSettings.slides.length, icon: Image, color: 'text-copper' },
    { label: 'Collections', value: cache.collections.length, icon: Layers, color: 'text-amber-DEFAULT' },
    { label: 'Featured', value: cache.featuredProducts.length, icon: Star, color: 'text-copper-light' },
    { label: 'Movement', value: cache.movementProducts.length, icon: Bike, color: 'text-sage-DEFAULT' },
  ];

  const activeCollections = cache.collections.filter((c) => !c.upcoming);
  const upcomingCollections = cache.collections.filter((c) => c.upcoming);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="animate-fade-in-up">
          <h2 className="text-xl font-pangaia font-semibold text-roast-cream tracking-wide">Dashboard</h2>
          <p className="text-sm text-roast-muted mt-1">Welcome to the roastery workshop</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="animate-fade-in-up bg-roast-surface border border-roast-border rounded-xl p-4 hover:border-copper/20 transition-all duration-300 group"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg bg-roast-card flex items-center justify-center border border-roast-border group-hover:border-copper/20 transition-colors duration-300`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-roast-cream tracking-tight">{s.value}</p>
              <p className="text-xs text-roast-muted mt-0.5 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-fade-in-up stagger-2 bg-roast-surface border border-roast-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-copper" />
              <h3 className="text-sm font-semibold text-roast-cream tracking-wide uppercase">Active Collections</h3>
            </div>
            {activeCollections.length === 0 ? (
              <p className="text-sm text-roast-muted">No active collections</p>
            ) : (
              <div className="space-y-2">
                {activeCollections.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-roast-card border border-roast-border/50 hover:border-copper/20 transition-all duration-200"
                    style={{ animationDelay: `${0.1 + i * 0.04}s` }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {c.image ? (
                        <img src={c.image} alt={c.name} className="w-9 h-9 rounded-lg object-cover border border-roast-border shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-roast-hover flex items-center justify-center shrink-0">
                          <Coffee className="w-4 h-4 text-roast-muted" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-roast-cream truncate">{c.name}</p>
                        <p className="text-[11px] text-roast-muted">{c.products.length} products</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sage-DEFAULT/15 text-sage-DEFAULT border border-sage-DEFAULT/20 shrink-0 ml-2">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="animate-fade-in-up stagger-3 bg-roast-surface border border-roast-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-4 h-4 text-amber-DEFAULT" />
              <h3 className="text-sm font-semibold text-roast-cream tracking-wide uppercase">Coming Soon</h3>
            </div>
            {upcomingCollections.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-roast-muted">Nothing in the pipeline</p>
                <p className="text-[11px] text-roast-muted/60 mt-1">Add upcoming collections from the Collections tab</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingCollections.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-roast-card border border-roast-border/50"
                    style={{ animationDelay: `${0.1 + i * 0.04}s` }}
                  >
                    <p className="text-sm font-medium text-roast-cream">{c.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-DEFAULT/15 text-amber-DEFAULT border border-amber-DEFAULT/20">
                      Coming Soon
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="animate-fade-in-up stagger-4 bg-roast-surface border border-roast-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-4 h-4 text-sage-DEFAULT" />
            <h3 className="text-sm font-semibold text-roast-cream tracking-wide uppercase">Hero Configuration</h3>
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
    <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-roast-card border border-roast-border/30">
      <span className="text-[11px] text-roast-muted uppercase tracking-wider">{label}</span>
      <span className="text-xs font-mono text-roast-cream">{value}</span>
    </div>
  );
}

export default AdminDashboard;
