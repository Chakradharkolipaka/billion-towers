import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { pageData } from "../../data/staticPages";
import * as pageApi from "../../api/pageApi";
import { containerVariants, itemVariants } from "./home/homeMotion";

const StaticPage = ({ pageKey }) => {
  const [page, setPage] = useState(pageData[pageKey] ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageKey]);

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      setLoading(true);
      setPage(pageData[pageKey] ?? null);

      try {
        const data = await pageApi.getPage(pageKey);
        if (isMounted && data?.page) {
          setPage(data.page);
        }
      } catch (error) {
        if (isMounted) {
          setPage(pageData[pageKey] ?? null);
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
  }, [pageKey]);

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

  return (
    <div className="min-h-screen bg-transparent">
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

      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          {page.sections.map((section) => (
            <motion.section
              key={section.heading}
              className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/50 p-8 shadow-glass backdrop-blur-sm"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="text-2xl font-semibold text-white">
                {section.heading}
              </h2>
              {section.text && (
                <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
                  {section.text}
                </p>
              )}
              {section.items && (
                <ul className="mt-6 grid gap-4 text-brand-ink-secondary sm:grid-cols-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-white/[0.08] bg-black/10 p-4 text-sm text-white/90"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}

          {page.callout && (
            <motion.section
              className="rounded-3xl border border-brand-cyan/10 bg-brand-bg-panel/70 p-8 shadow-glow-cyan"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
                <div>
                  <h2 className="text-3xl font-semibold text-white">
                    {page.callout.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
                    {page.callout.text}
                  </p>
                </div>
                <div className="flex items-center justify-start lg:justify-end">
                  <a
                    href={page.callout.buttonLink}
                    className="inline-flex rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-cyan-mid"
                  >
                    {page.callout.buttonText}
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

export default StaticPage;
