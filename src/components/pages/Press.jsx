import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, Megaphone, Download, Mail } from "lucide-react";
import { containerVariants, itemVariants } from "./home/homeMotion";

const Press = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <motion.section
        className="border-b border-white/[0.06] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative mx-auto max-w-7xl text-center">
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Media resources for coverage of Billion Towers.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            Download brand assets, review our latest announcements, and connect
            with our communications team.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="px-4 py-16 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-7xl space-y-12">
          <motion.div
            className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-semibold text-white">
              Latest announcements
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Marketplace launch expands access",
                  summary:
                    "Billion Towers opens its first global fractional property marketplace to qualified investors.",
                },
                {
                  title: "New compliance framework released",
                  summary:
                    "We publish updated investor protections, disclosure standards, and reporting practices.",
                },
                {
                  title: "Investor demand reaches a new milestone",
                  summary:
                    "Platform engagement grows as asset allocations expand across geographies.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/[0.08] bg-dark-900/40 p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-ink-secondary">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]"
            variants={itemVariants}
          >
            <div className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm">
              <h2 className="text-3xl font-semibold text-white">Media kit</h2>
              <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
                Access logos, product imagery, leadership bios, and brand
                guidelines for editorial and broadcast coverage.
              </p>
              <ul className="mt-6 space-y-4 text-brand-ink-secondary">
                {[
                  "Brand assets pack",
                  "Executive bios and headshots",
                  "Product summary and platform metrics",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Download className="mt-1 h-5 w-5 text-brand-cyan" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cyan/10 text-brand-cyan">
                <Megaphone className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold text-white">
                Press contact
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
                For media inquiries, story ideas, or interview requests, contact
                our communications team.
              </p>
              <a
                href="mailto:press@billiontowers.com"
                className="mt-6 inline-flex rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-cyan-mid"
              >
                Email press@billiontowers.com
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Press;
