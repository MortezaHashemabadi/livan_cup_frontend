const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sparkles, Wand2, RefreshCw, Save, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const stylePresets = [
  { id: 'minimal_cafe', name: 'کافه مینیمال', prompt: 'Clean minimalist design with soft neutral tones, thin line art, and modern typography. Scandinavian aesthetic.' },
  { id: 'modern_geometric', name: 'هندسی مدرن', prompt: 'Bold geometric patterns with overlapping shapes in pastel colors. Contemporary abstract art style.' },
  { id: 'vintage_coffee', name: 'قهوهخانه قدیمی', prompt: 'Retro coffee shop branding with ornamental borders, vintage typography, and warm brown tones.' },
  { id: 'luxury_gold', name: 'لوکس طلایی', prompt: 'Premium luxury design with gold foil accents, deep navy background, and elegant serif typography.' },
  { id: 'japanese_minimal', name: 'ژاپنی مینیمال', prompt: 'Wabi-sabi inspired design with delicate cherry blossoms, soft ink wash, and serene natural elements.' },
  { id: 'scandinavian_organic', name: 'اسکاندیناوی ارگانیک', prompt: 'Organic shapes and botanical elements in muted earth tones. Clean Scandinavian design principles.' },
  { id: 'botanical', name: 'گیاهی', prompt: 'Hand-drawn botanical illustrations with leaves, flowers, and natural elements in pale green tones.' },
  { id: 'abstract_art', name: 'هنر انتزاعی', prompt: 'Contemporary abstract art with fluid shapes, color gradients, and artistic brush strokes.' },
];

const colorPalettes = [
  { name: 'کرم و آبی', colors: ['#FFF8F0', '#DCEEFF', '#7BB6FF', '#222222'] },
  { name: 'نعناعی و کرافت', colors: ['#E4F7EE', '#C9A96E', '#2D5016', '#F5F0E8'] },
  { name: 'هلویی و طلایی', colors: ['#FFE6D6', '#D4A574', '#8B6914', '#FFF8F0'] },
  { name: 'سرمهای و سفید', colors: ['#1A2332', '#FFFFFF', '#C8A97E', '#4A5568'] },
  { name: 'رزی و خاکستری', colors: ['#FFE4E6', '#F9A8D4', '#6B7280', '#FFFFFF'] },
  { name: 'سبز جنگلی', colors: ['#064E3B', '#D1FAE5', '#FEF3C7', '#ECFDF5'] },
];

