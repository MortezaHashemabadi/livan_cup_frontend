"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ticketsApi } from "@/lib/api/endpoints/tickets";
import { useAuth } from "@/lib/auth-context";

const emptyForm = { fullName: "", phone: "", subject: "", message: "" };

export default function ContactForm() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ticketsApi.create({
        fullname: form.fullName.trim(),
        phone: form.phone.trim(),
        ticket_type: "other",
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      toast.success("پیام شما ارسال شد", {
        description: "به زودی با شما تماس می‌گیریم.",
      });
      setForm(emptyForm);
    } catch (err: any) {
      console.error('Ticket error:', err);
      console.error('Payload:', err?.payload);
      toast.error(err?.message || 'ارسال پیام ناموفق بود');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cobalt mb-4">
            فرم تماس
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
            پیام خود را برای ما ارسال کنید
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white rounded-[32px] border border-border p-8 md:p-10 space-y-6"
        >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  required
                  placeholder="مثلاً امیر محمدی"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">شماره تماس</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  required
                  placeholder="09123456789"
                  dir="ltr"
                />
              </div>
            </div>

          <div className="space-y-2">
            <Label htmlFor="subject">موضوع</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={handleChange("subject")}
              required
              placeholder="موضوع پیام شما"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">پیام</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={handleChange("message")}
              required
              rows={5}
              placeholder="پیام خود را بنویسید..."
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-14 font-medium text-base shadow-none"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 ml-2" />
            )}
            ارسال پیام
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
