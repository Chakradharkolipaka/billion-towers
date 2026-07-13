import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const QnA = ({ n, q }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <motion.div
      className="group overflow-hidden rounded-xl border border-white/[0.08] bg-brand-bg-panel/40 backdrop-blur-md transition-all duration-300 hover:border-brand-cyan/25"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.005 }}
    >
      <motion.button
        type="button"
        className="group flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-300 hover:bg-brand-bg-raised/50 sm:px-6 sm:py-5"
        onClick={toggleAnswer}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan to-brand-gold text-sm font-bold text-brand-bg-base shadow-sm">
              {n}
            </div>
          </div>
          <h3 className="text-base font-semibold text-white transition-colors group-hover:text-brand-cyan sm:text-lg">
            {q.question}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: showAnswer ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-brand-cyan"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {showAnswer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/[0.06]"
          >
            <p className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-brand-ink-secondary sm:px-6 sm:pb-6 sm:pl-[4.5rem] sm:text-base">
              {q.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QnA;
