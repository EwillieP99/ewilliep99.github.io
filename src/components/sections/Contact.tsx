import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Linkedin, MapPin, CheckCircle, Radio, Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HoloCard } from "@/components/ui/HoloCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { bio } from "@/data/bio";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// UPLINK TERMINAL — Contact form with signal strength + transmission FX
// ═══════════════════════════════════════════════════════════════════════════════

// ── Form schema ─────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

// ── EmailJS config — replace with your actual IDs ───────────────────────────
const EMAILJS_SERVICE_ID = "service_boc1dxx";
const EMAILJS_TEMPLATE_ID = "template_n35vsjo";
const EMAILJS_PUBLIC_KEY = "WmdpVeh2gIDlOHFzO";

/** Animated signal strength meter */
function SignalStrengthMeter({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <Radio size={12} className={cn("transition-colors", active ? "text-neon-cyan animate-pulse" : "text-slate-600")} />
      <div className="flex items-end gap-0.5">
        {[1, 2, 3, 4, 5].map((bar) => (
          <motion.div
            key={bar}
            className="w-1 rounded-full"
            style={{ height: 4 + bar * 2 }}
            animate={{
              backgroundColor: active
                ? bar <= 3
                  ? "rgba(0, 245, 255, 0.8)"
                  : bar <= 4
                    ? "rgba(0, 245, 255, 0.5)"
                    : "rgba(0, 245, 255, 0.3)"
                : "rgba(100, 116, 139, 0.3)",
              scaleY: active ? [1, 1.3, 1] : 1,
            }}
            transition={active ? { duration: 0.4, delay: bar * 0.08, repeat: Infinity, repeatType: "reverse" } : {}}
          />
        ))}
      </div>
      <span className={cn("text-[10px] font-mono", active ? "text-neon-cyan" : "text-slate-600")}>
        {active ? "TRANSMITTING" : "STANDBY"}
      </span>
    </div>
  );
}

