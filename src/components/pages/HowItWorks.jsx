import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { pageData } from "../../data/staticPages";
import * as pageApi from "../../api/pageApi";

const HowItWorks = () => {
  const [page, setPage] = useState(pageData["how-it-works"] ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      setLoading(true);
      setPage(pageData["how-it-works"] ?? null);

      try {
        const data = await pageApi.getPage("how-it-works");
        if (isMounted && data?.page) {
          setPage(data.page);
        }
      } catch (error) {
        if (isMounted) {
          setPage(pageData["how-it-works"] ?? null);
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

      {/* Process Steps - Card-based Layout */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          {page.sections.map((section, index) => (
            <motion.div
              key={section.heading}
              className="space-y-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              {/* Section Header */}
              <div className="max-w-3xl">
                <div className="flex items-baseline gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cyan/20 text-sm font-bold text-brand-cyan">
                    {index + 1}
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    {section.heading}
                  </h2>
                </div>
                {section.text && (
                  <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
                    {section.text}
                  </p>
                )}
              </div>

              {/* Items Grid - Card Style */}
              {section.items && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-bg-panel/50 p-6 transition duration-300 hover:border-brand-cyan/30 hover:bg-brand-bg-panel/80 hover:shadow-glow-cyan"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent" />
                      </div>
                      <p className="relative text-sm font-medium leading-relaxed text-white/90">
                        {item}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {/* CTA Section */}
          {page.callout && (
            <motion.section
              className="relative mt-20 overflow-hidden rounded-3xl border border-brand-cyan/20 bg-gradient-to-br from-brand-bg-panel/80 to-brand-cyan/5 p-8 sm:p-12"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-brand-cyan/10 blur-3xl" />

              <div className="relative z-10 grid gap-8 lg:grid-cols-2">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {page.callout.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-ink-secondary">
                    {page.callout.text}
                  </p>
                </div>
                <div className="flex items-center justify-start lg:justify-end">
                  <a
                    href={page.callout.buttonLink}
                    className="inline-flex gap-2 rounded-full bg-brand-cyan px-8 py-3 font-semibold text-black transition hover:bg-brand-cyan-mid hover:gap-3"
                  >
                    {page.callout.buttonText}
                    <span>→</span>
                  </a>
                </div>
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
