import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  trustTechnologySection,
  trustSecuritySection,
  trustVerificationSection,
  trustWalletSection,
  trustComplianceSection,
} from '../../../data/homeTrustInfrastructure';
import { containerVariants, itemVariants } from './homeMotion';

const cardClass =
  'rounded-2xl border border-white/[0.08] bg-brand-bg-panel/45 p-5 shadow-glass backdrop-blur-md transition-colors sm:p-6';

const eyebrowClass =
  'text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold-light sm:text-xs';

function SectionIntro({ eyebrow, title, titleAccent, subtitle, variants }) {
  return (
    <motion.div className="mx-auto mb-10 max-w-3xl text-center md:mb-12" variants={variants}>
      <p className={eyebrowClass}>{eyebrow}</p>
      <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[2rem] lg:leading-tight">
        <span className="text-white">{title}</span>{' '}
        <span className="text-brand-gold-light">{titleAccent}</span>
      </h3>
      <p className="mx-auto mt-4 text-base leading-relaxed text-brand-ink-secondary sm:text-lg">{subtitle}</p>
    </motion.div>
  );
}

function ChainDecor() {
  return (
    <div className="pointer-events-none relative mx-auto mb-10 h-14 max-w-md" aria-hidden>
      <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-brand-cyan/35 to-transparent" />
      <div className="relative flex items-center justify-between px-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="relative z-10 h-3.5 w-3.5 rounded-full border border-brand-cyan/45 bg-brand-bg-base/90 shadow-[0_0_12px_rgba(0,229,255,0.15)]"
          />
        ))}
      </div>
    </div>
  );
}

const HomeTrustInfrastructure = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="trust-infrastructure-heading">
      <motion.div
        className="mx-auto max-w-7xl space-y-20 md:space-y-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.header className="mx-auto max-w-3xl text-center" variants={itemVariants}>
          <p className={eyebrowClass}>Infrastructure & trust</p>
          <h2
            id="trust-infrastructure-heading"
            className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
          >
            Serious rails for <span className="text-brand-gold-light">real-world</span> portfolios
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            Chain transparency, disciplined security, and asset verification—explained the way investment platforms
            should, not whitepapers.
          </p>
        </motion.header>

        {/* Technology */}
        <div>
          <SectionIntro
            eyebrow={trustTechnologySection.eyebrow}
            title={trustTechnologySection.title}
            titleAccent={trustTechnologySection.titleAccent}
            subtitle={trustTechnologySection.subtitle}
            variants={itemVariants}
          />
          <motion.div variants={itemVariants}>
            <ChainDecor />
          </motion.div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {trustTechnologySection.pillars.map((item, index) => (
              <motion.article
                key={item.title}
                variants={itemVariants}
                className={`${cardClass} hover:border-brand-cyan/22`}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.03 }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-brand-cyan/20 bg-brand-cyan/8">
                  <item.icon className="h-5 w-5 text-brand-cyan" strokeWidth={1.35} aria-hidden />
                </div>
                <h4 className="text-base font-bold text-white sm:text-lg">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-secondary sm:text-[0.9375rem]">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="border-t border-white/[0.06] pt-16 md:pt-20">
          <SectionIntro
            eyebrow={trustSecuritySection.eyebrow}
            title={trustSecuritySection.title}
            titleAccent={trustSecuritySection.titleAccent}
            subtitle={trustSecuritySection.subtitle}
            variants={itemVariants}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
            {trustSecuritySection.items.map((item, index) => (
              <motion.article
                key={item.title}
                variants={itemVariants}
                className={`${cardClass} hover:border-white/[0.14]`}
                whileHover={reduceMotion ? undefined : { y: -1 }}
                transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.04 }}
              >
                <div className="flex gap-4 sm:gap-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/10 sm:h-12 sm:w-12">
                    <item.icon className="h-5 w-5 text-brand-gold-light sm:h-6 sm:w-6" strokeWidth={1.35} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-white sm:text-lg">{item.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-secondary sm:text-[0.9375rem]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Verification */}
        <div className="border-t border-white/[0.06] pt-16 md:pt-20">
          <SectionIntro
            eyebrow={trustVerificationSection.eyebrow}
            title={trustVerificationSection.title}
            titleAccent={trustVerificationSection.titleAccent}
            subtitle={trustVerificationSection.subtitle}
            variants={itemVariants}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {trustVerificationSection.points.map((item, index) => (
              <motion.article
                key={item.title}
                variants={itemVariants}
                className={`${cardClass} text-center hover:border-brand-cyan/20 sm:text-left lg:text-center`}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.04 }}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.1] bg-brand-bg-base/50 sm:mx-0 lg:mx-auto">
                  <item.icon className="h-6 w-6 text-brand-cyan" strokeWidth={1.35} aria-hidden />
                </div>
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-secondary">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Wallet & ownership */}
        <div className="border-t border-white/[0.06] pt-16 md:pt-20">
          <SectionIntro
            eyebrow={trustWalletSection.eyebrow}
            title={trustWalletSection.title}
            titleAccent={trustWalletSection.titleAccent}
            subtitle={trustWalletSection.subtitle}
            variants={itemVariants}
          />
          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-bg-panel/35 shadow-glass backdrop-blur-md sm:rounded-3xl"
          >
            <ol className="grid list-none grid-cols-1 divide-y divide-white/[0.07] md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
              {trustWalletSection.steps.map((step, index) => (
                <li key={step.title} className="relative flex gap-4 p-5 sm:p-6 lg:flex-col lg:gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-xs font-bold text-brand-cyan"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2 text-brand-cyan/90">
                      <step.icon className="h-5 w-5" strokeWidth={1.35} aria-hidden />
                    </div>
                    <h4 className="text-base font-bold text-white">{step.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-secondary">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>

        {/* Compliance & transparency */}
        <div className="border-t border-white/[0.06] pt-16 md:pt-20">
          <SectionIntro
            eyebrow={trustComplianceSection.eyebrow}
            title={trustComplianceSection.title}
            titleAccent={trustComplianceSection.titleAccent}
            subtitle={trustComplianceSection.subtitle}
            variants={itemVariants}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustComplianceSection.indicators.map((item, index) => (
              <motion.article
                key={item.title}
                variants={itemVariants}
                className={`${cardClass} border-brand-gold/10 hover:border-brand-gold/25`}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.04 }}
              >
                <item.icon className="mb-3 h-6 w-6 text-brand-gold-light" strokeWidth={1.35} aria-hidden />
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-secondary">{item.description}</p>
              </motion.article>
            ))}
          </div>
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-brand-ink-muted sm:text-sm"
          >
            {trustComplianceSection.disclaimer}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeTrustInfrastructure;
