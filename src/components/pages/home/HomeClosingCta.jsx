import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ctaBanner from '../../../assets/images/cta-banner.png';
import { closingCta } from '../../../data/homeSections';
import { containerVariants, itemVariants } from './homeMotion';

const HomeClosingCta = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <motion.div
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl border border-brand-cyan/25 bg-brand-bg-base shadow-[0_0_0_1px_rgba(0,229,255,0.06)] sm:rounded-3xl"
        >
          <div className="flex flex-col lg:grid lg:min-h-[260px] lg:grid-cols-[13fr_7fr] xl:min-h-[280px] lg:items-stretch">
            <div className="relative z-10 order-2 flex min-w-0 flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:order-1 lg:py-10 lg:pl-10 lg:pr-8 xl:pr-10">
              <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[1.85rem] lg:leading-snug xl:text-4xl">
                {closingCta.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base lg:max-w-none">
                {closingCta.subtitle}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Link
                    to="/marketplace"
                    className="btn btn-hero-primary inline-flex min-h-[48px] w-full items-center justify-center gap-2 sm:w-auto"
                  >
                    {closingCta.primaryLabel}
                    <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Link
                    to="/contact"
                    className="btn btn-hero-secondary !text-brand-cyan inline-flex min-h-[48px] w-full items-center justify-center gap-2 border-brand-cyan/55 hover:!text-brand-cyan-mint sm:w-auto"
                  >
                    {closingCta.secondaryLabel}
                    <ArrowRight className="h-5 w-5 shrink-0 text-brand-cyan" strokeWidth={2.25} aria-hidden />
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="relative order-1 min-h-[140px] min-w-0 w-full overflow-hidden sm:min-h-[160px] lg:order-2 lg:min-h-[260px] xl:min-h-[280px]">
              <img
                src={ctaBanner}
                alt=""
                className="h-full w-full object-cover object-[50%_56%] sm:max-h-[200px] sm:object-[55%_58%] lg:absolute lg:inset-y-0 lg:-left-[10%] lg:right-0 lg:h-full lg:w-[118%] lg:max-w-none lg:object-cover lg:object-[62%_48%] lg:brightness-[1.12] lg:contrast-[1.04] xl:object-[58%_46%]"
                width={1023}
                height={251}
                loading="lazy"
                decoding="async"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-brand-bg-base/15 to-brand-bg-base lg:bg-gradient-to-r lg:from-brand-bg-base lg:from-[0%] lg:via-brand-bg-base/70 lg:via-[20%] lg:to-transparent lg:to-[52%]"
                aria-hidden
              />
            </div>
          </div>
        </motion.div>

        <motion.p
          className="mt-6 text-center text-sm text-brand-ink-muted"
          variants={itemVariants}
        >
          Questions first?{' '}
          <Link to="/faq" className="text-brand-cyan underline-offset-2 hover:text-brand-cyan-mint hover:underline">
            Read the FAQ
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HomeClosingCta;
