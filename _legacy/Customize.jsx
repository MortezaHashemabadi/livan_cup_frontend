import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { motion } from 'framer-motion';
import CupPreview from '@/components/customize/CupPreview';
import ConfigPanel from '@/components/customize/ConfigPanel';
import DesignTabs from '@/components/customize/DesignTabs';
import AIDesignIdeas from '@/components/customize/AIDesignIdeas';
import RecommendedProducts from '@/components/customize/RecommendedProducts';
import ReviewsSection from '@/components/customize/ReviewsSection';
import ExportSummary from '@/components/customize/ExportSummary';

export default function Customize() {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(500);

  const [config, setConfig] = useState({
    volume: '120cc',
    material: 'glossy',
    wall_type: 'single_wall',
    surface_type: 'smooth',
    projectName: '',
    notes: '',
    instructions: '',
  });

  const [designConfig, setDesignConfig] = useState({
    bgColor: null,
    text: '',
    shape: null,
    aiSuggestion: null,
    aiPrompt: '',
    mode: 'ai',
  });

  const handleAddToCart = () => {
    addItem({
      product_id: 'custom-config',
      product_name: config.projectName || `${config.volume} Custom Cup`,
      quantity,
      unit_price: 0.12,
      design_image_url: null,
      design_id: 'customized',
    });
  };

  const showAiBadge = designConfig.mode === 'ai' && designConfig.aiSuggestion !== null;

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="mb-12">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Customize Your Cup
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Configure every detail and design your perfect disposable cup
          </p>
        </div>

        {/* Main two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column - Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="bg-white rounded-3xl border border-border/50 p-6">
              <h2 className="font-heading font-bold text-xl mb-6">Cup Configuration</h2>
              <ConfigPanel config={config} onChange={setConfig} />
            </div>

            <div className="bg-white rounded-3xl border border-border/50 p-6">
              <h2 className="font-heading font-bold text-xl mb-6">Design Customization</h2>
              <DesignTabs designConfig={designConfig} onDesignChange={setDesignConfig} />
            </div>

            <ExportSummary config={config} designConfig={designConfig} />
          </motion.div>

          {/* Right Column - Preview & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="lg:sticky lg:top-28 space-y-6">
              <CupPreview
                config={config}
                designColor={designConfig.bgColor}
                showAiBadge={showAiBadge}
              />

              {/* Product Summary */}
              <div className="bg-white rounded-3xl border border-border/50 p-6">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price per unit</p>
                    <p className="font-display font-extrabold text-4xl">$0.12</p>
                  </div>
                  <div className="flex items-center gap-3 bg-secondary rounded-full p-1">
                    <button
                      onClick={() => setQuantity(Math.max(100, quantity - 100))}
                      className="w-10 h-10 rounded-full hover:bg-background transition-colors flex items-center justify-center"
                    >
                      <span className="text-lg font-medium">−</span>
                    </button>
                    <span className="font-medium text-sm w-20 text-center">{quantity} pcs</span>
                    <button
                      onClick={() => setQuantity(quantity + 100)}
                      className="w-10 h-10 rounded-full hover:bg-background transition-colors flex items-center justify-center"
                    >
                      <span className="text-lg font-medium">+</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-foreground hover:bg-foreground/90 text-background rounded-full h-14 font-medium text-base shadow-none"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart — ${(0.12 * quantity).toFixed(2)}
                  </Button>
                  <Button variant="outline" className="rounded-full h-14 px-6 font-medium border-cobalt text-cobalt hover:bg-cobalt/5">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Below the fold sections */}
        <div className="space-y-8">
          <AIDesignIdeas onSelectDesign={(idea) => setDesignConfig({
            ...designConfig,
            aiSuggestion: idea.id,
            aiPrompt: idea.title,
            mode: 'ai',
          })} />

          <RecommendedProducts config={config} />

          <ReviewsSection />
        </div>
      </div>
    </div>
  );
}