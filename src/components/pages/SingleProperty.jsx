import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  TrendingUp,
  Users,
  Share2,
  Heart,
  DollarSign,
  Building2,
  BadgeCheck,
} from 'lucide-react';
import properties from '../../data/properties';
import NotFound from './NotFound';
import * as productApi from '../../api/productApi';
import { mapProductToProperty } from '../../utils/propertyMapper';
import { containerVariants, itemVariants } from './home/homeMotion';

const glassPanel =
  'rounded-2xl border border-white/[0.08] bg-brand-bg-panel/45 p-6 shadow-glass backdrop-blur-md sm:p-7';

const SingleProperty = () => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      const numericId = Number(id);
      const localProperty = properties.find((item) => item.id === numericId);

      if (localProperty) {
        setProperty(localProperty);
        setLoading(false);
        setActiveImage(0);
        window.scrollTo(0, 0);
        return;
      }

      try {
        const data = await productApi.getProduct(id);
        setProperty(mapProductToProperty(data.product));
      } catch {
        setProperty(null);
      } finally {
        setLoading(false);
        setActiveImage(0);
        window.scrollTo(0, 0);
      }
    };

    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-2 border-white/[0.12] border-t-brand-cyan"
            aria-hidden
          />
          <p className="text-sm text-brand-ink-secondary">Loading property details…</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return <NotFound />;
  }

  const images = property.images?.length ? property.images : ['/api/placeholder/800/600'];
  const mainSrc = images[Math.min(activeImage, images.length - 1)];
  const listedDate = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-transparent">
      <motion.section
        className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-brand-cyan/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-brand-gold/6 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <Link
            to="/marketplace"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-ink-secondary transition-colors hover:text-brand-cyan"
          >
            <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
            Back to Marketplace
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="relative overflow-hidden rounded-2xl border border-white/[0.1] shadow-glass" variants={itemVariants}>
                <img src={mainSrc} alt={property.name} className="h-80 w-full object-cover sm:h-96" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-bg-base/80 via-transparent to-brand-bg-base/30" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {property.isFeatured && (
                    <span className="rounded-md border border-brand-gold/40 bg-brand-gold/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand-gold-light">
                      Featured
                    </span>
                  )}
                  {property.verified && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-brand-gold/35 bg-brand-gold/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand-gold-light">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                      Verified
                    </span>
                  )}
                </div>

                <div className="absolute right-4 top-4 flex gap-2">
                  <motion.button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-brand-bg-base/75 text-white backdrop-blur-md transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    aria-label="Save listing"
                  >
                    <Heart className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-brand-bg-base/75 text-white backdrop-blur-md transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    aria-label="Share listing"
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-lg border-2 transition-all ${
                        activeImage === index
                          ? 'border-brand-cyan ring-1 ring-brand-cyan/30'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={image} alt="" className="h-20 w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {property.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-brand-ink-secondary">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 shrink-0 text-brand-cyan/80" aria-hidden />
                    <span>
                      {property.location?.city}, {property.location?.state}
                    </span>
                  </div>
                  {listedDate && (
                    <span className="text-sm text-brand-ink-muted">Listed {listedDate}</span>
                  )}
                </div>
                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-brand-ink-muted">Offering size</p>
                  <p className="mt-1 text-4xl font-bold tabular-nums text-brand-cyan sm:text-5xl">{property.price}</p>
                  <p className="text-sm text-brand-ink-secondary">ETH equivalent · fractional shares available</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/[0.1] bg-brand-bg-base/40 p-4 text-center backdrop-blur-sm">
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 text-brand-cyan" strokeWidth={1.5} aria-hidden />
                  <div className="text-2xl font-bold tabular-nums text-white">{property.profit}%</div>
                  <div className="text-xs text-brand-ink-secondary sm:text-sm">Target yield</div>
                </div>
                <div className="rounded-xl border border-white/[0.1] bg-brand-bg-base/40 p-4 text-center backdrop-blur-sm">
                  <Users className="mx-auto mb-2 h-8 w-8 text-brand-cyan" strokeWidth={1.5} aria-hidden />
                  <div className="text-2xl font-bold tabular-nums text-white">{property.investors}</div>
                  <div className="text-xs text-brand-ink-secondary sm:text-sm">Investors</div>
                </div>
              </motion.div>

              {property.features && property.features.length > 0 && (
                <motion.div variants={itemVariants}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-ink-muted">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-brand-cyan/25 bg-brand-cyan/10 px-3 py-1.5 text-sm text-brand-ink-secondary"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="space-y-3">
                <motion.button
                  type="button"
                  className="btn btn-hero-primary flex w-full min-h-[52px] items-center justify-center gap-2 text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DollarSign className="h-5 w-5" aria-hidden />
                  Invest now
                </motion.button>
                <motion.button
                  type="button"
                  className="btn btn-hero-secondary flex w-full min-h-[52px] items-center justify-center gap-2 text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Building2 className="h-5 w-5" aria-hidden />
                  View allocation details
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <motion.div className={glassPanel} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
                <h2 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">Description</h2>
                <p className="leading-relaxed text-brand-ink-secondary">{property.description}</p>
              </motion.div>

              <motion.div
                className={glassPanel}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05 }}
              >
                <h2 className="mb-4 font-display text-xl font-semibold text-white sm:text-2xl">Financial details</h2>
                <div className="divide-y divide-white/[0.08]">
                  {[
                    ['Monthly rent', `$${property.financials?.monthlyRent?.toLocaleString() ?? '—'}`, false],
                    ['Annual yield', `${property.financials?.annualYield ?? '—'}%`, false],
                    ['Monthly expenses', `$${property.financials?.expenses?.toLocaleString() ?? '—'}`, false],
                    ['Net monthly income', `$${property.financials?.netIncome?.toLocaleString() ?? '—'}`, true],
                  ].map(([label, value, highlight]) => (
                    <div key={String(label)} className="flex justify-between gap-4 py-3 first:pt-0">
                      <span className="text-sm text-brand-ink-secondary">{label}</span>
                      <span
                        className={`text-right text-sm font-semibold tabular-nums ${highlight ? 'text-brand-cyan' : 'text-white'}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                className={glassPanel}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.08 }}
              >
                <h3 className="mb-4 font-display text-lg font-semibold text-white">Investment summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3 border-b border-white/[0.06] pb-3">
                    <span className="text-brand-ink-secondary">Price per share</span>
                    <span className="font-semibold tabular-nums text-white">
                      ${((property.price * 1000) / property.totalShares).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-white/[0.06] pb-3">
                    <span className="text-brand-ink-secondary">Available shares</span>
                    <span className="font-semibold tabular-nums text-white">{property.availableShares}</span>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-white/[0.06] pb-3">
                    <span className="text-brand-ink-secondary">Total shares</span>
                    <span className="font-semibold tabular-nums text-white">{property.totalShares}</span>
                  </div>
                  <div className="flex justify-between gap-3 pt-1">
                    <span className="text-brand-ink-secondary">Expected APY</span>
                    <span className="font-semibold tabular-nums text-brand-cyan">{property.returns}%</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className={glassPanel}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.12 }}
              >
                <h3 className="mb-4 font-display text-lg font-semibold text-white">Property details</h3>
                <div className="space-y-3 text-sm text-brand-ink-secondary">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 shrink-0 text-brand-cyan/70" aria-hidden />
                    <span>Built in {property.yearBuilt}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Square className="h-5 w-5 shrink-0 text-brand-cyan/70" aria-hidden />
                    <span>{property.squareFootage?.toLocaleString()} sq ft</span>
                  </div>
                  {property.bedrooms != null && (
                    <div className="flex items-center gap-3">
                      <Bed className="h-5 w-5 shrink-0 text-brand-cyan/70" aria-hidden />
                      <span>{property.bedrooms} bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms != null && (
                    <div className="flex items-center gap-3">
                      <Bath className="h-5 w-5 shrink-0 text-brand-cyan/70" aria-hidden />
                      <span>{property.bathrooms} bathrooms</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default SingleProperty;
