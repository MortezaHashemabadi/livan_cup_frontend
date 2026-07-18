import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'پایه',
    desc: 'مناسب کافهها و فروشگاههای کوچک',
    price: '0.08',
    unit: 'به ازای هر لیوان',
    minOrder: '۵۰۰ لیوان',
    color: 'bg-cream',
    features: [
      'لیوان تکجداره کاغذی',
      'تا ۲ اندازه',
      '۱ طرح هوش مصنوعی',
      'چاپ استاندارد',
      'ارسال معمولی',
    ],
  },
  {
    name: 'حرفهای',
    desc: 'برای رستورانها و برندهای در حال رشد',
    price: '0.12',
    unit: 'به ازای هر لیوان',
    minOrder: '۱٬۰۰۰ لیوان',
    featured: true,
    color: 'bg-cobalt',
    features: [
      'لیوان تک و دوجداره',
      'همه اندازهها',
      'طرح نامحدود هوش مصنوعی',
      'چاپ HD پریمیوم',
      'ارسال اولویتدار',
      'درپوش ست',
      'پشتیبانی اختصاصی',
    ],
  },
  {
    name: 'سازمانی',
    desc: 'برای زنجیرهها و عملیات بزرگ',
    price: 'توافقی',
    unit: 'قیمتگذاری حجمی',
    minOrder: '۱۰٬۰۰۰+ لیوان',
    color: 'bg-foreground',
    features: [
      'همه انواع لیوان و جنس',
      'مشخصات سفارشی',
      'طرح نامحدود هوش مصنوعی',
      'چاپ پریمیوم + فویل',
      'ارسال اکسپرس',
      'تطابق رنگ پانتون',
      'مدیر حساب اختصاصی',
      'دسترسی API',
    ],
  },
];

export default function Pricing() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            قیمتگذاری ساده و شفاف
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            بدون هزینه پنهان. با رشد برندتان مقیاس دهید.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-[32px] p-8 ${
                plan.featured
                  ? 'bg-cobalt text-white ring-4 ring-cobalt/20'
                  : 'bg-white border border-border'
              }`}
            >
              <div className="mb-8">
                <h3 className="font-display font-bold text-xl mb-2">{plan.name}</h3>
                <p className={`text-sm ${plan.featured ? 'text-white/60' : 'text-muted-foreground'}`}>
                  {plan.desc}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="font-display font-extrabold text-4xl">
                    {plan.price === 'توافقی' ? '' : '$'}{plan.price}
                  </span>
                  <span className={`text-sm mb-1 ${plan.featured ? 'text-white/60' : 'text-muted-foreground'}`}>
                    {plan.unit}
                  </span>
                </div>
                <p className={`text-xs mt-2 ${plan.featured ? 'text-white/50' : 'text-muted-foreground/60'}`}>
                  حداقل {plan.minOrder}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.featured ? 'text-white/80' : 'text-cobalt'}`} />
                    <span className={`text-sm ${plan.featured ? 'text-white/80' : 'text-muted-foreground'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link to="/designer">
                <Button
                  className={`w-full rounded-full h-12 font-medium ${
                    plan.featured
                      ? 'bg-white text-cobalt hover:bg-white/90'
                      : 'bg-foreground text-background hover:bg-foreground/90'
                  } shadow-none`}
                >
                  شروع کنید
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}