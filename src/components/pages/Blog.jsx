import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, PenTool, Clock } from "lucide-react";
import { containerVariants, itemVariants } from "./home/homeMotion";

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const posts = [
    {
      title: "How fractional ownership changes the investment landscape",
      category: "Market insights",
      excerpt:
        "Discover why tokenized real estate is opening access to high-quality assets for everyday investors.",
    },
    {
      title: "What to look for in a digital property marketplace",
      category: "Investor guidance",
      excerpt:
        "Learn the core metrics, disclosures, and operational signals that matter when evaluating listings.",
    },
    {
      title: "The role of transparency in modern real estate products",
      category: "Product thinking",
      excerpt:
        "Transparency isn’t a nice-to-have—it is the foundation of trust for fractional investing.",
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
            Stories from our team, investors, and market operators.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            Read the latest thinking on real estate investing, marketplace
            design, and platform delivery.
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <motion.article
                key={post.title}
                className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
                variants={itemVariants}
              >
                <span className="inline-flex rounded-full bg-brand-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">
                  {post.category}
                </span>
                <h2 className="mt-6 text-2xl font-semibold text-white">
                  {post.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-ink-secondary">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-2 text-brand-ink-secondary">
                  <Clock className="h-4 w-4 text-brand-cyan" />
                  <span>5 min read</span>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 text-brand-cyan">
              <BookOpen className="h-6 w-6" />
              <h2 className="text-3xl font-semibold text-white">
                Featured insights
              </h2>
            </div>
            <p className="mt-6 text-base leading-relaxed text-brand-ink-secondary">
              Our blog brings together investor education, product updates, and
              market commentary so you can make informed decisions.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Transparent property economics",
                "Marketplace mechanics",
                "Investor experience design",
                "Regulatory and compliance updates",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-dark-900/50 p-4 text-sm text-brand-ink-secondary"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-brand-cyan" />
                    <span>{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Blog;
