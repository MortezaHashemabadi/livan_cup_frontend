import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Sarah Chen',
    rating: 5,
    text: 'The AI designer helped us create a beautiful cup design that perfectly matches our café brand. Production quality is outstanding.',
    role: 'Owner, Bluebird Café',
  },
  {
    name: 'Marcus Rivera',
    rating: 5,
    text: 'We ordered 10,000 custom cups for our restaurant chain. The customization tool made it incredibly easy to preview and finalize.',
    role: 'Operations Director, FreshBite',
  },
  {
    name: 'Elena Kowalski',
    rating: 4,
    text: 'Great quality and fast turnaround. The kraft double wall cups look premium and our customers love them.',
    role: 'Manager, Green Leaf Coffee',
  },
];

export default function ReviewsSection() {
  return (
    <div className="bg-white rounded-3xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-semibold text-lg mb-1">Customer Reviews</h3>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-4 h-4 fill-soft-peach text-soft-peach" />
            ))}
            <span className="text-sm text-muted-foreground ml-2">4.8 based on 120+ reviews</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {reviews.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-cream rounded-2xl p-5"
          >
            <div className="flex items-center gap-1 mb-3">
              {Array(review.rating).fill(0).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-soft-peach text-soft-peach" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
            <div>
              <p className="text-sm font-medium">{review.name}</p>
              <p className="text-xs text-muted-foreground">{review.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}