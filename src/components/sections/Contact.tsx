import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Linkedin, MapPin, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { bio } from "@/data/bio";

// ── Form schema ─────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

// ── EmailJS config — replace with your actual IDs ───────────────────────────
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

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
    // If EmailJS is not configured, fall back to mailto
    if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
      window.location.href = `mailto:${bio.email}?subject=Hey ${bio.firstName}&body=${encodeURIComponent(data.message)}`;
      toast.success("Opening email client...", {
        style: { background: "#0d1332", border: "1px solid rgba(0,245,255,0.3)", color: "#e2e8f0" },
      });
      return;
    }

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
    } catch {
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
          <Card padding="p-7">
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center gap-3"
              >
                <CheckCircle size={48} className="text-neon-cyan" />
                <p className="text-slate-200 font-semibold font-display text-lg">
                  Signal Received
                </p>
                <p className="text-slate-400 text-sm">
                  I'll get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs text-neon-cyan underline mt-2 font-mono"
                >
                  Send another transmission
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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
              </form>
            )}
          </Card>
        </AnimatedSection>

        {/* Sidebar */}
        <AnimatedSection className="md:col-span-2 flex flex-col gap-5" delay={0.1}>
          {/* Recruiter blurb */}
          <Card padding="p-5">
            <p className="text-xs font-mono text-neon-cyan/70 uppercase tracking-widest mb-3">
              For Recruiters
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">{bio.recruiterBlurb}</p>
          </Card>

          {/* Direct channels */}
          <Card padding="p-5">
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
          </Card>

          {/* System status */}
          <Card padding="p-5">
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
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
}
