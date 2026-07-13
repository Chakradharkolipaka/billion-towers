import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, TrendingUp } from 'lucide-react';
import properties from '../../../data/properties';

const bars = [36, 52, 44, 68, 48, 58, 62, 40];

const HomeHeroVisual = () => {
  const reduceMotion = useReducedMotion();
  const preview = properties.slice(0, 3);

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      {!reduceMotion && (
        <div
          className="pointer-events-none absolute -right-8 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-brand-cyan/10 blur-3xl"
          aria-hidden
        />
      )}

      <motion.div
        className="glass-panel relative overflow-hidden rounded-2xl border border-white/10 p-5 shadow-glass sm:p-6"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15 }}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-ink-secondary">
            Platform overview
          </span>
          <span className="rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2.5 py-0.5 text-xs font-medium text-brand-gold-light">
            Live
          </span>
        </div>

        <div className="mb-6 flex h-28 items-end justify-between gap-1.5 rounded-lg bg-brand-bg-base/60 px-2 pb-2 pt-4">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-brand-bg-panel via-brand-cyan/20 to-brand-cyan/45"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        <p className="mb-3 text-xs font-medium text-brand-ink-muted">Featured product flows</p>
        <div className="space-y-2.5">
          {preview.map((p, i) => (
            <motion.div
              key={p.id}
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              animate={reduceMotion ? false : { opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-brand-bg-raised/55 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-brand-ink-secondary">
                  <MapPin className="h-3 w-3 shrink-0 text-brand-cyan/80" aria-hidden />
                  <span className="truncate">
                    {p.location?.city}, {p.location?.state}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                {p.returns ?? p.profit}%
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/platform"
            className="text-xs font-medium text-brand-cyan hover:text-brand-cyan-mint hover:underline"
          >
            Explore the platform
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeHeroVisual;
