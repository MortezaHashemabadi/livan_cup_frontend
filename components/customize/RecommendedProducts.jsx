import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { motion } from 'framer-motion';

const accessories = [
  {
    id: 'lid-sip',
    name: 'Sip-Through Lid',
    desc: 'Secure fit for all sizes',
    price: 0.03,
    image: '/__generating__/img_eb30440b6c50.png',
  },
  {
    id: 'holder-kraft',
    name: 'Kraft Cup Carrier',
    desc: '4-cup takeaway carrier',
    price: 0.15,
    image: '/__generating__/img_9f641164d06d.png',
  },
  {
    id: 'sleeve-protective',
    name: 'Protective Sleeve',
    desc: 'Extra insulation layer',
    price: 0.05,
    image: '/__generating__/img_46548575bc12.png',
  },
  {
    id: 'box-transport',
    name: 'Transport Box',
    desc: '500-cup shipping box',
    price: 1.50,
    image: '/__generating__/img_46548575bc12.png',
  },
];

export default function RecommendedProducts({ config }) {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-3xl border border-border/50 p-6">
      <h3 className="font-heading font-semibold text-lg mb-4">Recommended Accessories</h3>
      <p className="text-sm text-muted-foreground mb-6">Based on your {config.volume} cup configuration</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {accessories.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group text-center"
          >
            <div className="rounded-2xl bg-cream overflow-hidden aspect-square mb-3 relative">
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/20" />
              </div>
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                <Button
                  size="sm"
                  onClick={() => addItem({
                    product_id: item.id,
                    product_name: item.name,
                    quantity: 500,
                    unit_price: item.price,
                  })}
                  className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-8 px-3 text-[11px] font-medium shadow-lg"
                >
                  Add
                </Button>
              </div>
            </div>
            <p className="text-xs font-medium mb-1">{item.name}</p>
            <p className="text-[11px] text-muted-foreground mb-1">{item.desc}</p>
            <p className="text-sm font-heading font-bold">${item.price.toFixed(2)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}