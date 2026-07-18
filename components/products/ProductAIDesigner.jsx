const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, RefreshCw, Wand2, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const stylePresets = [
  { id: 'minimal_cafe',        name: 'Minimal Café',        prompt: 'Clean minimalist design with soft neutral tones, thin line art, and modern typography. Scandinavian aesthetic.' },
  { id: 'modern_geometric',    name: 'Modern Geometric',    prompt: 'Bold geometric patterns with overlapping shapes in pastel colors. Contemporary abstract art style.' },
  { id: 'vintage_coffee',      name: 'Vintage Coffee',      prompt: 'Retro coffee shop branding with ornamental borders, vintage typography, and warm brown tones.' },
  { id: 'luxury_gold',         name: 'Luxury Gold',         prompt: 'Premium luxury design with gold foil accents, deep navy background, and elegant serif typography.' },
  { id: 'japanese_minimal',    name: 'Japanese Minimal',    prompt: 'Wabi-sabi inspired design with delicate cherry blossoms, soft ink wash, and serene natural elements.' },
  { id: 'botanical',           name: 'Botanical',           prompt: 'Hand-drawn botanical illustrations with leaves, flowers, and natural elements in pale green tones.' },
];

export default function ProductAIDesigner({ onDesignGenerated, generatedImage }) {
  const [prompt, setPrompt]               = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isGenerating, setIsGenerating]   = useState(false);

  const generate = useCallback(async (overridePrompt) => {
    const text = overridePrompt || prompt;
    if (!text.trim()) { toast.error('Please describe your design'); return; }
    setIsGenerating(true);
    const full = `Design for a paper coffee cup: ${text}. Wrap-around pattern for a cylindrical cup. Premium studio photography, soft lighting, cream background, no people.`;
    const result = await db.integrations.Core.GenerateImage({ prompt: full });
    onDesignGenerated(result.url);
    setIsGenerating(false);
  }, [prompt, onDesignGenerated]);

  const handlePreset = (preset) => {
    setSelectedPreset(preset.id);
    setPrompt(preset.prompt);
  };

  return (
    <div className="space-y-5">
      {/* Style presets */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Style Presets</p>
        <div className="flex flex-wrap gap-2">
          {stylePresets.map(p => (
            <button
              key={p.id}
              onClick={() => handlePreset(p)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedPreset === p.id
                  ? 'bg-cobalt text-white'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
              }`}
            >
              {selectedPreset === p.id && <Check className="w-3 h-3" />}
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Custom Prompt</p>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your design vision…"
          className="min-h-[80px] rounded-2xl text-sm resize-none border-border/60 focus-visible:ring-cobalt bg-secondary/40"
        />
      </div>

      {/* Generate button */}
      <div className="flex gap-2">
        <Button
          onClick={() => generate()}
          disabled={isGenerating || !prompt.trim()}
          className="flex-1 bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-11 font-medium shadow-none"
        >
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating…</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" />Generate Design</>
          )}
        </Button>
        {generatedImage && (
          <Button
            onClick={() => generate(prompt + ' — new variation, different composition')}
            disabled={isGenerating}
            variant="outline"
            className="rounded-full h-11 px-4"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Preview */}
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-2xl bg-secondary/40 aspect-square flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-cobalt animate-spin" />
            <p className="text-sm text-muted-foreground">Creating your design…</p>
          </motion.div>
        ) : generatedImage ? (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden border border-border/50 aspect-square bg-cream">
            <img src={generatedImage} alt="AI generated design" className="w-full h-full object-contain" />
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl bg-secondary/30 aspect-square flex flex-col items-center justify-center gap-2">
            <Wand2 className="w-8 h-8 text-muted-foreground/25" />
            <p className="text-xs text-muted-foreground/50 text-center px-8">Select a preset or enter a prompt to generate your design</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}