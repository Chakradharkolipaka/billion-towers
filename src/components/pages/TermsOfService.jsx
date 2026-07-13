import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Gavel, Shield, CheckCircle } from "lucide-react";
import { containerVariants, itemVariants } from "./home/homeMotion";

const TermsOfService = () => {
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
            The terms governing your use of Billion Towers.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            Read the key provisions covering account use, platform access, and
            our legal relationship with investors.
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
              icon: FileText,
              title: "Use of services",
              text: "You agree to use the platform lawfully, provide accurate information, and follow our policies when investing or interacting with listings.",
            },
            {
              icon: Gavel,
              title: "Limitation of liability",
              text: "Billion Towers is not responsible for investment outcomes. Platform access and product delivery are provided as-is within agreed terms.",
            },
            {
              icon: Shield,
              title: "Security and account integrity",
              text: "Keep your account credentials secure. You are responsible for activity that occurs under your account unless we determine it was unauthorized.",
            },
          ].map((section) => (
            <motion.div
              key={section.title}
              className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 text-brand-cyan">
                <section.icon className="h-6 w-6" />
                <h2 className="text-2xl font-semibold text-white">
                  {section.title}
                </h2>
              </div>
              <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
                {section.text}
              </p>
            </motion.div>
          ))}

          <motion.div
            className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 text-brand-cyan">
              <CheckCircle className="h-6 w-6" />
              <h2 className="text-2xl font-semibold text-white">
                Acceptance and changes
              </h2>
            </div>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
              By using the site, you accept these terms. We may update them
              periodically to reflect product changes and legal requirements.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default TermsOfService;
