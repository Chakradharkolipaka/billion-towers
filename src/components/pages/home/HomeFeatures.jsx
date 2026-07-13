import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { features, featuresSection } from '../../../data/homeSections';
import { containerVariants, itemVariants } from './homeMotion';

/** Outline icons — warm orange per product reference */
const featureIconClass =
  'h-7 w-7 shrink-0 text-orange-400 sm:h-8 sm:w-8';

const HomeFeatures = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <motion.div
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div className="mb-12 text-center md:mb-14" variants={itemVariants}>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            {featuresSection.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            {featuresSection.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 xl:gap-5">
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={itemVariants}
              className="group flex items-start gap-4 rounded-2xl border border-white/[0.1] bg-brand-bg-panel/45 p-5 shadow-glass backdrop-blur-sm transition-colors hover:border-orange-400/35 hover:bg-brand-bg-panel/60 sm:gap-4 sm:p-5"
              whileHover={reduceMotion ? undefined : { y: -2 }}
            >
              <feature.icon className={featureIconClass} strokeWidth={1.35} aria-hidden />
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-base font-bold leading-snug text-white sm:text-[1.05rem]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-secondary">{feature.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HomeFeatures;
