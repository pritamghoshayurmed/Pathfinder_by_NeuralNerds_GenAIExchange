/**
 * PREMIUM PORTFOLIO TEMPLATES - Master Index
 * Exports all 5 ultra-premium portfolio templates
 */

export { generatePremiumLuxuryMinimal } from './premiumTemplate1LuxuryMinimal';
export { generatePremiumGlassmorphism } from './premiumTemplate2Glassmorphism';
export { generatePremiumNeonCyberpunk } from './premiumTemplate3NeonCyberpunk';
export { generatePremiumElegantGradient } from './premiumTemplate4ElegantGradient';
export { generatePremiumNeumorphicPro } from './premiumTemplate5NeumorphicPro';

export const PREMIUM_TEMPLATE_CATALOG = [
  {
    id: 'premium-luxury-minimal',
    name: 'Luxury Minimal',
    description: 'Ultra-modern sleek dark theme with premium gradients and glass effects',
    category: 'Minimal',
    bestFor: ['Tech Professionals', 'Startups', 'Developers'],
    features: ['Dark theme', 'Premium animations', 'Glass effects', 'Smooth transitions'],
    accent: '#00ff88'
  },
  {
    id: 'premium-glassmorphism',
    name: 'Glassmorphism Chic',
    description: 'Modern glassmorphism design with blur effects and premium animations',
    category: 'Modern',
    bestFor: ['Designers', 'Creatives', 'Modern Professionals'],
    features: ['Glassmorphism', 'Blur effects', 'Premium gradients', 'Smooth animations'],
    accent: '#ff00ff'
  },
  {
    id: 'premium-neon-cyberpunk',
    name: 'Neon Cyberpunk',
    description: 'Bold neon colors with cyberpunk aesthetic and futuristic feel',
    category: 'Bold',
    bestFor: ['Tech Innovators', 'Gamers', 'Bold Professionals'],
    features: ['Neon colors', 'Cyberpunk style', 'Glitch effects', 'Retro-futuristic'],
    accent: '#00ffff'
  },
  {
    id: 'premium-elegant-gradient',
    name: 'Elegant Gradient',
    description: 'Sophisticated gradient-based design with smooth transitions and depth',
    category: 'Elegant',
    bestFor: ['Executives', 'Consultants', 'Premium Professionals'],
    features: ['Gradient backgrounds', 'Elegant design', 'Smooth transitions', 'Professional'],
    accent: '#6366f1'
  },
  {
    id: 'premium-neumorphic-pro',
    name: 'Neumorphic Pro',
    description: 'Soft neumorphism with depth, shadows, and premium light theme',
    category: 'Neumorphic',
    bestFor: ['Minimalists', 'Modern Thinkers', 'Professionals'],
    features: ['Neumorphic design', 'Soft shadows', 'Depth effects', 'Light theme'],
    accent: '#10b981'
  }
];
