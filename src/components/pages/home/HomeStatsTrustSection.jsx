import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DollarSign, Shield, TrendingUp, UserRound } from 'lucide-react';
import { stats, statsIntro, statsTrustEyebrow, trustPoints } from '../../../data/homeSections';
import { containerVariants, itemVariants } from './homeMotion';

function StatLeadingGraphic({ stat }) {
  const className = 'h-10 w-10 shrink-0 text-brand-cyan sm:h-11 sm:w-11';
  const stroke = 1.35;

  if (stat.leading === 'dollar-up') {
    return (
      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center text-brand-cyan sm:h-11 sm:w-11" aria-hidden>
        <DollarSign className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={stroke} />
        <TrendingUp className="absolute -right-0.5 -top-0.5 h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={2.25} />
      </span>
    );
  }

  if (stat.leading === 'user-shield') {
    return (
      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center text-brand-cyan sm:h-11 sm:w-11" aria-hidden>
        <UserRound className="h-9 w-9 sm:h-10 sm:w-10" strokeWidth={stroke} />
        <Shield className="absolute -bottom-0.5 -right-0.5 h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5" strokeWidth={2} />
      </span>
    );
  }

  const Icon = stat.icon;
  return <Icon className={className} strokeWidth={stroke} aria-hidden />;
}

const HomeStatsTrustSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <motion.div
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-bg-panel/50 shadow-glass backdrop-blur-md sm:rounded-3xl">
          <div className="px-5 py-8 sm:px-8 sm:py-9 md:px-10 md:py-10">
            <motion.p
              variants={itemVariants}
              className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold-light sm:text-xs"
            >
              {statsTrustEyebrow}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-6 overflow-hidden rounded-xl border border-white/[0.06] bg-brand-bg-base/35 sm:mt-7"
            >
              <div className="flex flex-col divide-y divide-white/[0.07] md:flex-row md:divide-x md:divide-y-0">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex flex-1 flex-row items-center gap-4 px-4 py-5 sm:gap-5 sm:px-5 sm:py-6 md:py-6"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.04 }}
                    whileHover={reduceMotion ? undefined : { y: -1 }}
                  >
                    <StatLeadingGraphic stat={stat} />
                    <div className="min-w-0 text-left">
                      <div className="text-xl font-bold tabular-nums tracking-tight text-brand-cyan sm:text-2xl md:text-[1.65rem]">
                        {stat.value}
                      </div>
                      <div className="mt-0.5 text-xs leading-snug text-brand-ink-secondary sm:text-sm">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-6 grid auto-rows-fr gap-4 sm:mt-7 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5"
            >
              {trustPoints.map((item) => (
                <motion.article
                  key={item.title}
                  variants={itemVariants}
                  className="flex h-full flex-col items-center rounded-2xl border border-white/[0.08] bg-brand-bg-raised/40 px-4 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-colors hover:border-white/[0.12] sm:px-5 sm:py-7"
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                >
                  <item.icon
                    className="mb-4 h-11 w-11 shrink-0 text-brand-gold sm:mb-5 sm:h-[3.25rem] sm:w-[3.25rem]"
                    strokeWidth={1.12}
                    aria-hidden
                  />
                  <h3 className="mb-2 text-sm font-bold text-white sm:text-base">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-brand-ink-secondary sm:text-sm">{item.body}</p>
                </motion.article>
              ))}
            </motion.div>

            <p className="mx-auto mt-6 max-w-3xl text-center text-[11px] leading-relaxed text-brand-ink-muted sm:mt-7 sm:text-xs">
              {statsIntro}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeStatsTrustSection;
