const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles, ShoppingBag, ArrowLeft, Plus, Minus,
  Loader2, RefreshCw, Check, Info, ChevronDown, ChevronUp,
  Upload, X, ImageIcon
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import BulkPricingCalculator, { getDiscountedPrice } from '@/components/products/BulkPricingCalculator';

// ── Config data ──────────────────────────────────────────────────────────────
const volumeOptions = [
  { value: '80cc',  label: '80cc',  hint: 'Espresso' },
  { value: '120cc', label: '120cc', hint: 'Cortado' },
  { value: '220cc', label: '220cc', hint: 'Latte / Cap' },
  { value: '330cc', label: '330cc', hint: 'Large' },
  { value: '400cc', label: '400cc', hint: 'XL' },
];
const materialOptions = [
  { value: 'kraft',    label: 'Kraft' },
  { value: 'glossy',  label: 'Glossy' },
  { value: 'matte',   label: 'Matte' },
  { value: 'recycled',label: 'Recycled' },
];
const wallOptions = [
  { value: 'single_wall', label: 'Single' },
  { value: 'double_wall', label: 'Double' },
  { value: 'triple_wall', label: 'Triple' },
];
const finishOptions = [
  { value: 'smooth',   label: 'Smooth' },
  { value: 'rippled',  label: 'Corrugated' },
  { value: 'embossed', label: 'Embossed' },
];

// Per-config preview images keyed by "material_walltype"
const configPreviewImages = {
  kraft_single_wall:   null,
  glossy_single_wall:  null,
  glossy_double_wall:  null,
  matte_single_wall:   null,
  matte_double_wall:   null,
  recycled_single_wall: null,
};

// ── AI style presets ──────────────────────────────────────────────────────────
const stylePresets = [
  { id: 'minimal_cafe',     name: 'Minimal Café',  prompt: 'Clean minimalist design with soft neutral tones, thin line art, and modern typography. Scandinavian aesthetic.' },
  { id: 'modern_geometric', name: 'Geometric',     prompt: 'Bold geometric patterns with overlapping shapes in pastel colors. Contemporary abstract art style.' },
  { id: 'vintage_coffee',   name: 'Vintage',       prompt: 'Retro coffee shop branding with ornamental borders, vintage typography, and warm brown tones.' },
  { id: 'luxury_gold',      name: 'Luxury Gold',   prompt: 'Premium luxury design with gold foil accents, deep navy background, and elegant serif typography.' },
  { id: 'japanese_minimal', name: 'Japanese',      prompt: 'Wabi-sabi inspired with delicate cherry blossoms, soft ink wash, and serene natural elements.' },
  { id: 'botanical',        name: 'Botanical',     prompt: 'Hand-drawn botanical illustrations with leaves, flowers, and natural elements in pale green tones.' },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider mb-3">{children}</p>;
}

