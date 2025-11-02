import React from 'react';
import { ArrowDown } from 'lucide-react';
import { motion } from "framer-motion";

interface FlowchartStep {
  name: string;
  description: string;
}

interface FlowchartDisplayProps {
  title: string;
  steps: FlowchartStep[];
}

const FlowchartDisplay: React.FC<FlowchartDisplayProps> = ({ title, steps }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">{title}</h2>
      <div className="flex flex-col items-center space-y-12">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="relative w-full max-w-lg p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg shadow-lg border border-primary/20"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-primary">{step.name}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 + 0.2, duration: 0.4 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
              >
                <ArrowDown className="w-8 h-8 text-primary" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FlowchartDisplay;