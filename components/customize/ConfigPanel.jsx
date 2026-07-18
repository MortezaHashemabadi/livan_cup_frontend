import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

const volumeOptions = [
  { value: '80cc', label: '80cc', hint: 'Espresso' },
  { value: '120cc', label: '120cc', hint: 'Double Espresso / Cortado' },
  { value: '220cc', label: '220cc', hint: 'Cappuccino / Latte' },
];

const materialOptions = [
  { value: 'kraft', label: 'Kraft' },
  { value: 'glossy', label: 'Glossy' },
];

const wallOptions = [
  { value: 'single_wall', label: 'Single Wall' },
  { value: 'double_wall', label: 'Double Wall' },
  { value: 'triple_wall', label: 'Triple Wall' },
];

const finishOptions = [
  { value: 'smooth', label: 'Smooth' },
  { value: 'rippled', label: 'Corrugated' },
];

function OptionGroup({ label, options, value, onChange, hints }) {
  return (
    <div>
      <label className="text-sm font-medium mb-3 block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              value === opt.value
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {hints && value && hints[value] && (
        <p className="mt-2 text-xs text-muted-foreground/60">{hints[value]}</p>
      )}
    </div>
  );
}

function DisabledOptionGroup({ label, options, value, disabledOptions, message }) {
  return (
    <div>
      <label className="text-sm font-medium mb-3 block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isDisabled = disabledOptions.includes(opt.value);
          return (
            <button
              key={opt.value}
              disabled={isDisabled}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                value === opt.value
                  ? 'bg-foreground text-background'
                  : isDisabled
                    ? 'bg-muted text-muted-foreground/30 cursor-not-allowed'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {message && (
        <div className="mt-2 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-soft-peach/80 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground/50">{message}</p>
        </div>
      )}
    </div>
  );
}

export default function ConfigPanel({ config, onChange }) {
  const isKraft = config.material === 'kraft';
  const volumeHints = Object.fromEntries(volumeOptions.map(v => [v.value, v.hint]));

  const handleChange = (key, value) => {
    const next = { ...config, [key]: value };
    if (key === 'material' && value === 'kraft') {
      next.wall_type = 'single_wall';
    }
    onChange(next);
  };

  return (
    <div className="space-y-8">
      <OptionGroup
        label="Volume"
        options={volumeOptions}
        value={config.volume}
        onChange={(v) => handleChange('volume', v)}
        hints={volumeHints}
      />

      <OptionGroup
        label="Material"
        options={materialOptions}
        value={config.material}
        onChange={(v) => handleChange('material', v)}
      />

      <DisabledOptionGroup
        label="Wall Type"
        options={wallOptions}
        value={config.wall_type}
        disabledOptions={isKraft ? ['double_wall', 'triple_wall'] : []}
        message={isKraft ? 'Kraft material is available in Single Wall only' : null}
      />

      <OptionGroup
        label="Outer Finish"
        options={finishOptions}
        value={config.surface_type}
        onChange={(v) => handleChange('surface_type', v)}
      />

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Project Name</label>
          <Input
            value={config.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
            placeholder="My Custom Cup Project"
            className="rounded-xl h-12"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Notes</label>
          <Textarea
            value={config.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Any specific requirements..."
            className="rounded-xl min-h-[80px]"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Special Instructions</label>
          <Textarea
            value={config.instructions}
            onChange={(e) => handleChange('instructions', e.target.value)}
            placeholder="Production notes, deadlines, etc."
            className="rounded-xl min-h-[60px]"
          />
        </div>
      </div>
    </div>
  );
}

export { volumeOptions, materialOptions, wallOptions, finishOptions };