/** Neon confetti particles for transmission success */
function TransmissionParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: "50%",
            backgroundColor: ["#00f5ff", "#a855f7", "#f472b6", "#22c55e"][i % 4],
            boxShadow: `0 0 4px ${["rgba(0,245,255,0.6)", "rgba(168,85,247,0.6)", "rgba(244,114,182,0.6)", "rgba(34,197,94,0.6)"][i % 4]}`,
          }}
          initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
          animate={{
            y: (Math.random() - 0.5) * 300,
            x: (Math.random() - 0.5) * 200,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 1.2 + Math.random() * 0.8,
            delay: Math.random() * 0.3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/** Full-screen transmission success overlay */
function TransmissionSuccess({ onDismiss }: { onDismiss: () => void }) {
  const [showParticles, setShowParticles] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex flex-col items-center justify-center py-16 text-center gap-4"
    >
      {showParticles && <TransmissionParticles />}

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <CheckCircle size={56} className="text-neon-cyan" style={{ filter: "drop-shadow(0 0 20px rgba(0,245,255,0.5))" }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-bold text-neon-cyan font-display text-glow-cyan mb-1">
          TRANSMISSION SENT
        </h3>
        <p className="text-sm text-slate-400 font-mono">
          Signal received · Response incoming &lt; 24h
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onDismiss}
        className="text-xs text-neon-cyan/60 hover:text-neon-cyan underline mt-2 font-mono transition-colors"
      >
        Send another transmission
      </motion.button>
    </motion.div>
  );
}

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setStatus("sending");
    try {
      // Dynamic import to keep EmailJS out of the main bundle
      const emailjs = await import("@emailjs/browser");
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          message: data.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("sent");
      reset();
      toast.success("Message transmitted successfully!", {
        style: { background: "#0d1332", border: "1px solid rgba(0,245,255,0.3)", color: "#e2e8f0" },
      });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      toast.error("Transmission failed. Try email directly.", {
        style: { background: "#0d1332", border: "1px solid rgba(244,114,182,0.3)", color: "#e2e8f0" },
      });
    }
  };

  const inputClasses =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 font-mono focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_12px_rgba(0,245,255,0.1)] transition-all";

  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 py-24" aria-label="Contact section">
      <Toaster position="top-right" />

      <AnimatedSection>
        <SectionHeader
          codename="// 06"
          label="Uplink Terminal"
          sub="Send a signal — I reply fast"
        />
      </AnimatedSection>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Form */}
        <AnimatedSection className="md:col-span-3" delay={0.05}>
          <HoloCard padding="p-7">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <TransmissionSuccess
                  key="success"
                  onDismiss={() => setStatus("idle")}
                />
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                  noValidate
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Signal strength meter */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                      Uplink Interface v2.0
                    </span>
                    <SignalStrengthMeter active={status === "sending"} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs text-slate-500 font-mono">
                        Name
                      </label>
                      <input
                        id="name"
                        {...register("name")}
                        placeholder="Your name"
                        className={inputClasses}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p className="text-xs text-neon-pink" role="alert">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs text-slate-500 font-mono">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        className={inputClasses}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="text-xs text-neon-pink" role="alert">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs text-slate-500 font-mono">
                      Message
                    </label>
                    <textarea
                      id="message"
                      {...register("message")}
                      rows={5}
                      placeholder="What's on your mind?"
                      className={`${inputClasses} resize-none`}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className="text-xs text-neon-pink" role="alert">{errors.message.message}</p>
                    )}
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-neon-pink font-mono">
                      Transmission failed — try emailing directly.
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="neon"
                    disabled={status === "sending"}
                    icon={<Send size={16} />}
                    className="justify-center mt-1"
                  >
                    {status === "sending" ? "Transmitting..." : "Send Transmission"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </HoloCard>
        </AnimatedSection>

        {/* Sidebar */}
        <AnimatedSection className="md:col-span-2 flex flex-col gap-5" delay={0.1}>
          {/* Recruiter blurb */}
          <HoloCard padding="p-5" glowColor="168, 85, 247">
            <p className="text-xs font-mono text-neon-cyan/70 uppercase tracking-widest mb-3">
              For Recruiters
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">{bio.recruiterBlurb}</p>
          </HoloCard>

          {/* Direct channels */}
          <HoloCard padding="p-5">
            <p className="text-xs font-mono text-neon-cyan/70 uppercase tracking-widest mb-4">
              Direct Channels
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${bio.email}`}
                className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-neon-cyan transition-colors"
              >
                <Mail size={16} className="text-neon-cyan/60" />
                <span className="truncate font-mono text-xs">{bio.email}</span>
              </a>
              {bio.linkedinUrl && (
                <a
                  href={bio.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-neon-cyan transition-colors"
                >
                  <Linkedin size={16} className="text-neon-cyan/60" />
                  <span className="font-mono text-xs">LinkedIn</span>
                </a>
              )}
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <MapPin size={16} className="text-neon-cyan/60" />
                <span className="font-mono text-xs">{bio.location}</span>
              </div>
            </div>
          </HoloCard>

          {/* System status */}
          <HoloCard padding="p-5" glowColor="34, 197, 94">
            <p className="text-xs font-mono text-neon-purple/70 uppercase tracking-widest mb-3">
              System Status
            </p>
            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-[glowPulse_2s_ease-in-out_infinite]" />
                <span className="text-slate-400">Status:</span>
                <span className="text-neon-cyan">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-purple" />
                <span className="text-slate-400">Response Time:</span>
                <span className="text-neon-purple">&lt; 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green" />
                <span className="text-slate-400">Open to:</span>
                <span className="text-neon-green">Opportunities</span>
              </div>
            </div>
          </HoloCard>

          {/* Resume download */}
          <a
            href={bio.resumePdf}
            download
            className="btn-ghost text-xs py-3 px-4 flex items-center justify-center gap-2 w-full"
          >
            <Download size={14} />
            Download Resume (PDF)
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
