import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Upload, Palette, Type, Square, Circle, Triangle, Move } from 'lucide-react';
import { motion } from 'framer-motion';

const bgColors = [
  '#FFFFFF', '#FFF8F0', '#DCEEFF', '#FFE6D6', '#E4F7EE',
  '#F5F0E8', '#1A2332', '#C9A96E', '#D4A574', '#F9A8D4',
];

const aiSuggestions = [
  {
    id: 'minimal_coffee',
    name: 'Minimal Coffee',
    desc: 'Clean monochrome with subtle coffee bean motif',
    prompt: 'minimalist with fine coffee bean line art',
    preview: 'bg-foreground',
    textColor: 'text-background',
  },
  {
    id: 'scandinavian_cafe',
    name: 'Scandinavian Café',
    desc: 'Airy pastels with organic shapes',
    prompt: 'Scandinavian organic shapes in pastel blue and cream',
    preview: 'bg-soft-blue',
    textColor: 'text-foreground',
  },
  {
    id: 'organic_kraft',
    name: 'Organic Kraft',
    desc: 'Natural tones with botanical illustrations',
    prompt: 'hand-drawn botanicals on kraft paper',
    preview: 'bg-[#C9A96E]',
    textColor: 'text-white',
  },
  {
    id: 'modern_geometric',
    name: 'Modern Geometric',
    desc: 'Bold shapes with contrasting colors',
    prompt: 'overlapping circles and lines in peach and coral',
    preview: 'bg-soft-peach',
    textColor: 'text-foreground',
  },
  {
    id: 'luxury_branding',
    name: 'Luxury Branding',
    desc: 'Gold accents on dark background',
    prompt: 'gold foil lines on deep navy',
    preview: 'bg-foreground',
    textColor: 'text-background',
  },
];

const shapeOptions = [
  { icon: Square, label: 'Square', value: 'square' },
  { icon: Circle, label: 'Circle', value: 'circle' },
  { icon: Triangle, label: 'Triangle', value: 'triangle' },
];

export default function DesignTabs({ designConfig, onDesignChange }) {
  const [activeTab, setActiveTab] = useState('ai');

  const handleColorSelect = (color) => {
    onDesignChange({ ...designConfig, bgColor: color, mode: 'manual' });
  };

  const handleAiSuggestion = (suggestion) => {
    onDesignChange({
      ...designConfig,
      aiSuggestion: suggestion.id,
      aiPrompt: suggestion.prompt,
      mode: 'ai',
    });
  };

  const handleTextChange = (value) => {
    onDesignChange({ ...designConfig, text: value, mode: 'manual' });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted w-full">
          <TabsTrigger value="ai" className="flex-1 gap-2">
            <Sparkles className="w-4 h-4" />
            AI Design
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex-1 gap-2">
            <Palette className="w-4 h-4" />
            Manual Design
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="mt-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select a design concept to apply to your cup</p>

            <div className="space-y-3">
              {aiSuggestions.map((suggestion, i) => (
                <motion.button
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleAiSuggestion(suggestion)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 ${
                    designConfig.aiSuggestion === suggestion.id
                      ? 'bg-cobalt/10 border border-cobalt/30'
                      : 'bg-secondary hover:bg-secondary/80 border border-transparent'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl ${suggestion.preview} flex items-center justify-center flex-shrink-0`}>
                    <Sparkles className={`w-5 h-5 ${suggestion.textColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{suggestion.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{suggestion.desc}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      designConfig.aiSuggestion === suggestion.id
                        ? 'bg-cobalt text-white'
                        : 'bg-background text-muted-foreground'
                    }`}>
                      {designConfig.aiSuggestion === suggestion.id ? 'Applied' : 'Apply'}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="mt-6">
          <div className="space-y-6">
            {/* Background Color */}
            <div>
              <label className="text-sm font-medium mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Background Color
              </label>
              <div className="flex flex-wrap gap-2.5">
                {bgColors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 ${
                      designConfig.bgColor === color
                        ? 'border-foreground scale-110 shadow-md'
                        : 'border-border/50 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            {/* Text Overlay */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Text Overlay
              </label>
              <Input
                value={designConfig.text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Your brand name or message..."
                className="rounded-xl h-12"
              />
            </div>

            {/* Shapes */}
            <div>
              <label className="text-sm font-medium mb-3 flex items-center gap-2">
                <Move className="w-4 h-4" />
                Add Shape
              </label>
              <div className="flex gap-2">
                {shapeOptions.map(shape => (
                  <button
                    key={shape.value}
                    onClick={() => onDesignChange({ ...designConfig, shape: designConfig.shape === shape.value ? null : shape.value })}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      designConfig.shape === shape.value
                        ? 'bg-foreground text-background'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <shape.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Logo */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Logo
              </label>
              <div className="border-2 border-dashed border-border/60 rounded-2xl p-6 text-center hover:border-cobalt/30 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Drag & drop or click to upload</p>
                <p className="text-xs text-muted-foreground/50">PNG, SVG, or PDF</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}