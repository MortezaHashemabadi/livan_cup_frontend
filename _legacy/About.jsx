import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Leaf, Zap, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const values = [
  { icon: Sparkles, title: 'نوآوری هوش مصنوعی', desc: 'هوش مصنوعی پیشرفته ایدههای شما را در چند ثانیه به طرحهای آماده تولید تبدیل میکند.' },
  { icon: Leaf, title: 'پایداری زیستمحیطی', desc: 'مواد زیستمحیطی و فرآیندهای تولید مسئولانه برای آیندهای سبزتر.' },
  { icon: Zap, title: 'سرعت', desc: 'از طراحی تا تحویل، هر مرحله را برای سریعترین زمان ممکن بهینه میکنیم.' },
  { icon: Shield, title: 'کیفیت', desc: 'مواد گواهیدار درجه غذایی و چاپ دقیق اطمینان میدهند که هر لیوان بالاترین استانداردها را داشته باشد.' },
];

export default function About() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-24"
        >
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8 leading-[1.2]">
            جایی که تولید
            <br />
            با{' '}
            <span className="text-cobalt">خلاقیت هوش مصنوعی</span> تلاقی میکند
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            کاپکرافت دههها تجربه تولید را با فناوری هوش مصنوعی پیشرفته ترکیب میکند تا لیوانهای سفارشی طراحی شده را در مقیاس بزرگ ارائه دهد. ما معتقدیم هر برندی سزاوار یک لیوان منحصربهفرد است — و هوش مصنوعی این را برای همه ممکن میسازد.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-24">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-[32px] bg-cream p-10"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6">
                <v.icon className="w-6 h-6 text-cobalt" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[40px] bg-foreground p-16 md:p-20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="w-5 h-5 text-background/60" />
            <span className="text-sm font-medium text-background/60">به ۵۰۰+ برند بپیوندید</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-background tracking-tight mb-6">
            بیایید چیز زیبایی بسازیم
          </h2>
          <p className="text-background/50 text-lg max-w-md mx-auto mb-10">
            همین امروز طراحی لیوان سفارشی خود را شروع کنید — بدون حداقل تعهد.
          </p>
          <Link to="/designer">
            <Button size="lg" className="bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-14 px-10 font-medium text-base shadow-none">
              شروع طراحی
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}