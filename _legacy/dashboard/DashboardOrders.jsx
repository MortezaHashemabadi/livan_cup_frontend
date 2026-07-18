const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Package, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge';

const statusFilters = [
  { id: 'all',          label: 'All' },
  { id: 'active',       label: 'Active' },
  { id: 'in_production',label: 'In Production' },
  { id: 'shipped',      label: 'Shipped' },
  { id: 'delivered',    label: 'Delivered' },
];

export default function DashboardOrders() {
  const [filter, setFilter]       = useState('all');
  const [expanded, setExpanded]   = useState(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => db.entities.Order.list('-created_date', 100),
  });

  const filtered = orders.filter(o => {
    if (filter === 'all')    return true;
    if (filter === 'active') return ['pending','confirmed','in_production','shipped'].includes(o.status);
    return o.status === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Orders</h1>
        <p className="text-muted-foreground text-sm">Track and manage your production orders.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {statusFilters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === f.id ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-3xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border/50 p-16 text-center">
          <Package className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-medium text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="bg-white rounded-3xl border border-border/50 overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-soft-blue/40 flex items-center justify-center">
                    <Package className="w-4 h-4 text-cobalt" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">#{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''} · ${order.total_amount?.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  {expanded === order.id
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              <AnimatePresence>
                {expanded === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-4">
                      {/* Items */}
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          {item.design_image_url ? (
                            <img src={item.design_image_url} alt="" className="w-12 h-12 rounded-xl object-cover bg-cream" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                              <Package className="w-4 h-4 text-muted-foreground/40" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.product_name}</p>
                            <p className="text-xs text-muted-foreground">{item.quantity} pcs · ${item.unit_price}/ea</p>
                          </div>
                          <p className="text-sm font-semibold">${(item.quantity * item.unit_price).toFixed(2)}</p>
                        </div>
                      ))}
                      {/* Delivery */}
                      {order.shipping_address && (
                        <div className="flex items-start gap-2 pt-2 border-t border-border/40">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium">{order.shipping_name}</p>
                            <p className="text-xs text-muted-foreground">{order.shipping_address}, {order.shipping_city}, {order.shipping_country}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}