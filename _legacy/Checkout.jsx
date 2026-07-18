const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, Check, Package, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

import { motion } from 'framer-motion';
import { toast } from 'sonner';
import SavedAddressPicker from '@/components/checkout/SavedAddressPicker';

const steps = [
  { id: 1, label: 'ارسال', icon: Truck },
  { id: 2, label: 'تولید', icon: Package },
  { id: 3, label: 'پرداخت', icon: CreditCard },
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', country: '', notes: '',
  });

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleAddressSelect = (id, fields) => {
    setSelectedAddressId(id);
    if (fields) setForm(prev => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    const orderNumber = `CC-${Date.now().toString(36).toUpperCase()}`;
    await db.entities.Order.create({
      order_number: orderNumber,
      status: 'pending',
      items: items.map(i => ({
        product_name: i.product_name,
        quantity: i.quantity,
        unit_price: i.unit_price,
        design_image_url: i.design_image_url || '',
      })),
      total_amount: totalPrice,
      shipping_name: form.name,
      shipping_email: form.email,
      shipping_phone: form.phone,
      shipping_address: form.address,
      shipping_city: form.city,
      shipping_country: form.country,
      notes: form.notes,
    });
    clearCart();
    setOrderComplete(true);
    toast.success('سفارش با موفقیت ثبت شد!');
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="pt-28 pb-20 text-center min-h-screen flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2">سبد خرید خالی است</h2>
        <p className="text-muted-foreground mb-8">برای شروع محصولاتی اضافه کنید</p>
        <Link to="/products">
          <Button className="rounded-full bg-cobalt hover:bg-cobalt-hover text-white">مشاهده محصولات</Button>
        </Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="pt-28 pb-20 text-center min-h-screen flex flex-col items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div className="w-20 h-20 rounded-full bg-pale-mint flex items-center justify-center mb-6 mx-auto">
            <Check className="w-10 h-10 text-green-600" />
          </div>
        </motion.div>
        <h2 className="font-display font-bold text-3xl mb-2">سفارش به تولید ارسال شد!</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          لیوانهای سفارشی شما در حال آمادهسازی است. از طریق ایمیل بهروزرسانیها را دریافت خواهید کرد.
        </p>
        <Link to="/">
          <Button className="rounded-full bg-cobalt hover:bg-cobalt-hover text-white">بازگشت به صفحه اصلی</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowRight className="w-4 h-4" />
          ادامه خرید
        </Link>

        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-10">تسویهحساب</h1>

        {/* مراحل */}
        <div className="flex items-center gap-2 mb-12">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                step >= s.id ? 'bg-cobalt text-white' : 'bg-secondary text-muted-foreground'
              }`}>
                <s.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full ${step > s.id ? 'bg-cobalt' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <SavedAddressPicker onSelect={handleAddressSelect} selectedId={selectedAddressId} />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">نام و نام خانوادگی</label>
                  <Input value={form.name} onChange={e => updateForm('name', e.target.value)} className="rounded-xl h-12" placeholder="محمد رضایی" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">ایمیل</label>
                  <Input value={form.email} onChange={e => updateForm('email', e.target.value)} className="rounded-xl h-12" type="email" placeholder="example@email.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">شماره تماس</label>
                <Input value={form.phone} onChange={e => updateForm('phone', e.target.value)} className="rounded-xl h-12" placeholder="۰۹۱۲۱۲۳۴۵۶۷" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">آدرس</label>
                <Input value={form.address} onChange={e => updateForm('address', e.target.value)} className="rounded-xl h-12" placeholder="خیابان ولیعصر، پلاک ۱۲" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">شهر</label>
                  <Input value={form.city} onChange={e => updateForm('city', e.target.value)} className="rounded-xl h-12" placeholder="تهران" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">کشور</label>
                  <Input value={form.country} onChange={e => updateForm('country', e.target.value)} className="rounded-xl h-12" placeholder="ایران" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="bg-cream rounded-3xl p-6">
                <h3 className="font-heading font-semibold mb-4">خلاصه سفارش</h3>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white overflow-hidden flex-shrink-0">
                        {item.design_image_url && <img src={item.design_image_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} عدد × ${item.unit_price.toFixed(2)}</p>
                      </div>
                      <span className="text-sm font-medium">${(item.quantity * item.unit_price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">یادداشت تولید (اختیاری)</label>
                <Textarea value={form.notes} onChange={e => updateForm('notes', e.target.value)} className="rounded-xl min-h-[80px]" placeholder="هر گونه نیاز خاص..." />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="bg-cream rounded-3xl p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">جمع کل</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">هزینه ارسال</span>
                    <span className="font-medium">محاسبه در مرحله تولید</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-heading font-bold">مجموع</span>
                    <span className="font-heading font-bold text-xl">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  با ثبت این سفارش، شرایط ما را میپذیرید. تیم ما برای تأیید جزئیات تولید و قیمت نهایی با شما تماس خواهد گرفت.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-between mt-10">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full gap-2">
              <ArrowRight className="w-4 h-4" />
              قبلی
            </Button>
          ) : <div />}

          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full gap-2 shadow-none">
              ادامه
              <ArrowLeft className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full gap-2 h-12 px-8 font-medium shadow-none">
              <Package className="w-4 h-4" />
              ارسال به تولید
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}