import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Phone,
  ChevronDown,
} from "lucide-react";
import { containerVariants, itemVariants } from "./home/homeMotion";

const HelpCenter = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: 'Visit our platform and click "Sign Up". You\'ll need to provide your email, create a password, and complete our identity verification process (KYC). This typically takes 5-10 minutes.',
        },
        {
          q: "What documents do I need to verify my account?",
          a: "We require a valid government-issued ID, proof of address (utility bill or bank statement), and basic personal information. All documents are encrypted and stored securely.",
        },
        {
          q: "What is the minimum investment amount?",
          a: "The minimum investment varies by property, but typically ranges from $1,000 to $5,000 per property. We offer fractional shares to make real estate investing more accessible.",
        },
      ],
    },
    {
      category: "Investing and Trading",
      questions: [
        {
          q: "How does fractional ownership work?",
          a: "Properties are divided into digital shares. You can own any number of shares, giving you partial ownership and proportional returns. Share prices adjust based on market conditions.",
        },
        {
          q: "Can I sell my shares on the secondary market?",
          a: "Yes. Our secondary marketplace enables buy and sell orders in a regulated order book. Prices are determined by supply and demand while settlement is handled through our custody partner to preserve asset-backed ownership records.",
        },
        {
          q: "How do secondary trades settle?",
          a: "Trades settle through our custody and ledger partners with same-day ownership updates. This keeps trading compliant and preserves tokenized asset records.",
        },
        {
          q: "Are tokens in your marketplace treated as regulated securities?",
          a: "Yes. Our tokens represent asset-backed positions issued within a compliance framework designed for institutional-grade real estate securities. This includes custody oversight, transparent disclosures, and governance-ready secondary trading.",
        },
        {
          q: "When do I receive distributions?",
          a: "Distributions are typically paid quarterly. You'll receive rental income, sale proceeds, or other property-related returns proportional to your ownership.",
        },
      ],
    },
    {
      category: "Fees and Payments",
      questions: [
        {
          q: "What fees do you charge?",
          a: "We charge a 1.5% platform fee on primary purchases and 0.5% on secondary trades. Token holders receive 10-50% discounts depending on holdings. No hidden fees.",
        },
        {
          q: "How do I fund my account?",
          a: "You can fund via bank transfer (ACH), wire transfer, or credit/debit card. Bank transfers typically clear within 1-3 business days.",
        },
        {
          q: "Can I withdraw funds?",
          a: "Yes. Withdrawal requests are processed within 5-7 business days. Funds are returned to your original funding method.",
        },
      ],
    },
    {
      category: "Property and Returns",
      questions: [
        {
          q: "How are properties selected?",
          a: "Our team conducts thorough underwriting including location analysis, market research, property inspections, and financial modeling. All properties meet strict quality criteria.",
        },
        {
          q: "What are typical returns?",
          a: "Historical returns range from 8-15% annually, including both rental income and appreciation. Past performance does not guarantee future results.",
        },
        {
          q: "How often can I see property updates?",
          a: "Each property dashboard provides real-time access to operating metrics, tenant information, maintenance updates, and financial performance.",
        },
      ],
    },
    {
      category: "Account and Security",
      questions: [
        {
          q: "How is my data protected?",
          a: "We use enterprise-grade encryption (AES-256), multi-factor authentication, and comply with SOC 2 standards. Your data is never shared with third parties.",
        },
        {
          q: "Can I enable two-factor authentication?",
          a: "Yes, and we recommend it. You can use authenticator apps (Google Authenticator, Authy) or SMS for 2FA on your account.",
        },
        {
          q: "What happens if I forget my password?",
          a: 'Click "Forgot Password" on the login page. You\'ll receive an email with a secure reset link. The link expires after 1 hour for security.',
        },
      ],
    },
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
            Answers for investors and platform users.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            Browse our help topics, troubleshooting guides, and ways to reach
            support for your account.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="px-4 py-16 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.4fr_0.75fr]">
          <div className="space-y-10">
            {faqs.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="h-1 w-6 bg-gradient-to-r from-brand-cyan to-brand-gold rounded-full" />
                  {section.category}
                </h3>

                <div className="space-y-3">
                  {section.questions.map((faq, qIndex) => (
                    <motion.div
                      key={qIndex}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: qIndex * 0.05 }}
                    >
                      <motion.button
                        onClick={() =>
                          setExpandedFAQ(
                            expandedFAQ === `${sectionIndex}-${qIndex}`
                              ? null
                              : `${sectionIndex}-${qIndex}`,
                          )
                        }
                        className="w-full rounded-2xl border border-white/[0.08] bg-dark-900/60 p-4 text-left transition hover:border-brand-cyan/30 hover:bg-dark-900/80"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="font-semibold text-white text-sm sm:text-base">
                            {faq.q}
                          </p>
                          <motion.div
                            animate={{
                              rotate:
                                expandedFAQ === `${sectionIndex}-${qIndex}`
                                  ? 180
                                  : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0"
                          >
                            <ChevronDown className="h-5 w-5 text-brand-cyan" />
                          </motion.div>
                        </div>
                      </motion.button>

                      <AnimatePresence>
                        {expandedFAQ === `${sectionIndex}-${qIndex}` && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="rounded-b-2xl border-l border-r border-b border-white/[0.08] bg-dark-900/40 p-4 text-brand-ink-secondary text-sm leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <motion.div
              className="rounded-3xl border border-brand-cyan/20 bg-gradient-to-br from-brand-cyan/5 to-brand-gold/5 p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Need help faster?
              </h3>
              <p className="text-brand-ink-secondary mb-6">
                Our support team is ready to answer questions about account
                setup, transactions, and token economics.
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:support@billiontowers.com"
                  className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-dark-900/50 p-4 text-sm text-brand-cyan hover:border-brand-cyan/30 hover:bg-dark-900/80 transition"
                >
                  <MessageSquare className="h-4 w-4" />
                  Email Support
                </a>
                <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-dark-900/50 p-4 text-sm text-brand-cyan hover:border-brand-cyan/30 hover:bg-dark-900/80 transition">
                  <Phone className="h-4 w-4" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-dark-900/50 p-4 text-sm text-brand-cyan hover:border-brand-cyan/30 hover:bg-dark-900/80 transition">
                  <HelpCircle className="h-4 w-4" />
                  Access live chat through your dashboard
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-3xl border border-white/[0.08] bg-dark-900/50 p-8 shadow-glass backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Quick tips</h3>
              <ul className="space-y-3 text-sm text-brand-ink-secondary">
                <li className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-3">
                  Browse the Getting Started section for quick account setup and
                  verification guidance.
                </li>
                <li className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-3">
                  Use the dashboard chat for real-time transaction and funding
                  support.
                </li>
                <li className="rounded-2xl border border-white/[0.08] bg-dark-900/60 p-3">
                  Check the Investing and Trading FAQ for secondary market and
                  yield questions.
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HelpCenter;
