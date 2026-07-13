import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Hexagon, Play } from "lucide-react";
import { heroCopy, heroTrustBadges } from "../../../data/homeSections";
import { containerVariants, itemVariants } from "./homeMotion";
import HomeHeroVisual from "./HomeHeroVisual";

const HomeHero = () => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-20 pt-24 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pb-28 lg:pt-32"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {!reduceMotion && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-cyan/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-gold/6 blur-3xl" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="min-w-0 text-left">
            <motion.div
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-cyan/45 bg-brand-bg-base/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-cyan sm:px-4 sm:text-xs sm:tracking-[0.18em]"
              variants={itemVariants}
            >
              <Hexagon
                className="h-3.5 w-3.5 shrink-0 text-brand-cyan sm:h-4 sm:w-4"
                aria-hidden
                strokeWidth={2}
              />
              <span>{heroCopy.badge}</span>
            </motion.div>

            <motion.h1
              className="mb-5 max-w-xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.25rem] lg:leading-[1.06] xl:text-6xl"
              variants={itemVariants}
            >
              {heroCopy.titleLine1}{" "}
              <span className="text-brand-gold-light">
                {heroCopy.titleAccent}
              </span>
            </motion.h1>

            <motion.p
              className="mb-8 max-w-prose text-base leading-relaxed text-brand-ink-secondary sm:text-lg"
              variants={itemVariants}
            >
              {heroCopy.subtitle}
            </motion.p>

            <motion.div
              className="mb-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
              variants={itemVariants}
            >
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                <Link
                  to="/marketplace"
                  className="btn btn-hero-primary min-h-[48px] sm:inline-flex"
                >
                  {heroCopy.primaryCta}
                  <ArrowRight
                    className="h-5 w-5 shrink-0"
                    aria-hidden
                    strokeWidth={2.25}
                  />
                </Link>
              </motion.div>
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                <Link
                  to="/contact"
                  className="btn btn-hero-secondary min-h-[48px] sm:inline-flex"
                >
                  <Play
                    className="h-5 w-5 shrink-0 text-white"
                    aria-hidden
                    strokeWidth={2}
                  />
                  {heroCopy.secondaryCta}
                </Link>
              </motion.div>
            </motion.div>

            <motion.ul
              className="grid gap-6 border-t border-white/[0.08] pt-8 sm:grid-cols-3 sm:gap-5 lg:gap-8"
              variants={itemVariants}
              aria-label="Trust highlights"
            >
              {heroTrustBadges.map((item) => (
                <li key={item.title} className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/8">
                    <item.icon
                      className="h-5 w-5 text-brand-gold-light"
                      aria-hidden
                      strokeWidth={1.35}
                    />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-semibold leading-snug text-white sm:text-[0.9375rem]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-brand-ink-muted sm:text-sm">
                      {item.sub}
                    </p>
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            variants={itemVariants}
            className="min-w-0 lg:justify-self-end"
          >
            <HomeHeroVisual />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HomeHero;
