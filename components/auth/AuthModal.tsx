"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/lib/auth-modal-context";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 120;

function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] || "");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focus = (i: number) => refs.current[i]?.focus();

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        onChange(digits.map((d, j) => (j === i ? "" : d)).join(""));
      } else if (i > 0) {
        focus(i - 1);
        onChange(digits.map((d, j) => (j === i - 1 ? "" : d)).join(""));
      }
    } else if (e.key === "ArrowRight" && i > 0) {
      focus(i - 1);
    } else if (e.key === "ArrowLeft" && i < OTP_LENGTH - 1) {
      focus(i + 1);
    }
  };

  const handleInput = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    onChange(digits.map((d, j) => (j === i ? char : d)).join(""));
    if (i < OTP_LENGTH - 1) focus(i + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (pasted) {
      onChange(pasted.padEnd(OTP_LENGTH, "").slice(0, OTP_LENGTH));
      focus(Math.min(pasted.length, OTP_LENGTH - 1));
    }
    e.preventDefault();
  };

  useEffect(() => {
    focus(0);
  }, []);

  return (
    <div
      className="flex gap-2.5 justify-center flex-row-reverse"
      onPaste={handlePaste}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e) => handleInput(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          className={`w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 bg-secondary/40 outline-none transition-all duration-200 disabled:opacity-40 ${
            d
              ? "border-cobalt bg-cobalt/5 text-foreground"
              : "border-border focus:border-cobalt text-foreground"
          }`}
        />
      ))}
    </div>
  );
}

function Countdown({
  seconds,
  onDone,
}: {
  seconds: number;
  onDone: () => void;
}) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
    const t = setInterval(
      () =>
        setLeft((s) => {
          if (s <= 1) {
            clearInterval(t);
            onDone();
            return 0;
          }
          return s - 1;
        }),
      1000,
    );
    return () => clearInterval(t);
  }, [seconds]);
  return (
    <span className="font-medium tabular-nums text-cobalt">{left} ثانیه</span>
  );
}

export default function AuthModal() {
  const { isOpen, closeAuthModal } = useAuthModal();
  const { sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendKey, setResendKey] = useState(0);

  const reset = () => {
    setStep("phone");
    setPhone("");
    setOtp("");
    setError("");
    setCanResend(false);
    setLoading(false);
  };

  const handleClose = () => {
    closeAuthModal();
    setTimeout(reset, 400);
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError("لطفاً شماره موبایل خود را وارد کنید");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await sendOtp(phone);
      toast.info("کد ارسال شد", {
        description: `کد تأیید به ${phone} ارسال شد`,
      });
      setStep("otp");
      setCanResend(false);
    } catch {
      setError("مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH) {
      setError("کد ۶ رقمی را کامل وارد کنید");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyOtp(phone, otp);
      setStep("success");
      toast.success("خوش آمدید!", { description: "با موفقیت وارد شدید." });
      setTimeout(handleClose, 1800);
    } catch {
      setError("کد نامعتبر است. لطفاً دوباره تلاش کنید.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setCanResend(false);
    setResendKey((k) => k + 1);
    setError("");
    setOtp("");
    try {
      await sendOtp(phone);
      toast.info("کد مجدد ارسال شد", { description: "کد جدید در راه است." });
    } catch {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md bg-white rounded-[2rem] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18)] overflow-hidden">
              <div className="relative px-8 pt-8 pb-6">
                <button
                  onClick={handleClose}
                  className="absolute top-5 left-5 p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>

                <AnimatePresence mode="wait">
                  {step === "phone" && (
                    <motion.div
                      key="ph"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-cobalt/10 flex items-center justify-center mb-5">
                        <Phone className="w-5 h-5 text-cobalt" />
                      </div>
                      <h2 className="font-display font-extrabold text-2xl tracking-tight mb-1.5">
                        ورود به ایران لیوان
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        شماره موبایل خود را برای دریافت کد تأیید وارد کنید.
                      </p>
                    </motion.div>
                  )}
                  {step === "otp" && (
                    <motion.div
                      key="otp-h"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-cobalt/10 flex items-center justify-center mb-5">
                        <span className="text-2xl">✉️</span>
                      </div>
                      <h2 className="font-display font-extrabold text-2xl tracking-tight mb-1.5">
                        کد تأیید را وارد کنید
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        کد ۶ رقمی به{" "}
                        <span className="font-medium text-foreground">
                          {phone}
                        </span>{" "}
                        ارسال شد.
                      </p>
                    </motion.div>
                  )}
                  {step === "success" && (
                    <motion.div
                      key="success-h"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="text-center py-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.1,
                          type: "spring",
                          stiffness: 260,
                          damping: 18,
                        }}
                        className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5"
                      >
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </motion.div>
                      <h2 className="font-display font-extrabold text-2xl tracking-tight mb-2">
                        خوش آمدید!
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        در حال ورود...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {step === "phone" && (
                  <motion.div
                    key="phone-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-8 pb-8 space-y-4"
                  >
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/[^\d\s\-()]/g, ""));
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      placeholder="09121234567"
                      autoFocus
                      dir="ltr"
                      className="w-full h-14 px-4 rounded-2xl bg-secondary/40 border border-border/40 outline-none text-sm font-medium text-center placeholder:text-muted-foreground/50 focus:border-cobalt focus:bg-white transition-all duration-200"
                    />

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {error}
                      </motion.p>
                    )}

                    <Button
                      onClick={handleSendOtp}
                      disabled={loading || !phone.trim()}
                      className="w-full h-14 bg-foreground hover:bg-foreground/90 text-background rounded-2xl font-medium text-base shadow-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <ArrowLeft className="w-4 h-4 ml-2" />
                          ادامه
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
                      با ادامه، شرایط استفاده و حریم خصوصی ما را می‌پذیرید.
                    </p>
                  </motion.div>
                )}

                {step === "otp" && (
                  <motion.div
                    key="otp-body"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="px-8 pb-8 space-y-5"
                  >
                    <OtpInput
                      value={otp}
                      onChange={(v) => {
                        setOtp(v);
                        setError("");
                      }}
                      disabled={loading}
                    />

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive text-center"
                      >
                        {error}
                      </motion.p>
                    )}

                    <Button
                      onClick={handleVerify}
                      disabled={loading || otp.length < OTP_LENGTH}
                      className="w-full h-14 bg-foreground hover:bg-foreground/90 text-background rounded-2xl font-medium text-base shadow-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          در حال تأیید...
                        </>
                      ) : (
                        "تأیید کد"
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      {canResend ? (
                        <button
                          onClick={handleResend}
                          className="text-cobalt font-medium hover:opacity-80 transition-opacity"
                        >
                          ارسال مجدد کد
                        </button>
                      ) : (
                        <>
                          <span>ارسال مجدد در</span>
                          <Countdown
                            key={resendKey}
                            seconds={RESEND_SECONDS}
                            onDone={() => setCanResend(true)}
                          />
                        </>
                      )}
                      <span className="text-border">·</span>
                      <button
                        onClick={() => {
                          setStep("phone");
                          setOtp("");
                          setError("");
                        }}
                        className="hover:text-foreground transition-colors"
                      >
                        تغییر شماره
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
