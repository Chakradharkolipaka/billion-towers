import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, List, ArrowUpDown, Building2, Users, DollarSign, TrendingUp } from 'lucide-react';
import Property from '../ui/Property';
import staticProperties from '../../data/properties';
import * as productApi from '../../api/productApi';
import { mapProductToProperty } from '../../utils/propertyMapper';
import { containerVariants, itemVariants } from './home/homeMotion';
import { WalletProvider } from '../../context/WalletContext';
import MarketplaceWalletBar from '../marketplace/MarketplaceWalletBar';
import InvestCheckoutModal from '../marketplace/InvestCheckoutModal';

const categories = [
  { value: 'all', label: 'All properties' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'mixed-use', label: 'Mixed-use' },
];

const sortOptions = [
  { value: 'price', label: 'Price' },
  { value: 'roi', label: 'ROI' },
  { value: 'investors', label: 'Investors' },
  { value: 'date', label: 'Date added' },
];

const bottomStats = [
  { icon: Building2, value: '500+', label: 'Properties listed' },
  { icon: Users, value: '10,000+', label: 'Active investors' },
  { icon: DollarSign, value: '$50M+', label: 'Total volume' },
  { icon: TrendingUp, value: '8.5%', label: 'Average ROI' },
];

const MarketPlace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [properties, setProperties] = useState(staticProperties);
  const [filteredProperties, setFilteredProperties] = useState(staticProperties);
  const [checkoutProperty, setCheckoutProperty] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await productApi.getAllProducts();
        if (data.products?.length) {
          const apiProperties = data.products.map(mapProductToProperty);
          setProperties(apiProperties);
          setFilteredProperties(apiProperties);
        }
      } catch {
        setProperties(staticProperties);
        setFilteredProperties(staticProperties);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(q) ||
          property.description?.toLowerCase().includes(q) ||
          property.location?.city?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((property) => property.category === selectedCategory);
    }

    filtered = filtered.filter(
      (property) => property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    filtered.sort((a, b) => {
      let aValue;
      let bValue;

      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'roi':
          aValue = a.returns ?? a.profit ?? 0;
          bValue = b.returns ?? b.profit ?? 0;
          break;
        case 'investors':
          aValue = a.investors ?? 0;
          bValue = b.investors ?? 0;
          break;
        case 'date':
          aValue = a.createdAt ? new Date(a.createdAt).getTime() : a.id ?? 0;
          bValue = b.createdAt ? new Date(b.createdAt).getTime() : b.id ?? 0;
          break;
        default:
          aValue = a.price;
          bValue = b.price;
      }

      const cmp = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    setFilteredProperties(filtered);
  }, [properties, searchTerm, selectedCategory, priceRange, sortBy, sortOrder]);

  const fieldClass =
    'w-full rounded-xl border border-white/[0.1] bg-brand-bg-panel/50 px-4 py-3 text-sm text-white shadow-inner transition-colors focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/40 sm:text-base';

  const selectClass = `${fieldClass} cursor-pointer pr-10`;

  return (
    <WalletProvider>
    <div className="min-h-screen bg-transparent">
      {/* Hero */}
      <motion.section
        className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-12 top-8 h-64 w-64 rounded-full bg-brand-cyan/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-brand-gold/6 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <motion.h1
            className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.25rem]"
            variants={itemVariants}
          >
            Property <span className="text-brand-gold-light">marketplace</span>
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg"
            variants={itemVariants}
          >
            Browse curated listings, compare yields and occupancy, and size exposure before you connect a wallet.
          </motion.p>
        </div>
      </motion.section>

      {/* Wallet + payment methods */}
      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <MarketplaceWalletBar />
      </section>

      {/* Filters */}
      <motion.section
        className="border-b border-white/[0.06] px-4 py-8 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-white/[0.08] bg-brand-bg-panel/45 p-5 shadow-glass backdrop-blur-md sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative lg:col-span-1">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-cyan/80"
                  aria-hidden
                />
                <input
                  type="search"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${fieldClass} pl-11`}
                  autoComplete="off"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={selectClass}
                aria-label="Category"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value} className="bg-brand-bg-base text-white">
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={selectClass}
                aria-label="Sort by"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-brand-bg-base text-white">
                    Sort by {option.label}
                  </option>
                ))}
              </select>
              <motion.button
                type="button"
                onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-brand-bg-base/50 px-4 text-sm font-medium text-white transition-colors hover:border-brand-cyan/40 hover:bg-brand-bg-raised/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowUpDown className="h-4 w-4 text-brand-cyan" aria-hidden />
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </motion.button>
            </div>

            <div className="mt-6 border-t border-white/[0.06] pt-6">
              <label className="text-sm text-brand-ink-secondary">
                Price range (${priceRange[0]}M – ${priceRange[1]}M)
              </label>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Math.min(parseFloat(e.target.value), priceRange[1]), priceRange[1]])
                  }
                  className="h-2 flex-1 cursor-pointer accent-brand-cyan"
                />
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Math.max(parseFloat(e.target.value), priceRange[0])])
                  }
                  className="h-2 flex-1 cursor-pointer accent-brand-cyan"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-brand-ink-muted">View</span>
                <div className="flex rounded-lg border border-white/[0.1] bg-brand-bg-base/40 p-1">
                  <motion.button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-md p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-brand-cyan/15 text-brand-cyan'
                        : 'text-brand-ink-secondary hover:text-white'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Grid view"
                  >
                    <Grid className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`rounded-md p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-brand-cyan/15 text-brand-cyan'
                        : 'text-brand-ink-secondary hover:text-white'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    aria-label="List view"
                  >
                    <List className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
              <p className="text-sm text-brand-ink-secondary">
                <span className="font-medium text-white">{filteredProperties.length}</span> properties match
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Grid */}
      <motion.section
        className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-7xl">
          {filteredProperties.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8'
                  : 'flex flex-col gap-6'
              }
            >
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.25 }}
                >
                  <Property property={property} onInvest={setCheckoutProperty} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.08] bg-brand-bg-panel/35 py-16 text-center shadow-glass backdrop-blur-md">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-brand-bg-raised/50">
                <Search className="h-9 w-9 text-brand-cyan/70" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-white">No properties found</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-brand-ink-secondary">
                Try adjusting search, category, or price range.
              </p>
              <motion.button
                type="button"
                className="btn btn-hero-primary mt-6 inline-flex min-h-[44px] items-center justify-center px-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange([0, 20]);
                }}
              >
                Clear filters
              </motion.button>
            </div>
          )}
        </div>
      </motion.section>

      {/* Stats strip */}
      <motion.section
        className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-bg-panel/45 shadow-glass backdrop-blur-md sm:rounded-3xl">
            <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.07] md:grid-cols-4 md:divide-y-0">
              {bottomStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center gap-2 px-4 py-8 text-center sm:py-10"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <stat.icon className="h-9 w-9 text-brand-cyan sm:h-10 sm:w-10" strokeWidth={1.35} aria-hidden />
                  <div className="text-2xl font-bold tabular-nums text-brand-cyan sm:text-3xl">{stat.value}</div>
                  <div className="text-xs text-brand-ink-secondary sm:text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <InvestCheckoutModal
        property={checkoutProperty}
        isOpen={Boolean(checkoutProperty)}
        onClose={() => setCheckoutProperty(null)}
      />
    </div>
    </WalletProvider>
  );
};

export default MarketPlace;
