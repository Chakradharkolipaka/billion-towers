import React, { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { steps, stepsSection } from '../../../data/homeSections';
import { containerVariants, itemVariants } from './homeMotion';

function StepConnector() {
  return (
    <div
      className="hidden min-h-[1px] shrink-0 flex-col justify-center px-1 lg:flex lg:w-8 xl:w-12"
      aria-hidden
    >
      <div className="flex items-center">
        <div className="h-0 min-w-0 flex-1 border-t border-dotted border-brand-cyan" />
        <ChevronRight className="h-4 w-4 shrink-0 text-brand-cyan" strokeWidth={2.25} />
      </div>
    </div>
  );
}

const HomeSteps = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <motion.div
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div className="mb-14 text-center md:mb-16" variants={itemVariants}>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            {stepsSection.title}{' '}
            <span className="text-brand-gold-light">{stepsSection.titleAccent}</span>{' '}
            <span className="text-white">{stepsSection.titleSuffix}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-brand-ink-secondary sm:text-lg">
            {stepsSection.subtitle}
          </p>
        </motion.div>

        <div className="flex flex-col items-stretch lg:flex-row lg:items-center lg:justify-between">
          {steps.map((step, index) => (
            <Fragment key={step.title}>
              <motion.div
                variants={itemVariants}
                className="group flex min-w-0 flex-1 flex-col items-center text-center"
                whileHover={reduceMotion ? undefined : { y: -4 }}
              >
                <div className="relative mb-6 flex justify-center">
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[7.5rem] w-[7.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-cyan/12 blur-2xl"
                    aria-hidden
                  />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
                    <step.icon
                      className="relative z-10 h-9 w-9 text-brand-gold"
                      strokeWidth={1.15}
                      aria-hidden
                    />
                  </div>
                  <div className="absolute -left-0.5 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-cyan text-sm font-bold text-white shadow-[0_0_18px_rgba(0,229,255,0.55)]">
                    {index + 1}
                  </div>
                </div>
                <h3 className="mb-2 max-w-[14rem] text-base font-bold text-white sm:text-lg">{step.title}</h3>
                <p className="max-w-[15rem] text-sm leading-relaxed text-brand-ink-secondary sm:text-[0.9375rem]">
                  {step.description}
                </p>
              </motion.div>

              {index < steps.length - 1 && (
                <>
                  <div className="flex justify-center py-3 lg:hidden" aria-hidden>
                    <ChevronDown className="h-5 w-5 text-brand-cyan/85" strokeWidth={2.25} />
                  </div>
                  <StepConnector />
                </>
              )}
            </Fragment>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HomeSteps;
