// Ads look tokens — tuned to the warm-cream Meridian aesthetic. Shape/fit stays
// locked in src/lib/ad-slots.ts.

import type { AdSkin } from '@/lib/ads/ad-frame'

export const adSkin: AdSkin = {
  radius: '6px',
  border: '1px solid color-mix(in srgb, #181312 14%, transparent)',
  shadow: 'none',
  background: '#ffffff',
  labelClassName: 'bg-[#181312] text-[#f3ebe4]',
}

export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '6px', shadow: 'none', border: '1px solid color-mix(in srgb, #181312 16%, transparent)', background: '#ffffff' },
  header: { radius: '6px', background: '#ede2d3', border: '1px solid color-mix(in srgb, #181312 12%, transparent)' },
  footer: { radius: '6px', background: '#ffffff', border: '1px solid color-mix(in srgb, #181312 14%, transparent)' },
  feed: { radius: '6px', background: '#ffffff', border: '1px solid color-mix(in srgb, #181312 14%, transparent)' },
  rail: { radius: '6px' },
  feature: { radius: '6px' },
  popup: { radius: '10px' },
  interstitial: { radius: '10px', shadow: '0 20px 60px rgba(24,19,18,0.35)' },
  anchor: { radius: '6px', shadow: '0 6px 24px rgba(24,19,18,0.18)' },
}

export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
