import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREMIUM_TEMPLATE_CATALOG } from '@/services/premiumPortfolioIndex';

interface PremiumTemplateSelectProps {
  onSelect: (templateId: string) => void;
  selectedId?: string;
}

export const PremiumTemplateSelector: React.FC<PremiumTemplateSelectProps> = ({
  onSelect,
  selectedId = 'premium-luxury-minimal'
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const getAccentColor = (template: any) => {
    const colorMap: Record<string, string> = {
      'premium-luxury-minimal': 'from-green-500 to-emerald-500',
      'premium-glassmorphism': 'from-pink-500 to-purple-500',
      'premium-neon-cyberpunk': 'from-cyan-500 to-blue-500',
      'premium-elegant-gradient': 'from-indigo-500 to-purple-500',
      'premium-neumorphic-pro': 'from-emerald-500 to-teal-500'
    };
    return colorMap[template.id] || 'from-blue-500 to-purple-500';
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-800">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Premium Portfolio Templates</h2>
        <p className="text-slate-400">Select a stunning, professionally designed template for your portfolio</p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {PREMIUM_TEMPLATE_CATALOG.map((template) => (
          <motion.div
            key={template.id}
            variants={itemVariants}
            onMouseEnter={() => setHoveredId(template.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelect(template.id)}
            className="cursor-pointer group"
          >
            <div
              className={`relative h-64 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                selectedId === template.id
                  ? 'border-white shadow-2xl shadow-blue-500/50'
                  : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              {/* Template Preview Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getAccentColor(template)} opacity-10`}
              />

              {/* Preview Content */}
              <div className="relative h-full p-4 flex flex-col justify-between overflow-hidden">
                {/* Header Preview */}
                <div className="space-y-2">
                  <div
                    className={`h-2 w-16 rounded-full bg-gradient-to-r ${getAccentColor(template)}`}
                  />
                  <div className="space-y-1">
                    <div className="h-3 w-24 bg-slate-700 rounded opacity-60" />
                    <div className="h-2 w-20 bg-slate-700 rounded opacity-40" />
                  </div>
                </div>

                {/* Middle Content */}
                <div className="space-y-2">
                  <div className="h-2 w-full bg-slate-700 rounded opacity-40" />
                  <div className="h-2 w-5/6 bg-slate-700 rounded opacity-40" />
                </div>

                {/* Selection Indicator */}
                {selectedId === template.id && (
                  <motion.div
                    layoutId="selectedBorder"
                    className="absolute inset-0 pointer-events-none"
                    initial={false}
                    transition={{
                      duration: 0.3,
                      ease: 'easeInOut'
                    }}
                  >
                    <div className="absolute inset-0 border-2 border-white rounded-xl" />
                  </motion.div>
                )}

                {/* Hover Overlay */}
                <AnimatePresence>
                  {hoveredId === template.id && (
                    <motion.div
                      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${getAccentColor(template)} flex items-center justify-center`}
                      >
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Template Info */}
            <div className="mt-4">
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                {template.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 group-hover:text-slate-400 transition-colors">
                {template.description}
              </p>

              {/* Features */}
              <div className="mt-3 flex flex-wrap gap-1">
                {template.features.slice(0, 2).map((feature) => (
                  <span
                    key={feature}
                    className="inline-block px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded-md"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Best For */}
              <div className="mt-3 border-t border-slate-800 pt-2">
                <p className="text-xs text-slate-500">Best for:</p>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {template.bestFor.join(', ')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Selected Template Details */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            className="mt-8 p-6 rounded-xl bg-slate-800/50 border border-slate-700"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-lg bg-gradient-to-br ${getAccentColor(
                  PREMIUM_TEMPLATE_CATALOG.find((t) => t.id === selectedId)!
                )} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-2xl">✨</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">
                  {PREMIUM_TEMPLATE_CATALOG.find((t) => t.id === selectedId)?.name}
                </h4>
                <p className="text-slate-400 mt-1 text-sm">
                  {PREMIUM_TEMPLATE_CATALOG.find((t) => t.id === selectedId)?.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PREMIUM_TEMPLATE_CATALOG.find((t) => t.id === selectedId)?.features.map(
                    (feature) => (
                      <span key={feature} className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                        {feature}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumTemplateSelector;
