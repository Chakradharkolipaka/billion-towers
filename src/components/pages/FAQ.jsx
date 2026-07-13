import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle } from 'lucide-react';
import QnA from '../ui/QnA';
import faq from '../../data/faq';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaq, setFilteredFaq] = useState(faq);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let filtered = faq;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFaq(filtered);
  }, [searchTerm]);

  const categories = [
    { value: 'all', label: 'All Questions' },
    { value: 'general', label: 'General' },
    { value: 'investment', label: 'Investment' },
    { value: 'technical', label: 'Technical' },
    { value: 'legal', label: 'Legal' },
  ];

  const inputClass =
    'w-full rounded-xl border border-white/[0.1] bg-brand-bg-panel/50 px-4 py-3 pl-11 text-sm text-white placeholder:text-brand-ink-muted shadow-inner transition-colors focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/40 sm:text-base';

  const selectClass =
    'w-full cursor-pointer rounded-xl border border-white/[0.1] bg-brand-bg-panel/50 px-4 py-3 text-sm text-white shadow-inner transition-colors focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/40 md:min-w-[200px] sm:text-base';

  return (
    <div className="min-h-screen bg-transparent">
      <motion.section
        className="border-b border-white/[0.06] px-4 pb-12 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:px-8 lg:pb-16"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Frequently Asked <span className="text-brand-gold-light">Questions</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            Find answers to common questions about our real estate investment platform.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="border-b border-white/[0.06] px-4 py-8 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-brand-bg-panel/40 p-5 shadow-glass backdrop-blur-md sm:p-6">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-stretch">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-cyan/80" aria-hidden />
                <input
                  type="search"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={inputClass}
                  autoComplete="off"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={selectClass}
                aria-label="Filter by category"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value} className="bg-brand-bg-base text-white">
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-4 text-sm text-brand-ink-secondary sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {filteredFaq.length} of {faq.length} questions
              </p>
              <div className="flex items-center gap-1.5 text-brand-ink-secondary">
                <HelpCircle className="h-4 w-4 shrink-0 text-brand-cyan/80" aria-hidden />
                <span>Need more help? Contact us!</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-4xl">
          {filteredFaq.length > 0 ? (
            <motion.div
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              {filteredFaq.map((q, i) => (
                <motion.div
                  key={`${q.question}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.35) }}
                >
                  <QnA n={i + 1} q={q} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="rounded-2xl border border-white/[0.08] bg-brand-bg-panel/35 py-14 text-center shadow-glass backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
            >
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-brand-bg-raised/50">
                <Search className="h-9 w-9 text-brand-cyan/70" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-white">No questions found</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-brand-ink-secondary">
                Try adjusting your search terms or browse all questions.
              </p>
              <motion.button
                type="button"
                className="btn btn-hero-primary mt-6 inline-flex min-h-[44px] items-center justify-center px-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear search
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.section>

      <motion.section
        className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/[0.1] bg-brand-bg-panel/45 px-6 py-10 text-center shadow-glass backdrop-blur-md sm:px-10 sm:py-12">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Still have questions?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-ink-secondary sm:text-base">
            Our support team is here to help you with any questions about investing or our platform.
          </p>
          <motion.a
            href="mailto:support@billiontowers.com"
            className="btn btn-hero-secondary !text-brand-cyan mt-6 inline-flex min-h-[48px] items-center justify-center px-8 hover:!text-brand-cyan-mint"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact support
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
};

export default FAQ;
