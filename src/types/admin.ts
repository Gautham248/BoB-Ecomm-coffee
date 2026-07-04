import type { Product, Collection, Review } from './product';

export interface MediaSlide {
  type: 'video' | 'image';
  url: string;
  mobileUrl?: string;
  headline?: string;
  text?: string;
  posterUrl?: string;
}

export interface HeroSettings {
  slides: MediaSlide[];
  shopBannerImages: string[];
  imageDisplayDuration: number;
  showDots: boolean;
  showArrows: boolean;
  dotIndicatorBottom: { mobile: number; desktop: number };
  dotIndicatorOpacity: number;
  dotSize: { mobile: number; desktop: number };
  dotActiveWidth: { mobile: number; desktop: number };
  mobileAspectRatio: string;
  desktopAspectRatio: string;
  desktopHeight: string;
  mobileObjectFit: 'cover' | 'contain' | 'fill';
  desktopObjectFit: 'cover' | 'contain' | 'fill';
}

export interface FeaturedProductEntry {
  productId: string;
  displayTitle?: string;
  displayImage?: string;
}

export interface AdminCache {
  version: number;
  lastSynced: string;
  heroSettings: HeroSettings;
  collections: Collection[];
  productMetadata: Record<string, Partial<Product>>;
  productReviews: Record<string, Review[]>;
  featuredProducts: FeaturedProductEntry[];
  headerProducts: string[];
  movementProducts: Product[];
  categoryLabels: Record<string, string>;
}
