import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Zap,
  Scale,
  ChevronRight,
} from "lucide-react";
import { pageData } from "../../data/staticPages";
import { containerVariants, itemVariants } from "./home/homeMotion";

const RiskDisclosure = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const page = pageData["risk-disclosure"];

  const riskIcons = [AlertTriangle, TrendingDown, DollarSign, Zap, Scale];

  const sections = (page?.sections ?? []).map((section, index) => ({
    icon: riskIcons[index] ?? AlertTriangle,
    color: [
      "text-red-400",
      "text-orange-400",
      "text-yellow-400",
      "text-pink-400",
      "text-purple-400",
    ][index],
    bgColor: [
      "from-red-500/10",
      "from-orange-400/10",
      "from-yellow-400/10",
      "from-pink-400/10",
      "from-purple-400/10",
    ][index],
    accent: [
      "border-red-400/20",
      "border-orange-400/20",
      "border-yellow-400/20",
      "border-pink-400/20",
      "border-purple-400/20",
    ][index],
    ...section,
  }));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <motion.section
        className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-orange-500/8 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <motion.div variants={itemVariants}>
            <p className="text-sm uppercase tracking-[0.32em] text-red-400/80">
              {page?.eyebrow ?? "Risk Disclosure"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {page?.title ?? "Understand the risks"}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
              {page?.subtitle ?? "Understand the risks before investing."}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
              {page?.description ?? "Real estate investing carries risks."}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-4 rounded-[2.5rem] border border-white/[0.08] bg-brand-bg-panel/60 p-8 shadow-glass backdrop-blur-xl"
          >
            <div className="text-sm uppercase tracking-[0.35em] text-brand-ink-secondary/80">
              Risk at a glance
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-brand-ink-secondary/70">
                      Primary exposure
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      Market volatility
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </div>
              <div className="rounded-3xl bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-brand-ink-secondary/70">
                      Liquidity profile
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      Secondary market depth
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-orange-400" />
                </div>
              </div>
              <div className="rounded-3xl bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-brand-ink-secondary/70">
                      Operational risk
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      Management execution
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-pink-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.heading}
              className={`group overflow-hidden rounded-[2rem] border ${section.accent} bg-brand-bg-panel/55 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-brand-bg-panel/80`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-6 text-left"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4 md:gap-5">
                    <div
                      className={`rounded-2xl bg-gradient-to-br ${section.bgColor} to-transparent p-4`}
                    >
                      <section.icon className={`h-6 w-6 ${section.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white md:text-2xl">
                        {section.heading}
                      </h3>
                      {section.text && (
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-ink-secondary">
                          {section.text}
                        </p>
                      )}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center rounded-full bg-white/5 p-3 text-white/70 transition group-hover:bg-white/10"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.div>
                </div>
              </button>

              {openIndex === index && (
                <motion.div
                  className="border-t border-white/[0.06] px-6 py-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  {section.items && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {section.items.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/[0.06] bg-black/15 p-4"
                        >
                          <p className="text-sm leading-relaxed text-white/90">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}

          {page?.callout && (
            <motion.div
              className="relative overflow-hidden rounded-[2rem] border border-red-400/20 bg-gradient-to-br from-brand-bg-panel/90 to-red-500/10 p-8 sm:p-12"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div className="pointer-events-none absolute -right-36 -top-28 h-56 w-56 rounded-full bg-red-500/10 blur-3xl" />

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
                <div>
                  <div className="inline-flex rounded-2xl bg-red-400/10 p-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    {page.callout.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-ink-secondary">
                    {page.callout.text}
                  </p>
                </div>
                <div className="flex items-center justify-start lg:justify-end">
                  <a
                    href={page.callout.buttonLink}
                    className="inline-flex gap-2 rounded-full bg-red-500/20 border border-red-400/30 px-8 py-3 font-semibold text-red-400 transition hover:bg-red-500/30 hover:border-red-400/50"
                  >
                    {page.callout.buttonText}
                    <span>→</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskDisclosure;