function OptionPill({ label, active, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-foreground text-background'
          : disabled
            ? 'bg-muted text-muted-foreground/30 cursor-not-allowed'
            : 'bg-secondary text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const fileInputRef = useRef(null);

  // Order state
  const [quantity, setQuantity] = useState(100);

  // Config state
  const [config, setConfig] = useState({
    volume: '220cc',
    material: 'glossy',
    wall_type: 'single_wall',
    surface_type: 'smooth',
    projectName: '',
    notes: '',
  });

  // Design mode: 'ai' | 'upload'
  const [designMode, setDesignMode] = useState('ai');

  // AI design state
  const [aiOpen, setAiOpen]               = useState(false);
  const [prompt, setPrompt]               = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isGenerating, setIsGenerating]   = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  // Upload design state
  const [uploadedImage, setUploadedImage]   = useState(null);
  const [uploadedFile, setUploadedFile]     = useState(null);
  const [isUploading, setIsUploading]       = useState(false);
  const [isDragOver, setIsDragOver]         = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const products = await db.entities.Product.filter({ id });
      return products[0];
    },
    enabled: !!id,
  });

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleConfigChange = (key, value) => {
    setConfig(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'material' && value === 'kraft') next.wall_type = 'single_wall';
      return next;
    });
  };

  const handlePreset = (preset) => {
    setSelectedPreset(preset.id);
    setPrompt(preset.prompt);
    if (!aiOpen) setAiOpen(true);
  };

  const generate = useCallback(async (overridePrompt) => {
    const text = overridePrompt || prompt;
    if (!text.trim()) { toast.error('Please describe your design'); return; }
    setIsGenerating(true);
    const full = `Design for a paper coffee cup: ${text}. Wrap-around pattern for a cylindrical cup. Premium studio photography, soft lighting, cream background, no people.`;
    const result = await db.integrations.Core.GenerateImage({ prompt: full });
    setGeneratedImage(result.url);
    toast.success('Design applied to preview!');
    setIsGenerating(false);
  }, [prompt]);

  const handleFileSelect = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setIsUploading(true);
    setUploadedFile(file);
    const localUrl = URL.createObjectURL(file);
    setUploadedImage(localUrl);
    try {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      setUploadedImage(file_url);
    } catch (e) {
      // keep local preview
    }
    setIsUploading(false);
    toast.success('Design uploaded!');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleAddToCart = async () => {
    const activeDesignImage = designMode === 'ai' ? generatedImage : uploadedImage;
    let designId = null;
    if (activeDesignImage && product) {
      const design = await db.entities.CupDesign.create({
        name: config.projectName || `${product.name} Design`,
        product_id: product.id,
        design_image_url: activeDesignImage,
        status: 'ordered',
        colors: [],
      });
      designId = design.id;
    }
    addItem({
      product_id: product.id,
      product_name: config.projectName || product.name,
      quantity,
      unit_price: unitPrice,
      design_image_url: activeDesignImage || product.image_url,
      design_id: designId,
    });
    toast.success('Added to cart!');
  };

  // ── Loading / not found ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <Skeleton className="aspect-square rounded-[40px]" />
          <div className="space-y-4 pt-8">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 pb-20 text-center">
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Link to="/products" className="text-cobalt hover:underline">Back to Products</Link>
      </div>
    );
  }

  const unitPrice  = getDiscountedPrice(product.price, quantity);
  const totalPrice = unitPrice * quantity;
  const hasDiscount = unitPrice < product.price;
  const isKraft = config.material === 'kraft';

  // Dynamic preview: prefer user design, then config-specific image, then product image
  const activeDesignImage = designMode === 'ai' ? generatedImage : uploadedImage;
  const configKey = `${config.material}_${config.wall_type}`;
  const configImage = configPreviewImages[configKey] || null;
  const previewImage = activeDesignImage || configImage || product.image_url;

  const specs = [
    { label: 'Category',   value: (product.category || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
    { label: 'Capacity',   value: product.capacity },
    { label: 'Material',   value: (product.material || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
    { label: 'Structure',  value: (product.wall_type || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
    { label: 'Surface',    value: (product.surface_type || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
    { label: 'Min. Order', value: product.min_order ? `${product.min_order} pcs` : null },
  ].filter(s => s.value);

  // Build a label describing current config for the preview badge
  const configLabel = [config.volume, config.material, config.wall_type?.replace('_wall','W')].filter(Boolean).join(' · ');

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {/* Two-column layout: sticky preview left, scrolling config right */}
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">

          {/* ── LEFT: sticky preview column ────────────────────────────────── */}
          <div className="lg:sticky lg:top-28 space-y-6">
            {/* Product image with smooth config-reactive transition */}
            <div className="relative rounded-[40px] bg-cream overflow-hidden aspect-square">
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewImage + configKey}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full"
                >
                  {previewImage ? (
                    <img src={previewImage} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-16 h-16 text-muted-foreground/20" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Config label badge */}
              <motion.div
                key={configLabel}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-5 right-5 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 shadow-sm border border-white text-xs font-semibold text-foreground/70"
              >
                {configLabel}
              </motion.div>

              {activeDesignImage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-5 left-5 flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-3 py-2 shadow-sm border border-white text-xs font-semibold text-cobalt"
                >
                  {designMode === 'ai' ? <Sparkles className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                  {designMode === 'ai' ? 'AI Design Applied' : 'Custom Design'}
                </motion.div>
              )}

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3"
                >
                  <Loader2 className="w-8 h-8 text-cobalt animate-spin" />
                  <p className="text-sm font-medium text-foreground">Generating your design…</p>
                </motion.div>
              )}

              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3"
                >
                  <Loader2 className="w-8 h-8 text-cobalt animate-spin" />
                  <p className="text-sm font-medium text-foreground">Uploading design…</p>
                </motion.div>
              )}
            </div>

            {/* Volume Pricing */}
            <BulkPricingCalculator basePrice={product.price} quantity={quantity} />

            {/* ── Purchase Summary Card (moved here, below pricing) ── */}
            <div className="bg-white rounded-3xl border border-border/50 p-6 space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Price per unit</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-display font-extrabold text-4xl">${unitPrice.toFixed(3)}</p>
                    {hasDiscount && (
                      <span className="text-base text-muted-foreground line-through">${product.price?.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-secondary rounded-full p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(product.min_order || 100, q - 50))}
                    className="w-9 h-9 rounded-full hover:bg-background transition-colors flex items-center justify-center"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-medium text-sm w-16 text-center">{quantity} pcs</span>
                  <button
                    onClick={() => setQuantity(q => q + 50)}
                    className="w-9 h-9 rounded-full hover:bg-background transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-full h-14 font-medium text-base shadow-none"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart — ${totalPrice.toFixed(2)}
              </Button>
            </div>
          </div>

          {/* ── RIGHT: scrolling configuration column ──────────────────────── */}
          <div className="flex flex-col gap-7">

            {/* Product header */}
            <div>
              {product.ai_compatible && (
                <Badge className="bg-cobalt/10 text-cobalt border-0 rounded-full px-3 py-1 mb-3">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Design Compatible
                </Badge>
              )}
              <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-3">{product.name}</h1>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || 'Premium quality cup, ready for custom AI-powered design.'}
              </p>
            </div>

            {/* ── 1. Specs ── */}
            <div className="bg-secondary/40 rounded-3xl p-6">
              <SectionLabel>Specifications</SectionLabel>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {specs.map(s => (
                  <div key={s.label}>
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="font-medium text-sm">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 2. Configure ── */}
            <div className="bg-secondary/40 rounded-3xl p-6 space-y-6">
              <SectionLabel>Configure Your Order</SectionLabel>

              {/* Volume */}
              <div>
                <p className="text-sm font-medium mb-2.5">Volume</p>
                <div className="flex flex-wrap gap-2">
                  {volumeOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleConfigChange('volume', opt.value)}
                      className={`flex flex-col items-center px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        config.volume === opt.value
                          ? 'bg-foreground text-background'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {config.volume === opt.value && <span className="text-[10px] opacity-60 leading-none mt-0.5">{opt.hint}</span>}
                    </button>
                  ))}
                </div>
                {config.volume && <p className="text-xs text-muted-foreground/60 mt-2">{volumeOptions.find(v => v.value === config.volume)?.hint}</p>}
              </div>

              {/* Material */}
              <div>
                <p className="text-sm font-medium mb-2.5">Material</p>
                <div className="flex flex-wrap gap-2">
                  {materialOptions.map(opt => (
                    <OptionPill key={opt.value} label={opt.label} active={config.material === opt.value} onClick={() => handleConfigChange('material', opt.value)} />
                  ))}
                </div>
              </div>

              {/* Wall type */}
              <div>
                <p className="text-sm font-medium mb-2.5">Wall Type</p>
                <div className="flex flex-wrap gap-2">
                  {wallOptions.map(opt => {
                    const isDisabled = isKraft && opt.value !== 'single_wall';
                    return <OptionPill key={opt.value} label={opt.label} active={config.wall_type === opt.value} disabled={isDisabled} onClick={() => !isDisabled && handleConfigChange('wall_type', opt.value)} />;
                  })}
                </div>
                {isKraft && <p className="text-xs text-muted-foreground/50 mt-2 flex items-center gap-1.5"><Info className="w-3 h-3" />Kraft is available in Single Wall only</p>}
              </div>

              {/* Finish */}
              <div>
                <p className="text-sm font-medium mb-2.5">Outer Finish</p>
                <div className="flex flex-wrap gap-2">
                  {finishOptions.map(opt => (
                    <OptionPill key={opt.value} label={opt.label} active={config.surface_type === opt.value} onClick={() => handleConfigChange('surface_type', opt.value)} />
                  ))}
                </div>
              </div>

              {/* Project name + notes */}
              <div className="grid sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <p className="text-sm font-medium mb-2">Project Name</p>
                  <Input
                    value={config.projectName}
                    onChange={e => handleConfigChange('projectName', e.target.value)}
                    placeholder="e.g. Summer Menu"
                    className="rounded-2xl h-11 bg-white"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Notes</p>
                  <Input
                    value={config.notes}
                    onChange={e => handleConfigChange('notes', e.target.value)}
                    placeholder="Special requirements…"
                    className="rounded-2xl h-11 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* ── 3. Design Selection ── */}
            <div className="bg-secondary/40 rounded-3xl overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <SectionLabel>Design Options</SectionLabel>
                {/* Mode selector cards */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDesignMode('ai')}
                    className={`relative rounded-2xl p-4 text-left transition-all duration-200 border-2 ${
                      designMode === 'ai'
                        ? 'border-cobalt bg-white shadow-sm'
                        : 'border-transparent bg-secondary/60 hover:bg-secondary'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${designMode === 'ai' ? 'bg-cobalt/10' : 'bg-secondary'}`}>
                      <Sparkles className={`w-4 h-4 ${designMode === 'ai' ? 'text-cobalt' : 'text-muted-foreground'}`} />
                    </div>
                    <p className={`text-sm font-semibold mb-0.5 ${designMode === 'ai' ? 'text-foreground' : 'text-muted-foreground'}`}>AI Generated</p>
                    <p className="text-xs text-muted-foreground leading-snug">Generate a custom design using AI</p>
                    {designMode === 'ai' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cobalt flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setDesignMode('upload')}
                    className={`relative rounded-2xl p-4 text-left transition-all duration-200 border-2 ${
                      designMode === 'upload'
                        ? 'border-cobalt bg-white shadow-sm'
                        : 'border-transparent bg-secondary/60 hover:bg-secondary'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${designMode === 'upload' ? 'bg-cobalt/10' : 'bg-secondary'}`}>
                      <Upload className={`w-4 h-4 ${designMode === 'upload' ? 'text-cobalt' : 'text-muted-foreground'}`} />
                    </div>
                    <p className={`text-sm font-semibold mb-0.5 ${designMode === 'upload' ? 'text-foreground' : 'text-muted-foreground'}`}>Upload My Own</p>
                    <p className="text-xs text-muted-foreground leading-snug">Upload an existing design file</p>
                    {designMode === 'upload' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cobalt flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* ── AI Design panel ── */}
              <AnimatePresence mode="wait">
                {designMode === 'ai' && (
                  <motion.div
                    key="ai-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    {/* Collapsible trigger */}
                    <button
                      onClick={() => setAiOpen(v => !v)}
                      className="w-full flex items-center justify-between px-6 py-4 border-t border-border/30 hover:bg-secondary/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-cobalt/10 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-cobalt" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold">AI Design Studio</p>
                          <p className="text-xs text-muted-foreground">
                            {generatedImage ? 'Custom design applied ✓' : 'Generate a custom design for this cup'}
                          </p>
                        </div>
                      </div>
                      {aiOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>

                    <AnimatePresence>
                      {aiOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 space-y-5 border-t border-border/30 pt-5">
                            <div>
                              <SectionLabel>Style Presets</SectionLabel>
                              <div className="flex flex-wrap gap-2">
                                {stylePresets.map(p => (
                                  <button
                                    key={p.id}
                                    onClick={() => handlePreset(p)}
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                                      selectedPreset === p.id
                                        ? 'bg-cobalt text-white'
                                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                                    }`}
                                  >
                                    {selectedPreset === p.id && <Check className="w-3 h-3" />}
                                    {p.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <SectionLabel>Custom Prompt</SectionLabel>
                              <Textarea
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="Describe your design vision…"
                                className="min-h-[76px] rounded-2xl text-sm resize-none bg-white border-border/60 focus-visible:ring-cobalt"
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => generate()}
                                disabled={isGenerating || !prompt.trim()}
                                className="flex-1 bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-11 font-medium shadow-none"
                              >
                                {isGenerating
                                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating…</>
                                  : <><Sparkles className="w-4 h-4 mr-2" />{generatedImage ? 'Regenerate' : 'Generate Design'}</>
                                }
                              </Button>
                              {generatedImage && (
                                <Button
                                  onClick={() => generate(prompt + ' — new variation, different composition')}
                                  disabled={isGenerating}
                                  variant="outline"
                                  className="rounded-full h-11 px-4"
                                  title="New variation"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            {generatedImage && (
                              <button
                                onClick={() => setGeneratedImage(null)}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Remove AI design
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ── Upload Design panel ── */}
                {designMode === 'upload' && (
                  <motion.div
                    key="upload-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-4 border-t border-border/30 space-y-4">
                      {uploadedImage ? (
                        <div className="relative">
                          <div className="rounded-2xl overflow-hidden aspect-video bg-cream">
                            <img src={uploadedImage} alt="Uploaded design" className="w-full h-full object-contain" />
                          </div>
                          <button
                            onClick={() => { setUploadedImage(null); setUploadedFile(null); }}
                            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            {uploadedFile?.name || 'Uploaded design'} · <button onClick={() => { setUploadedImage(null); setUploadedFile(null); }} className="text-cobalt hover:underline">Replace</button>
                          </p>
                        </div>
                      ) : (
                        <div
                          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                          onDragLeave={() => setIsDragOver(false)}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                            isDragOver
                              ? 'border-cobalt bg-cobalt/5'
                              : 'border-border/50 bg-white hover:border-cobalt/40 hover:bg-secondary/30'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium mb-0.5">Drop your design here</p>
                            <p className="text-xs text-muted-foreground">or click to browse · PNG, JPG, SVG</p>
                          </div>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => e.target.files[0] && handleFileSelect(e.target.files[0])}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}