import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const volumeScale = {
  '80cc': 0.7,
  '120cc': 0.85,
  '220cc': 1,
};

const materialStyles = {
  kraft: { bg: '#C9A96E', gradient: 'from-[#C9A96E] to-[#A6854A]', rim: '#D4B87A' },
  glossy: { bg: '#FFFFFF', gradient: 'from-white to-[#F0F0F0]', rim: '#FFFFFF' },
  matte: { bg: '#F5F5F5', gradient: 'from-[#F5F5F5] to-[#E8E8E8]', rim: '#F5F5F5' },
  recycled: { bg: '#E8DCC8', gradient: 'from-[#E8DCC8] to-[#D4C8A8]', rim: '#E8DCC8' },
  plastic_pet: { bg: 'rgba(255,255,255,0.6)', gradient: 'from-white/40 to-white/10', rim: 'rgba(255,255,255,0.7)' },
  plastic_pp: { bg: 'rgba(255,255,255,0.5)', gradient: 'from-white/30 to-white/10', rim: 'rgba(255,255,255,0.6)' },
};

const wallThickness = {
  single_wall: 1,
  double_wall: 1.4,
  triple_wall: 1.7,
};

const finishStyles = {
  smooth: { texture: 'none', pattern: 'none' },
  rippled: { texture: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)', pattern: 'rippled' },
  embossed: { texture: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 5px)', pattern: 'embossed' },
};

export default function CupPreview({ config, designColor, showAiBadge }) {
  const material = materialStyles[config.material] || materialStyles.glossy;
  const scale = volumeScale[config.volume] || 1;
  const finish = finishStyles[config.surface_type] || finishStyles.smooth;
  const isPlastic = config.material === 'plastic_pet' || config.material === 'plastic_pp';

  return (
    <div className="relative">
      <div className="rounded-[40px] bg-cream overflow-hidden aspect-[3/4] flex items-center justify-center relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {showAiBadge && (
          <Badge className="absolute top-6 left-6 bg-white/90 text-cobalt border-0 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm z-10">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Designed
          </Badge>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${config.volume}-${config.material}-${config.wall_type}-${config.surface_type}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative flex flex-col items-center"
          >
            {/* Cup body */}
            <div
              className="relative rounded-b-[40%] transition-all duration-500"
              style={{
                width: `${220 * scale}px`,
                height: `${320 * scale}px`,
                background: isPlastic
                  ? `linear-gradient(180deg, ${material.gradient})`
                  : material.bg,
                borderLeft: `${2 * wallThickness[config.wall_type] || 2}px solid ${isPlastic ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.12)'}`,
                borderRight: `${2 * wallThickness[config.wall_type] || 2}px solid ${isPlastic ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.08)'}`,
                borderBottom: `${3 * wallThickness[config.wall_type] || 3}px solid ${isPlastic ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'}`,
                boxShadow: isPlastic
                  ? 'inset 0 0 30px rgba(255,255,255,0.5), 0 20px 40px -15px rgba(0,0,0,0.1)'
                  : '0 20px 40px -15px rgba(0,0,0,0.15)',
              }}
            >
              {/* Design color overlay */}
              {designColor && !isPlastic && (
                <div
                  className="absolute inset-0 rounded-b-[40%] opacity-40"
                  style={{ backgroundColor: designColor }}
                />
              )}

              {/* Finish texture */}
              {finish.texture !== 'none' && (
                <div
                  className="absolute inset-0 rounded-b-[40%]"
                  style={{ background: finish.texture }}
                />
              )}

              {/* Rim highlight */}
              <div
                className="absolute top-1 left-2 right-2 h-1 rounded-full opacity-20"
                style={{ background: isPlastic ? 'white' : 'white' }}
              />
            </div>

            {/* Rim */}
            <div
              className="rounded-full -mt-1 relative z-10 transition-all duration-500"
              style={{
                width: `${215 * scale}px`,
                height: `${10 * scale}px`,
                background: material.rim,
                border: `${2 * wallThickness[config.wall_type] || 2}px solid ${isPlastic ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.1)'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}