import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Property from '../../ui/Property';
import properties from '../../../data/properties';
import { propertiesSection } from '../../../data/homeSections';
import { containerVariants, itemVariants } from './homeMotion';

const HomeProperties = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="properties" className="scroll-mt-24 border-b border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <motion.div
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.div
          className="mb-12 flex flex-col items-stretch justify-between gap-6 sm:mb-16 sm:flex-row sm:items-center"
          variants={itemVariants}
        >
          <h2 className="max-w-3xl font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {propertiesSection.title}
          </h2>
          <Link
            to="/marketplace"
            className="group btn btn-neon inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 self-start sm:self-auto"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3" variants={containerVariants}>
          {properties.slice(0, 6).map((property) => (
            <motion.div
              key={property.id}
              variants={itemVariants}
              whileHover={reduceMotion ? undefined : { y: -4 }}
            >
              <Property property={property} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HomeProperties;
