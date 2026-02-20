import { useState } from "react";
import { AnimatedSection } from "../ui/AnimatedSection.jsx";
import { GlassCard } from "../ui/GlassCard.jsx";
import { SectionHeader } from "../ui/SectionHeader.jsx";
import { CTAButton } from "../ui/CTAButton.jsx";
import { meta } from "../../data/meta.js";

// To use the contact form, create a free account at https://formspree.io
// and replace YOUR_FORM_ID below with your actual Formspree form ID.
// OR leave it as-is — clicking submit will open a mailto: draft.
const FORMSPREE_ID = "YOUR_FORM_ID"; // e.g. "xbjnvkqr"

export function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (FORMSPREE_ID === "YOUR_FORM_ID") {
      // Fallback: open mailto draft
      window.location.href = `mailto:${meta.email}?subject=Hey ${meta.firstName}&body=${encodeURIComponent(form.message)}`;
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="max-w-5xl mx-auto px-6 py-24">
      <AnimatedSection>
        <SectionHeader label="Contact" />
      </AnimatedSection>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Form */}
        <AnimatedSection className="md:col-span-3" delay={0.05}>
          <GlassCard padding="p-7">
            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <span className="text-4xl">✅</span>
                <p className="text-slate-200 font-semibold">Message received.</p>
                <p className="text-slate-400 text-sm">I'll get back to you shortly.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs text-accent-blue underline mt-2"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-mono">Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-accent-blue/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-mono">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-accent-blue/50 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-500 font-mono">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="What's on your mind?"
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-accent-blue/50 transition-colors resize-none"
                  />
                </div>
                {status === "error" && (
                  <p className="text-xs text-red-400">Something went wrong — try emailing directly.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary justify-center mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </GlassCard>
        </AnimatedSection>

        {/* Sidebar */}
        <AnimatedSection className="md:col-span-2 flex flex-col gap-5" delay={0.1}>
          <GlassCard padding="p-5">
            <p className="text-xs font-mono text-accent-cyan/70 uppercase tracking-widest mb-3">
              For Recruiters
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {meta.recruiterBlurb}
            </p>
          </GlassCard>

          <GlassCard padding="p-5">
            <p className="text-xs font-mono text-accent-cyan/70 uppercase tracking-widest mb-4">
              Direct
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${meta.email}`}
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-accent-blue transition-colors"
              >
                <span>✉️</span>
                <span className="truncate">{meta.email}</span>
              </a>
              {meta.linkedinUrl && (
                <a
                  href={meta.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-accent-blue transition-colors"
                >
                  <span>🔗</span>
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </GlassCard>

          {meta.calendlyUrl && meta.calendlyUrl !== "https://calendly.com/YOUR_HANDLE" && (
            <CTAButton
              label="Book 30 min"
              href={meta.calendlyUrl}
              variant="secondary"
              icon="📅"
            />
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
