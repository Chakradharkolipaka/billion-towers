import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  BarChart,
  Shield,
  Users,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { containerVariants, itemVariants } from "./home/homeMotion";

const Tokenomics = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            A disciplined token economy built for transparency, liquidity, and
            regulated access.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            Our token model supports marketplace integrity, fee clarity, and
            investor alignment across the ecosystem.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="px-4 py-16 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-7xl space-y-12">
          <motion.div
            className="grid gap-8 lg:grid-cols-2"
            variants={itemVariants}
          >
            <div className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cyan/10 text-brand-cyan">
                <DollarSign className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold text-white">
                Supply and distribution
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
                A fixed token supply with a controlled allocation plan for
                product development, regulated marketplace incentives, and
                long-term reserve stability.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold">
                <BarChart className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold text-white">
                Fee structure
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
                Fees are designed to be transparent, low, and aligned with
                long-term platform health rather than short-term speculation.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-semibold text-white">
              Governance and alignment
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
              Token holders and marketplace participants benefit from clear
              policy disclosures, long-term incentives, and platform
              accountability.
            </p>
            <ul className="mt-6 grid gap-4 text-brand-ink-secondary sm:grid-cols-2">
              {[
                "Token utility aligned with marketplace access",
                "Transparent treasury and governance disclosures",
                "Performance incentives for long-term holders",
                "Rules that support responsible secondary liquidity",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-brand-cyan mt-1" />
                    <span>{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
            <motion.div
              className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 text-brand-cyan mb-6">
                <PieChart className="h-6 w-6" />
                <h2 className="text-3xl font-semibold text-white">
                  Token supply and distribution
                </h2>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Total Supply Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-brand-ink-secondary">
                          Total Token Supply
                        </span>
                        <span className="font-semibold text-brand-cyan">
                          1,000,000,000 BT
                        </span>
                      </div>
                      <div className="w-full h-2 bg-dark-900/70 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-cyan to-brand-gold rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-brand-ink-secondary">
                          Vesting Period
                        </span>
                        <span className="font-semibold text-brand-gold">
                          4 years
                        </span>
                      </div>
                      <p className="text-xs text-brand-ink-muted mt-2">
                        Linear vesting with 6-month cliff for most allocations
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-brand-ink-secondary">
                          Initial Circulation
                        </span>
                        <span className="font-semibold text-brand-cyan">
                          10% of supply
                        </span>
                      </div>
                      <p className="text-xs text-brand-ink-muted mt-2">
                        Gradual release to maintain stable market dynamics
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Allocation Breakdown
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Marketplace Incentives",
                        percent: 30,
                        color: "from-brand-cyan",
                      },
                      {
                        label: "Team & Advisors",
                        percent: 20,
                        color: "from-brand-gold",
                      },
                      {
                        label: "Community & Users",
                        percent: 25,
                        color: "from-brand-cyan-mid",
                      },
                      {
                        label: "Treasury Reserve",
                        percent: 15,
                        color: "from-brand-gold-light",
                      },
                      {
                        label: "Partners & Ecosystem",
                        percent: 10,
                        color: "from-brand-cyan/60",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-3"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-brand-ink-secondary">
                            {item.label}
                          </span>
                          <span className="font-semibold text-white">
                            {item.percent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-dark-900/70 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${item.color} to-transparent`}
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                className="rounded-3xl border border-white/[0.08] bg-dark-900/50 p-8 shadow-glass backdrop-blur-sm"
                variants={itemVariants}
              >
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Token at a glance
                </h3>
                <div className="grid gap-4">
                  {[
                    {
                      label: "Circulating Supply",
                      value: "100,000,000 BT",
                      tone: "text-brand-cyan",
                    },
                    {
                      label: "Liquidity Reserve",
                      value: "20%",
                      tone: "text-brand-gold",
                    },
                    {
                      label: "Community Pool",
                      value: "25%",
                      tone: "text-brand-cyan-mid",
                    },
                    {
                      label: "Team & Advisors",
                      value: "20%",
                      tone: "text-brand-gold-light",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/[0.08] bg-dark-900/70 p-4"
                    >
                      <p className="text-sm text-brand-ink-secondary">
                        {item.label}
                      </p>
                      <p className={`mt-2 text-lg font-semibold ${item.tone}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
                variants={itemVariants}
              >
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Sustainable economics
                </h3>
                <p className="text-sm leading-relaxed text-brand-ink-secondary">
                  Our model balances user incentives with long-term protocol
                  stability, ensuring token utility supports marketplace growth
                  without excessive inflation.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-brand-ink-secondary">
                  {[
                    "Controlled token emissions aligned with product milestones",
                    "Fee discounts for holders to encourage platform participation",
                    "Revenue allocated to liquidity, compliance, and ecosystem development",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-cyan" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 text-brand-gold mb-6">
              <TrendingUp className="h-6 w-6" />
              <h2 className="text-3xl font-semibold text-white">
                Token utility and value drivers
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Marketplace Access",
                  description:
                    "Reduced trading fees for token holders (10-50% discount based on holdings)",
                },
                {
                  title: "Governance Rights",
                  description:
                    "Vote on fee structures, treasury allocation, and platform policy changes",
                },
                {
                  title: "Liquidity Incentives",
                  description:
                    "Higher rebate rates for active liquidity providers and long-term holders",
                },
                {
                  title: "Distribution Access",
                  description:
                    "Priority access to limited allocation offerings and new property launches",
                },
                {
                  title: "Premium Features",
                  description:
                    "Unlock advanced analytics, portfolio tools, and advisor services",
                },
                {
                  title: "Regulated Trading Support",
                  description:
                    "Access compliant secondary trading and custody-preserved settlement",
                },
              ].map((utility) => (
                <motion.div
                  key={utility.title}
                  className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-5 hover:border-brand-cyan/30 transition"
                  whileHover={{ y: -4 }}
                >
                  <h3 className="font-semibold text-white text-sm mb-2">
                    {utility.title}
                  </h3>
                  <p className="text-xs text-brand-ink-secondary leading-relaxed">
                    {utility.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 text-brand-cyan mb-6">
              <BarChart className="h-6 w-6" />
              <h2 className="text-3xl font-semibold text-white">
                Fee structure and economics
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-6">
                <p className="text-sm text-brand-cyan font-semibold mb-2">
                  Platform Fee
                </p>
                <p className="text-3xl font-bold text-white mb-1">1.5%</p>
                <p className="text-xs text-brand-ink-muted">
                  Per transaction on primary marketplace
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-6">
                <p className="text-sm text-brand-gold font-semibold mb-2">
                  Secondary Trading Fee
                </p>
                <p className="text-3xl font-bold text-white mb-1">0.5%</p>
                <p className="text-xs text-brand-ink-muted">
                  Lower to encourage liquidity
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-6">
                <p className="text-sm text-brand-cyan-mid font-semibold mb-2">
                  Token Holder Discount
                </p>
                <p className="text-3xl font-bold text-white mb-1">10-50%</p>
                <p className="text-xs text-brand-ink-muted">
                  Tiered based on token holdings
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/20">
              <p className="text-sm text-brand-ink-secondary">
                <span className="text-brand-cyan font-semibold">
                  Treasury Management:
                </span>{" "}
                All platform fees are directed to the protocol treasury, which
                is governed by token holders. At least 50% of annual treasury
                profits are reinvested in ecosystem development and community
                rewards.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Tokenomics;
