import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { pageData } from "../../data/staticPages";
import * as pageApi from "../../api/pageApi";
import { ChevronRight } from "lucide-react";

const Compliance = () => {
  const [page, setPage] = useState(pageData["compliance"] ?? null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      setLoading(true);
      setPage(pageData["compliance"] ?? null);

      try {
        const data = await pageApi.getPage("compliance");
        if (isMounted && data?.page) {
          setPage(data.page);
        }
      } catch (error) {
        if (isMounted) {
          setPage(pageData["compliance"] ?? null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!page && loading) {
    return null;
  }

  if (!page) {
    return (
      <div className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/[0.08] bg-brand-bg-panel/50 p-10 text-center shadow-glass backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-white">Page Not Found</h1>
          <p className="mt-4 text-base text-brand-ink-secondary">
            The page you are looking for does not exist or may have been moved.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-cyan-mid"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8"
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
            className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
            variants={itemVariants}
          >
            {page.title}
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg"
            variants={itemVariants}
          >
            {page.subtitle}
          </motion.p>
          <motion.p
            className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg"
            variants={itemVariants}
          >
            {page.description}
          </motion.p>
        </div>
      </motion.section>

      {/* Accordion Sections */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {page.sections.map((section, index) => (
            <motion.div
              key={section.heading}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-bg-panel/50 transition duration-300"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? -1 : index)
                }
                className="w-full px-6 py-5 text-left transition hover:bg-brand-bg-panel/80"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {section.heading}
                    </h3>
                    {section.text && expandedIndex !== index && (
                      <p className="mt-1 text-sm text-brand-ink-secondary line-clamp-1">
                        {section.text}
                      </p>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: expandedIndex === index ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 flex-shrink-0"
                  >
                    <ChevronRight className="h-5 w-5 text-brand-cyan" />
                  </motion.div>
                </div>
              </button>

              {expandedIndex === index && (
                <motion.div
                  className="space-y-4 border-t border-white/[0.06] px-6 py-5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {section.text && (
                    <p className="text-sm leading-relaxed text-brand-ink-secondary">
                      {section.text}
                    </p>
                  )}

                  {section.items && (
                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <div
                          key={item}
                          className="flex gap-3 rounded-lg border border-white/[0.05] bg-black/20 p-4"
                        >
                          <div className="mt-1 flex-shrink-0">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-brand-cyan/40 bg-brand-cyan/10">
                              <div className="h-2 w-2 rounded-full bg-brand-cyan" />
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed text-white/90">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="mx-auto mt-20 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          {[
            {
              title: "Institutional Custody",
              description: "BNY Mellon, Anchorage, BitGo",
            },
            {
              title: "Security Audits",
              description: "OpenZeppelin, CertiK, Trail of Bits",
            },
            {
              title: "Regulatory Compliance",
              description: "SEC ATS, FinCEN MSB, State Licenses",
            },
            {
              title: "AML/KYC Programs",
              description: "Enhanced due diligence & monitoring",
            },
            {
              title: "Smart Contract Audits",
              description: "Public reports & continuous monitoring",
            },
            {
              title: "Transparency Reports",
              description: "Monthly reports & regulatory filings",
            },
          ].map((trust, index) => (
            <motion.div
              key={trust.title}
              className="rounded-2xl border border-white/[0.08] bg-brand-bg-panel/50 p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4, borderColor: "rgb(0, 255, 179, 0.3)" }}
            >
              <h4 className="font-semibold text-white">{trust.title}</h4>
              <p className="mt-2 text-sm text-brand-ink-secondary">
                {trust.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Compliance;
