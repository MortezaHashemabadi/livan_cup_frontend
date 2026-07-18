import React, { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ideas = [
  {
    id: 1,
    title: 'Pastel Waves',
    desc: 'Soft flowing waves in cream and blue tones',
    image: '/__generating__/img_efb063c68749.png',
    colors: ['#FFF8F0', '#DCEEFF', '#7BB6FF'],
  },
  {
    id: 2,
    title: 'Botanical Line Art',
    desc: 'Delicate hand-drawn leaves and stems',
    image: '/__generating__/img_d16a1f0afbda.png',
    colors: ['#E4F7EE', '#2D5016', '#C9A96E'],
  },
  {
    id: 3,
    title: 'Gold Minimalist',
    desc: 'Elegant gold stripes on pure white',
    image: '/__generating__/img_effb956c5592.png',
    colors: ['#FFFFFF', '#D4A574', '#1A2332'],
  },
  {
    id: 4,
    title: 'Cherry Blossom',
    desc: 'Japanese-inspired pink blossoms',
    image: '/__generating__/img_1bdeacfb946e.png',
    colors: ['#FFE4E6', '#F9A8D4', '#F5F0E8'],
  },
  {
    id: 5,
    title: 'Abstract Circles',
    desc: 'Playful overlapping circles in pastels',
    image: '/__generating__/img_7cf78638090e.png',
    colors: ['#FFE6D6', '#DCEEFF', '#E4F7EE'],
  },
  {
    id: 6,
    title: 'Vintage Coffee',
    desc: 'Retro typography with warm earth tones',
    image: '/__generating__/img_27b6af7813a1.png',
    colors: ['#C9A96E', '#F5F0E8', '#6B7280'],
  },
];

export default function AIDesignIdeas({ onSelectDesign }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-border/50 hover:border-border transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cobalt/10 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-cobalt" />
            </div>
            <div className="text-left">
              <h3 className="font-heading font-semibold">AI Design Ideas</h3>
              <p className="text-sm text-muted-foreground">Browse design inspiration for your cup</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {ideas.map((idea, i) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-border/50 p-4 hover:border-cobalt/20 hover:shadow-md transition-all duration-300 group"
            >
              <div className="rounded-xl bg-cream overflow-hidden aspect-[4/3] mb-3">
                <img
                  src={idea.image}
                  alt={idea.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h4 className="font-medium text-sm mb-1">{idea.title}</h4>
              <p className="text-xs text-muted-foreground mb-3">{idea.desc}</p>
              <div className="flex items-center gap-2 mb-4">
                {idea.colors.map((color, j) => (
                  <div key={j} className="w-5 h-5 rounded-full border border-border/30" style={{ backgroundColor: color }} />
                ))}
              </div>
              <Button
                onClick={() => onSelectDesign(idea)}
                variant="outline"
                className="w-full rounded-full text-xs h-9 gap-1.5 text-cobalt border-cobalt/30 hover:bg-cobalt/5"
              >
                <Sparkles className="w-3 h-3" />
                Apply Design
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
}