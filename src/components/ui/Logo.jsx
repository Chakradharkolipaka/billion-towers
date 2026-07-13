import React from 'react';
import { motion } from 'framer-motion';

const publicUrl = process.env.PUBLIC_URL || '';

const heightByPlacement = {
  header: 'h-8 max-h-16 w-auto sm:h-16 md:h-16 lg:h-16',
  footer: 'h-10 w-auto sm:h-11 md:h-12 lg:h-14',
};

/**
 * Horizontal Billion Towers brand (1023×251). Uses optimized 560px asset + 2× source in srcSet.
 */
const Logo = ({ placement = 'header' }) => {
  const heightClass = heightByPlacement[placement] || heightByPlacement.header;

  return (
    <motion.div
      className="min-w-0 shrink-0"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <img
        src={`${publicUrl}/brand/bt-header-banner-560.png`}
        srcSet={`${publicUrl}/brand/bt-header-banner-560.png 560w, ${publicUrl}/brand/bt-header-banner.png 1023w`}
        sizes="(max-width: 640px) 200px, (max-width: 1024px) 260px, 320px"
        alt="Billion Towers — Real World Assets"
        className={`${heightClass} max-w-[min(78vw,20rem)] object-contain object-left sm:max-w-[min(55vw,22rem)] lg:max-w-[min(40vw,28rem)]`}
        decoding="async"
      />
    </motion.div>
  );
};

export default Logo;
