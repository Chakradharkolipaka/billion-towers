import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target,
  Users,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Heart,
  Building2,
  DollarSign,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { containerVariants, itemVariants } from './home/homeMotion';

const stats = [
  { icon: Users, value: '10,000+', label: 'Active Investors' },
  { icon: Building2, value: '500+', label: 'Properties' },
  { icon: DollarSign, value: '$50M+', label: 'Total Value' },
  { icon: TrendingUp, value: '8.5%', label: 'Average ROI' },
];

const values = [
  {
    icon: Shield,
    title: 'Security first',
    description:
      'Your investments are protected by disciplined operations, clear disclosures, and secure transaction flows.',
  },
  {
    icon: Globe,
    title: 'Global access',
    description: 'Discover curated exposure to real estate economics from anywhere—with transparent rails.',
  },
  {
    icon: Zap,
    title: 'Liquidity focus',
    description: 'Buy and sell on the marketplace when listings support secondary activity and your goals change.',
  },
  {
    icon: Heart,
    title: 'Community driven',
    description: 'Built for investors who want institutional clarity without losing accessibility.',
  },
];

const team = [
  {
    name: 'Alex Chen',
    role: 'CEO & Founder',
    initials: 'AC',
    description: 'Former Goldman Sachs VP with 15+ years in real estate investment.',
  },
  {
    name: 'Sarah Johnson',
    role: 'CTO',
    initials: 'SJ',
    description: 'Blockchain expert and former Google engineer leading our tech innovation.',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Head of Real Estate',
    initials: 'MR',
    description: 'Licensed real estate broker with $2B+ in property transactions.',
  },
  {
    name: 'Emily Watson',
    role: 'Head of Operations',
    initials: 'EW',
    description: 'Former McKinsey consultant specializing in financial operations.',
  },
];

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero */}
      <motion.section
        className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-brand-cyan/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-brand-gold/6 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <motion.h1
            className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.25rem]"
            variants={itemVariants}
          >
            About <span className="text-brand-gold-light">Billion Towers</span>
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg"
            variants={itemVariants}
          >
            We are building a calmer, more transparent on-ramp to real estate exposure—pairing property economics
            with clear mechanics so you can size risk before you size checks.
          </motion.p>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        className="border-b border-white/[0.06] px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-bg-panel/45 shadow-glass backdrop-blur-md sm:rounded-3xl">
            <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.07] border-white/[0.06] md:grid-cols-4 md:divide-y-0">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center gap-3 px-4 py-8 text-center sm:py-10"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <stat.icon className="h-9 w-9 text-brand-cyan sm:h-10 sm:w-10" strokeWidth={1.35} aria-hidden />
                  <div className="text-2xl font-bold tabular-nums text-brand-cyan sm:text-3xl">{stat.value}</div>
                  <div className="text-xs text-brand-ink-secondary sm:text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Mission + vision */}
      <motion.section
        className="border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div variants={itemVariants}>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Our <span className="text-brand-gold-light">mission</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
                To open serious real estate participation with smaller tickets, clearer economics, and workflows
                that feel closer to a portfolio product than a hype cycle.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Fractional exposure to curated property economics',
                  'Transparent rails and fee language you can audit',
                  'Operational support aligned with distributions',
                  'Liquidity where marketplace rules allow trading',
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    className="flex gap-3 text-sm text-brand-ink-secondary sm:text-base"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                  >
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-cyan" strokeWidth={1.75} aria-hidden />
                    <span className="text-white/90">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-2xl border border-white/[0.1] bg-brand-bg-panel/50 p-8 shadow-glass backdrop-blur-md sm:p-10"
            >
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-brand-cyan/25 bg-brand-cyan/10">
                  <Target className="h-7 w-7 text-brand-cyan" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">Our vision</h3>
                <p className="mt-4 text-sm leading-relaxed text-brand-ink-secondary sm:text-base">
                  A market where everyday investors can build durable wealth through real assets—with the same
                  rigor in disclosures and operations that institutions expect.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section
        className="border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div className="mb-12 text-center md:mb-14" variants={itemVariants}>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our <span className="text-brand-gold-light">values</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-brand-ink-secondary sm:text-lg">
              Principles we hold constant as the product, listings, and regulatory context evolve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {values.map((value) => (
              <motion.article
                key={value.title}
                variants={itemVariants}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-brand-bg-panel/45 p-6 shadow-glass backdrop-blur-sm transition-colors hover:border-brand-cyan/25"
                whileHover={{ y: -2 }}
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/10">
                  <value.icon className="h-5 w-5 text-brand-gold-light" strokeWidth={1.35} aria-hidden />
                </span>
                <h3 className="text-lg font-bold text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-secondary">{value.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team */}
      <motion.section
        className="border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div className="mb-12 text-center md:mb-14" variants={itemVariants}>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Meet our <span className="text-brand-gold-light">team</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-brand-ink-secondary sm:text-lg">
              Operators and builders combining real estate, capital markets, and product engineering.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {team.map((member) => (
              <motion.article
                key={member.name}
                variants={itemVariants}
                className="rounded-2xl border border-white/[0.08] bg-brand-bg-panel/45 p-6 text-center shadow-glass backdrop-blur-sm transition-colors hover:border-white/[0.12]"
                whileHover={{ y: -2 }}
              >
                <div
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-brand-cyan/25 bg-gradient-to-br from-brand-bg-raised to-brand-bg-panel text-lg font-bold text-brand-cyan"
                  aria-hidden
                >
                  {member.initials}
                </div>
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-brand-cyan">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-secondary">{member.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-4xl">
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-brand-bg-panel/50 px-6 py-10 text-center shadow-glass backdrop-blur-md sm:rounded-3xl sm:px-10 sm:py-12"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-brand-gold/5" aria-hidden />
            <div className="relative z-10">
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Ready to explore the <span className="text-brand-gold-light">marketplace</span>?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink-secondary sm:text-base">
                Preview listings, compare yields, and walk the journey end-to-end—starting with the economics, not
                the noise.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/marketplace"
                    className="btn btn-hero-primary inline-flex min-h-[48px] w-full items-center justify-center gap-2 sm:w-auto"
                  >
                    Browse marketplace
                    <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/faq"
                    className="btn btn-hero-secondary !text-brand-cyan inline-flex min-h-[48px] w-full items-center justify-center px-8 hover:!text-brand-cyan-mint sm:w-auto"
                  >
                    Read FAQ
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
