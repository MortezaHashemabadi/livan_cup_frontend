const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Save } from 'lucide-react';
import { toast } from 'sonner';

const labels = {
  volume: 'Volume',
  material: 'Material',
  wall_type: 'Wall Type',
  surface_type: 'Outer Finish',
};

const valueLabels = {
  single_wall: 'Single Wall',
  double_wall: 'Double Wall',
  triple_wall: 'Triple Wall',
  smooth: 'Smooth',
  rippled: 'Corrugated',
  kraft: 'Kraft',
  glossy: 'Glossy',
};

export default function ExportSummary({ config, designConfig }) {
  const specs = ['volume', 'material', 'wall_type', 'surface_type'];

  const handleCopy = () => {
    const text = `Cupcraft Configuration\n\n${specs.map(s => `${labels[s]}: ${valueLabels[config[s]] || config[s]}`).join('\n')}\n\nDesign: ${designConfig.mode === 'ai' ? 'AI Generated' : 'Manual'}\nProject: ${config.projectName || 'Untitled'}`;
    navigator.clipboard.writeText(text);
    toast.success('Configuration copied!');
  };

  const handleSave = async () => {
    await db.entities.CupDesign.create({
      name: config.projectName || 'Custom Cup Design',
      prompt: designConfig.aiPrompt || 'Manual design',
      style_preset: designConfig.aiSuggestion || 'custom',
      design_image_url: '',
      status: 'draft',
    });
    toast.success('Design saved!');
  };

  return (
    <div className="bg-white rounded-3xl border border-border/50 p-6">
      <h3 className="font-heading font-semibold text-lg mb-6">Configuration Summary</h3>

      <div className="bg-cream rounded-2xl p-5 mb-6">
        <div className="grid grid-cols-2 gap-4">
          {specs.map(spec => (
            <div key={spec}>
              <p className="text-xs text-muted-foreground mb-1">{labels[spec]}</p>
              <p className="font-medium text-sm">
                {valueLabels[config[spec]] || config[spec]}
              </p>
            </div>
          ))}
        </div>

        {(config.projectName || config.notes) && (
          <div className="border-t border-border/30 mt-4 pt-4 space-y-2">
            {config.projectName && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Project</p>
                <p className="text-sm font-medium">{config.projectName}</p>
              </div>
            )}
            {config.notes && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Notes</p>
                <p className="text-sm">{config.notes}</p>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-border/30 mt-4 pt-4">
          <p className="text-xs text-muted-foreground mb-1">Design Mode</p>
          <p className="text-sm font-medium">
            {designConfig.mode === 'ai' ? 'AI Generated' : 'Manual Design'}
            {designConfig.aiSuggestion && ` — ${designConfig.aiSuggestion.replace(/_/g, ' ')}`}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleCopy}
          variant="outline"
          className="flex-1 rounded-full gap-2 text-sm"
        >
          <Copy className="w-4 h-4" />
          Copy Configuration
        </Button>
        <Button
          onClick={handleSave}
          className="flex-1 bg-foreground hover:bg-foreground/90 text-background rounded-full gap-2 text-sm shadow-none"
        >
          <Save className="w-4 h-4" />
          Save Design
        </Button>
      </div>
    </div>
  );
}