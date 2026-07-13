import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';
import vrmobile from '../../../assets/images/vrmobile.png';
import { mechanicsItems, mechanicsSection } from '../../../data/homeSections';
import { containerVariants, itemVariants } from './homeMotion';

const HomeMechanics = () => {
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
            <span className="text-white">{mechanicsSection.title}</span>{' '}
            <span className="text-brand-gold-light">{mechanicsSection.titleAccent}</span>{' '}
            <span className="text-white">{mechanicsSection.titleSuffix}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            {mechanicsSection.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:items-center lg:gap-16 xl:gap-20">
          <motion.div className="space-y-4 sm:space-y-5" variants={itemVariants}>
            {mechanicsItems.map((item, index) => (
              <motion.article
                key={item.title}
                variants={itemVariants}
                className="group relative flex gap-4 rounded-2xl border border-white/[0.08] bg-brand-bg-panel/50 p-4 shadow-glass backdrop-blur-md transition-colors hover:border-brand-cyan/25 sm:gap-5 sm:p-5"
                whileHover={reduceMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.05 }}
              >
                <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/10 sm:h-12 sm:w-12">
                  <item.icon className="h-5 w-5 text-brand-gold-light sm:h-6 sm:w-6" strokeWidth={1.35} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white sm:text-lg">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-secondary sm:text-[0.9375rem]">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:justify-self-end"
            variants={itemVariants}
            whileHover={reduceMotion ? undefined : { scale: 1.01 }}
          >
            <div className="glass-panel relative overflow-hidden rounded-2xl border border-white/[0.1] p-1 shadow-glass sm:rounded-3xl sm:p-1.5">
              <img
                src={vrmobile}
                alt="Billion Towers mobile experience preview"
                className="w-full rounded-xl sm:rounded-2xl"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-brand-bg-base/80 via-transparent to-brand-cyan/[0.06] sm:rounded-2xl" />
            </div>

            {!reduceMotion && (
              <>
                <motion.div
                  className="absolute -right-1 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-brand-cyan/35 bg-brand-bg-panel/80 shadow-glass backdrop-blur-md sm:right-0 sm:top-8 sm:h-12 sm:w-12"
                  animate={{ y: [-3, 3] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  aria-hidden
                >
                  <Sparkles className="h-5 w-5 text-brand-cyan sm:h-5 sm:w-5" strokeWidth={1.5} />
                </motion.div>
                <motion.div
                  className="absolute bottom-8 left-0 flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/35 bg-brand-bg-panel/80 shadow-glass backdrop-blur-md sm:bottom-10 sm:left-2 sm:h-12 sm:w-12"
                  animate={{ y: [3, -3] }}
                  transition={{ duration: 2.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  aria-hidden
                >
                  <Shield className="h-5 w-5 text-brand-gold-light sm:h-5 sm:w-5" strokeWidth={1.5} />
                </motion.div>
              </>
            )}
            {reduceMotion && (
              <>
                <div
                  className="absolute -right-1 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-brand-cyan/35 bg-brand-bg-panel/80 backdrop-blur-md sm:right-0 sm:top-8"
                  aria-hidden
                >
                  <Sparkles className="h-5 w-5 text-brand-cyan" strokeWidth={1.5} />
                </div>
                <div
                  className="absolute bottom-8 left-0 flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/35 bg-brand-bg-panel/80 backdrop-blur-md sm:bottom-10 sm:left-2"
                  aria-hidden
                >
                  <Shield className="h-5 w-5 text-brand-gold-light" strokeWidth={1.5} />
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeMechanics;
