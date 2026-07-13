import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import homeFaqItems from '../../../data/homeFaq';
import { faqSection } from '../../../data/homeSections';
import { containerVariants, itemVariants } from './homeMotion';

function FaqRow({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-brand-bg-raised/40 transition-colors hover:border-white/[0.12]">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left sm:px-4 sm:py-3"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-[13px] font-medium leading-snug text-white sm:text-sm">{item.question}</span>
        <Plus
          className={`h-4 w-4 shrink-0 text-brand-cyan transition-transform duration-200 sm:h-[1.125rem] sm:w-[1.125rem] ${
            open ? 'rotate-45' : ''
          }`}
          strokeWidth={2.25}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-white/[0.06] px-3.5 pb-2.5 pt-2 sm:px-4 sm:pb-3 sm:pt-2.5">
          <p className="text-xs leading-relaxed text-brand-ink-secondary sm:text-[13px]">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

const HomeFaq = () => {
  const leftCol = homeFaqItems.slice(0, 4);
  const rightCol = homeFaqItems.slice(4, 8);

  return (
    <section className="border-t border-white/[0.06] bg-brand-bg-raised/15 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <motion.div
        className="mx-auto max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="rounded-2xl border border-white/[0.1] bg-brand-bg-panel/50 p-5 shadow-glass backdrop-blur-sm sm:p-6 md:p-8">
          <motion.h2
            className="mb-6 text-center font-display text-xl font-bold tracking-tight text-white sm:mb-7 sm:text-2xl md:text-3xl"
            variants={itemVariants}
          >
            {faqSection.title}
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 md:gap-y-2"
          >
            <div className="flex flex-col gap-2">
              {leftCol.map((item) => (
                <FaqRow key={item.question} item={item} />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {rightCol.map((item) => (
                <FaqRow key={item.question} item={item} />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeFaq;
