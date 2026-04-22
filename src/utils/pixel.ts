// ─── Meta Pixel Utility ───────────────────────────────────────────────────
// Single source of truth for the Pixel ID. To update, change ONLY this value.
export const FB_PIXEL_ID = '362509406825754';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

// Called on every client-side route change to fire a PageView event.
export const pixelPageView = () => {
  if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
    window.fbq('track', 'PageView');
  }
};

// General-purpose event tracker for custom conversion events.
export const pixelEvent = (name: string, options?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
    window.fbq('track', name, options);
  }
};