export default function AIDesigner() {
  const [prompt, setPrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [designName, setDesignName] = useState('');
  const { addItem } = useCart();

  const generateDesign = useCallback(async (customPrompt) => {
    const text = customPrompt || prompt;
    if (!text.trim()) {
      toast.error('لطفاً طرح لیوان خود را توصیف کنید');
      return;
    }
    setIsGenerating(true);
    const fullPrompt = `Design for a paper coffee cup: ${text}. The design should be a wrap-around pattern suitable for printing on a cylindrical cup surface. Show the design on a premium paper cup, studio photography, soft diffuse lighting, cream background, no people, no liquid.`;
    const result = await db.integrations.Core.GenerateImage({ prompt: fullPrompt });
    setGeneratedImage(result.url);
    setIsGenerating(false);
  }, [prompt]);

  const handlePresetClick = (preset) => {
    setSelectedPreset(preset.id);
    setPrompt(preset.prompt);
  };

  const handleRemix = () => {
    if (prompt) generateDesign(prompt + ' — create a new variation with different composition and layout');
  };

  const handleSave = async () => {
    if (!generatedImage) return;
    await db.entities.CupDesign.create({
      name: designName || 'طرح بدون عنوان',
      prompt,
      style_preset: selectedPreset || 'custom',
      design_image_url: generatedImage,
      status: 'saved',
    });
    toast.success('طرح ذخیره شد!');
  };

  const handleAddToCart = () => {
    if (!generatedImage) return;
    addItem({
      product_id: 'custom',
      product_name: designName || 'طرح سفارشی هوش مصنوعی',
      quantity: 100,
      unit_price: 0.15,
      design_image_url: generatedImage,
      design_id: 'ai-generated',
    });
    toast.success('به سبد خرید اضافه شد!');
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-cream to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8 min-h-[calc(100vh-120px)]">

          {/* پنل راست — کنترلها (در RTL اول نمایش داده میشود) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div>
              <h1 className="font-display font-extrabold text-2xl tracking-tight mb-1">طراح هوش مصنوعی</h1>
              <p className="text-sm text-muted-foreground">ایدهات را بگو، هوش مصنوعی میسازد</p>
            </div>

            {/* ورودی پرامپت */}
            <div className="bg-white rounded-3xl p-5 border border-border/50 shadow-sm">
              <label className="text-sm font-medium mb-2 block">پرامپت طراحی</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="یک لیوان قهوه مینیمالیست با رنگهای بژ ملایم و الگوهای هندسی انتزاعی بساز..."
                className="min-h-[100px] border-0 bg-secondary/50 rounded-2xl resize-none text-sm focus-visible:ring-cobalt"
              />
              <Button
                onClick={() => generateDesign()}
                disabled={isGenerating || !prompt.trim()}
                className="w-full mt-3 bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-11 font-medium shadow-none"
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 ml-2 animate-spin" />در حال تولید...</>
                ) : (
                  <><Sparkles className="w-4 h-4 ml-2" />تولید طرح</>
                )}
              </Button>
            </div>

            {/* پیشتنظیمهای سبکی */}
            <div className="bg-white rounded-3xl p-5 border border-border/50 shadow-sm">
              <label className="text-sm font-medium mb-3 block">سبکهای آماده</label>
              <div className="grid grid-cols-2 gap-2">
                {stylePresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetClick(preset)}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-medium text-right transition-all duration-200 ${
                      selectedPreset === preset.id
                        ? 'bg-cobalt text-white'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* پالت رنگ */}
            <div className="bg-white rounded-3xl p-5 border border-border/50 shadow-sm">
              <label className="text-sm font-medium mb-3 block">پالت رنگ</label>
              <div className="space-y-2">
                {colorPalettes.map(palette => (
                  <button
                    key={palette.name}
                    onClick={() => setPrompt(prev => prev + ` Use colors: ${palette.name}`)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-secondary/60 transition-colors"
                  >
                    <div className="flex gap-1">
                      {palette.colors.map((color, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border border-border/30" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <span className="text-xs font-medium">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* مرکز — بوم پیشنمایش */}
          <div className="lg:col-span-5 xl:col-span-6 flex flex-col">
            <div className="flex-1 rounded-[40px] bg-white border border-border/50 shadow-sm overflow-hidden flex items-center justify-center relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <div className="w-24 h-24 rounded-full bg-soft-blue/30 flex items-center justify-center mx-auto mb-6">
                      <Loader2 className="w-10 h-10 text-cobalt animate-spin" />
                    </div>
                    <p className="font-heading font-semibold text-lg mb-2">در حال ساختن طرح شما...</p>
                    <p className="text-sm text-muted-foreground">هوش مصنوعی الگوی سفارشی لیوان را تولید میکند</p>
                  </motion.div>
                ) : generatedImage ? (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full h-full p-8 flex items-center justify-center">
                    <img src={generatedImage} alt="طرح تولید شده توسط هوش مصنوعی" className="max-w-full max-h-full object-contain rounded-2xl" />
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center p-12">
                    <div className="w-24 h-24 rounded-full bg-cream flex items-center justify-center mx-auto mb-6">
                      <Wand2 className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <p className="font-heading font-semibold text-lg mb-2 text-muted-foreground/60">
                      طرح شما اینجا نمایش داده میشود
                    </p>
                    <p className="text-sm text-muted-foreground/40">
                      یک پرامپت وارد کنید یا یک سبک آماده انتخاب کنید
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {generatedImage && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mt-4 flex-wrap">
                <Button onClick={handleRemix} disabled={isGenerating} variant="outline" className="rounded-full gap-2 text-sm">
                  <RefreshCw className="w-4 h-4" />
                  تنوع جدید
                </Button>
                <Button onClick={() => generateDesign(prompt + ' — create a refined, polished variation')} disabled={isGenerating} variant="outline" className="rounded-full gap-2 text-sm">
                  <Wand2 className="w-4 h-4" />
                  اصلاح
                </Button>
                <div className="flex-1" />
                <Input
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  placeholder="نام طرح..."
                  className="w-40 rounded-full h-10 text-sm border-border/50"
                />
                <Button onClick={handleSave} variant="outline" className="rounded-full gap-2 text-sm">
                  <Save className="w-4 h-4" />
                  ذخیره
                </Button>
                <Button onClick={handleAddToCart} className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full gap-2 text-sm shadow-none">
                  <ShoppingBag className="w-4 h-4" />
                  افزودن به سبد
                </Button>
              </motion.div>
            )}
          </div>

          {/* پنل چپ — پیشنهادات هوش مصنوعی */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-heading font-semibold text-sm text-muted-foreground">پیشنهادات هوش مصنوعی</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {stylePresets.slice(0, 6).map(preset => (
                <button
                  key={preset.id}
                  onClick={() => { setPrompt(preset.prompt); generateDesign(preset.prompt); }}
                  className="group rounded-2xl bg-white border border-border/50 p-4 text-right hover:border-cobalt/30 hover:shadow-md transition-all duration-300"
                >
                  <p className="font-medium text-sm mb-1 group-hover:text-cobalt transition-colors">{preset.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{preset.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}