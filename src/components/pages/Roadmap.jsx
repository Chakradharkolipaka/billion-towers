import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { containerVariants } from "./home/homeMotion";

const Roadmap = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const phases = [
    {
      quarter: "Q2 2026",
      phase: "Launch Phase",
      status: "In Progress",
      statusColor: "bg-brand-cyan/30 text-brand-cyan",
      bullets: [
        "Primary marketplace goes live",
        "Investor onboarding with KYC and custody workflow",
        "Initial tokenized property allocations",
        "Integration with institutional custody",
      ],
    },
    {
      quarter: "Q4 2026",
      phase: "Expansion Phase",
      status: "Planned",
      statusColor: "bg-brand-gold/20 text-brand-gold",
      bullets: [
        "Secondary trading marketplace launch",
        "Partner APIs for asset syndication",
        "Enhanced analytics and reporting",
        "Compliance automation for issuers and investors",
      ],
    },
    {
      quarter: "Q2 2027",
      phase: "Growth Phase",
      status: "Planned",
      statusColor: "bg-brand-cyan/20 text-brand-cyan-mid",
      bullets: [
        "Global sourcing and multi-asset token issuance",
        "Advanced portfolio and liquidity tools",
        "Institutional order books and custody-grade settlement",
        "Governance and risk management features",
      ],
    },
    {
      quarter: "Q4 2027",
      phase: "Maturity Phase",
      status: "Planned",
      statusColor: "bg-brand-gold/15 text-brand-gold-light",
      bullets: [
        "Multi-asset class support and cross-chain settlement",
        "Stronger compliance automation",
        "Advanced governance features",
        "Platform v2.0 architecture",
      ],
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "In Progress":
        return <CheckCircle2 className="h-5 w-5 text-brand-cyan" />;
      case "Planned":
        return <Circle className="h-5 w-5 text-brand-gold" />;
      default:
        return <Lock className="h-5 w-5 text-brand-ink-secondary" />;
    }
  };

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
            What's next for Billion Towers
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            We are building an institutional-grade tokenized real estate
            marketplace with a regulated secondary trading path, custody-first
            settlement, and partner-ready APIs.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="px-4 py-16 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-6xl">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line - desktop only */}
            <div className="absolute left-1/2 top-0 bottom-0 hidden w-1 -translate-x-1/2 lg:block">
              <div className="h-full w-full bg-gradient-to-b from-brand-cyan via-brand-gold to-transparent opacity-30" />
            </div>

            {/* Phase Cards */}
            <div className="space-y-8 lg:space-y-12">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.quarter}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="group relative"
                >
                  {/* Desktop layout - alternating sides */}
                  <div
                    className={`grid gap-6 lg:grid-cols-[1fr_60px_1fr] lg:items-center`}
                  >
                    {/* Left content - even index */}
                    <div
                      className={
                        index % 2 === 0
                          ? "lg:col-start-1 lg:text-right"
                          : "lg:col-start-3"
                      }
                    >
                      <motion.div
                        className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-brand-bg-panel/50 to-brand-bg-panel/30 p-6 shadow-glass backdrop-blur-md transition-all duration-300 hover:border-brand-cyan/30 hover:shadow-[0_0_30px_rgba(0,195,255,0.1)]"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-brand-cyan/20 text-brand-cyan font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-brand-cyan">
                              {phase.quarter}
                            </p>
                            <h3 className="text-xl font-bold text-white">
                              {phase.phase}
                            </h3>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-5 flex items-center gap-2">
                          {getStatusIcon(phase.status)}
                          <span
                            className={`text-xs font-semibold ${phase.statusColor}`}
                          >
                            {phase.status}
                          </span>
                        </div>

                        {/* Bullets */}
                        <ul className="space-y-2.5">
                          {phase.bullets.map((bullet, bulletIndex) => (
                            <motion.li
                              key={bullet}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                delay: index * 0.15 + bulletIndex * 0.05,
                              }}
                              className="flex items-start gap-3 text-sm text-brand-ink-secondary"
                            >
                              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-cyan mt-2" />
                              <span>{bullet}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Center dot - timeline marker */}
                    <div className="hidden lg:flex lg:col-start-2 lg:justify-center lg:items-center">
                      <div className="relative flex h-full items-center">
                        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-brand-cyan via-brand-gold to-transparent opacity-30" />
                        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-bg-panel/90 border border-white/[0.08]">
                          <span className="h-3.5 w-3.5 rounded-full bg-brand-cyan" />
                        </div>
                      </div>
                    </div>

                    {/* Right content - mobile, or empty on desktop if not even */}
                    <div className="lg:hidden" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <motion.div
            className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { label: "Phases", value: "4", icon: "📊" },
              { label: "Timeline", value: "2Y+", icon: "📅" },
              { label: "Active Status", value: "Q2 2026", icon: "🚀" },
              { label: "ATS path", value: "Q4 2027", icon: "✨" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-brand-bg-panel/40 to-transparent p-4 text-center backdrop-blur-sm hover:border-brand-cyan/30 transition"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-sm text-brand-ink-secondary">{stat.label}</p>
                <p className="text-xl font-bold text-white mt-1">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Roadmap;
