import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ENHANCED_PORTFOLIO_TEMPLATES,
  getTemplateCategories,
  getTemplatesByCategory,
} from '@/services/enhancedPortfolioTemplates';
import { PortfolioData } from '@/types/portfolio';

interface TemplatePreviewProps {
  onSelectTemplate: (templateId: string) => void;
  currentTemplate?: string;
  portfolioData?: PortfolioData;
}

export const AnimatedTemplateSelector: React.FC<TemplatePreviewProps> = ({
  onSelectTemplate,
  currentTemplate,
  portfolioData,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = getTemplateCategories();
  const templates = selectedCategory
    ? getTemplatesByCategory(selectedCategory)
    : ENHANCED_PORTFOLIO_TEMPLATES;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const categoryVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.97 },
  } as const;

  const badgeVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="text-4xl font-bold text-slate-900 mb-2">Choose Your Style</h2>
        <p className="text-lg text-slate-600">
          5 professional templates, each uniquely crafted for different professional personas
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <p className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
            Filter by Category
          </p>
        </motion.div>
        <motion.div
          className="flex flex-wrap gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            key="all"
            variants={categoryVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-400'
            }`}
          >
            All Templates
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              variants={categoryVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-400'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Templates Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              whileTap="tap"
              onClick={() => onSelectTemplate(template.id)}
              className={`rounded-xl p-6 cursor-pointer transition-all border-2 ${
                currentTemplate === template.id
                  ? 'border-indigo-600 bg-indigo-50 shadow-lg ring-2 ring-indigo-200'
                  : 'border-slate-200 bg-white hover:border-indigo-400'
              }`}
            >
              {/* Selected Badge */}
              {currentTemplate === template.id && (
                <motion.div
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full"
                >
                  <span>✓</span>
                  <span>Selected</span>
                </motion.div>
              )}

              {/* Template Header */}
              <div className="mb-4">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-bold text-slate-900 mb-1"
                >
                  {template.name}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-sm text-slate-600 mb-3"
                >
                  {template.description}
                </motion.p>
              </div>

              {/* Color Scheme Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 inline-block"
              >
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                  {template.colorScheme}
                </span>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mb-4"
              >
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Key Features
                </p>
                <motion.ul
                  className="space-y-1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <motion.li
                      key={idx}
                      variants={badgeVariants}
                      className="text-xs text-slate-600 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {feature}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              {/* Best For */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Best For
                </p>
                <motion.div
                  className="flex flex-wrap gap-1.5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {template.bestFor.map((persona, idx) => (
                    <motion.span
                      key={idx}
                      variants={badgeVariants}
                      className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded"
                    >
                      {persona}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-6 w-full py-2.5 px-4 rounded-lg font-semibold transition-all ${
                  currentTemplate === template.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {currentTemplate === template.id ? 'Using This Template' : 'Use Template'}
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 p-6 bg-white rounded-lg border border-slate-200"
      >
        <h4 className="font-bold text-slate-900 mb-2">💡 Pro Tip</h4>
        <p className="text-slate-600 text-sm">
          All templates include smooth animations, responsive design, and professional styling. 
          Choose the template that best matches your professional identity, then customize the colors and content 
          to make it uniquely yours.
        </p>
      </motion.div>
    </div>
  );
};

export default AnimatedTemplateSelector;
