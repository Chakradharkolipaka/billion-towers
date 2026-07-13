import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, MapPin, Eye, Heart, Share2, BadgeCheck } from 'lucide-react';

const stableViewCount = (id) => {
  const seed = String(id)
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (seed * 137 + seed * 53) % 1800 + 320;
};

const Property = ({ property, onInvest }) => {
  if (!property) return null;

  const t = property.totalShares || 1;
  const a = property.availableShares ?? 0;
  const fundedPct = Math.min(100, Math.max(0, Math.round(((t - a) / t) * 100)));

  const projected = property.projectedRoi ?? property.returns ?? property.profit;
  const occupancy = property.occupancyPercent;
  const views = stableViewCount(property.id);

  return (
    <motion.div
      className="card-glow group relative overflow-hidden rounded-2xl"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={property.images?.[0] || '/api/placeholder/400/300'}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg-base via-brand-bg-base/40 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {property.status === 'active' && (
            <span className="rounded-md border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
              Live
            </span>
          )}
          {property.verified && (
            <span className="inline-flex items-center gap-1 rounded-md border border-brand-gold/35 bg-brand-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-light">
              <BadgeCheck className="h-3 w-3" aria-hidden />
              Verified
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 text-right">
          <div className="rounded-lg border border-brand-cyan/25 bg-brand-bg-base/75 px-2.5 py-1 backdrop-blur-md">
            <p className="text-[10px] font-medium uppercase tracking-wider text-brand-ink-muted">Projected APY</p>
            <p className="text-lg font-bold tabular-nums text-brand-cyan">{projected}%</p>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-brand-ink-secondary">
          <Eye className="h-3.5 w-3.5 text-brand-cyan/80" aria-hidden />
          <span className="tabular-nums">{views.toLocaleString()} views</span>
        </div>

        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <motion.button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-brand-bg-base/70 text-white backdrop-blur-sm hover:border-brand-cyan/40 hover:text-brand-cyan"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            <Heart className="h-4 w-4" />
          </motion.button>
          <motion.button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-brand-bg-base/70 text-white backdrop-blur-sm hover:border-brand-cyan/40 hover:text-brand-cyan"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            <Share2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-w-0 flex-1 text-lg font-semibold leading-snug text-white transition-colors group-hover:text-brand-cyan">
            {property.name}
          </h3>
          <div className="shrink-0 text-right">
            <p className="text-xs text-brand-ink-muted">From</p>
            <p className="text-lg font-bold tabular-nums text-white">{property.price}</p>
            <p className="text-[11px] text-brand-ink-secondary">ETH equiv.</p>
          </div>
        </div>

        {property.location && (
          <div className="mb-3 flex items-center gap-1.5 text-sm text-brand-ink-secondary">
            <MapPin className="h-4 w-4 shrink-0 text-brand-cyan/80" aria-hidden />
            <span className="truncate">
              {property.location.city}, {property.location.state}
            </span>
          </div>
        )}

        <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-white/[0.06] bg-brand-bg-base/40 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-brand-ink-muted">Occupancy</p>
            <p className="font-semibold tabular-nums text-brand-gold-light">{occupancy != null ? `${occupancy}%` : '—'}</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-brand-bg-base/40 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-brand-ink-muted">Investors</p>
            <p className="flex items-center gap-1 font-semibold text-white">
              <Users className="h-3.5 w-3.5 text-brand-cyan/80" aria-hidden />
              {property.investors}
            </p>
          </div>
        </div>

        {property.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-brand-ink-secondary">{property.description}</p>
        )}

        {property.features && property.features.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {property.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="rounded-full border border-brand-cyan/20 bg-brand-cyan/10 px-2.5 py-0.5 text-xs text-brand-cyan"
              >
                {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-brand-ink-muted">
                +{property.features.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mb-5">
          <div className="mb-1.5 flex justify-between text-xs text-brand-ink-secondary">
            <span>Funded</span>
            <span className="tabular-nums font-medium text-white">{fundedPct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-brand-bg-deep/80">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-cyan via-brand-cyan-mid to-brand-gold"
              initial={{ width: 0 }}
              animate={{ width: `${fundedPct}%` }}
              transition={{ duration: 0.8, delay: 0.1 }}
            />
          </div>
          <p className="mt-1 text-[11px] text-brand-ink-muted">
            <TrendingUp className="mr-1 inline h-3 w-3 text-emerald-400" aria-hidden />
            Target yield {property.profit}% · Distributions monthly
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link
            to={`/property/${property.id}`}
            className="btn btn-neon flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
          >
            View details
            <span aria-hidden>→</span>
          </Link>
          {onInvest && (
            <button
              type="button"
              onClick={() => onInvest(property)}
              className="btn btn-hero-secondary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
            >
              Invest now
            </button>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-cyan/5 to-brand-gold/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
};

export default Property;
