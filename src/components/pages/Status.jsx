import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Clock, Server } from "lucide-react";
import { containerVariants, itemVariants } from "./home/homeMotion";

const Status = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const statusItems = [
    { title: "Marketplace", status: "Operational", icon: Server },
    { title: "API services", status: "Operational", icon: Activity },
    { title: "Account services", status: "Operational", icon: ShieldCheck },
    { title: "Reporting dashboard", status: "Operational", icon: Clock },
  ];

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
            Real-time health and operational updates.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            Monitor the status of our marketplace, APIs, account services, and
            investor reporting systems.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="px-4 py-16 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={itemVariants}
          >
            {statusItems.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cyan/10 text-brand-cyan">
                  <item.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-6 text-xl font-semibold text-white">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm text-brand-ink-secondary">
                  {item.status}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-semibold text-white">
              Incident history
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
              We publish updates for service incidents, maintenance, and
              scheduled improvements so investors can stay informed.
            </p>
            <ul className="mt-6 space-y-4 text-brand-ink-secondary">
              <li className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span>
                    March 20 — Extra monitoring added for investor dashboard
                  </span>
                  <span className="text-brand-cyan">Resolved</span>
                </div>
              </li>
              <li className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span>
                    February 14 — API latency improved after deployment
                  </span>
                  <span className="text-brand-cyan">Resolved</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Status;
