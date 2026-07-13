import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { containerVariants, itemVariants } from "./home/homeMotion";

const PrivacyPolicy = () => {
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
            How we collect, use, and protect your personal information.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            We are committed to handling investor data responsibly,
            transparently, and in compliance with applicable privacy laws.
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
          {[
            {
              icon: Shield,
              heading: "Information we collect",
              content:
                "We gather account details, transaction history, support interactions, and usage telemetry to operate the platform and improve the experience.",
            },
            {
              icon: Lock,
              heading: "How we use information",
              content:
                "Data is used for account delivery, security, customer support, compliance, and product development.",
            },
            {
              icon: Eye,
              heading: "Your rights",
              content:
                "You can request access, correction, or deletion of your personal data in accordance with our processes.",
            },
          ].map((section) => (
            <motion.div
              key={section.heading}
              className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 text-brand-cyan">
                <section.icon className="h-6 w-6" />
                <h2 className="text-2xl font-semibold text-white">
                  {section.heading}
                </h2>
              </div>
              <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
                {section.content}
              </p>
            </motion.div>
          ))}

          <motion.div
            className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 text-brand-cyan">
              <FileText className="h-6 w-6" />
              <h2 className="text-2xl font-semibold text-white">
                Policy updates
              </h2>
            </div>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
              We update our privacy policy as needed to reflect new features,
              regulatory requirements, and data handling improvements.
            </p>
            <p className="mt-4 text-sm text-brand-ink-secondary">
              If you have questions about how we handle your information,
              contact privacy@billiontowers.com.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default PrivacyPolicy;
