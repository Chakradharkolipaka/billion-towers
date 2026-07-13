import {
  Search,
  PieChart,
  CircleDollarSign,
  TrendingUp,
  Shield,
  Building2,
  UserRound,
  ShieldCheck,
  Globe2,
  FileCode2,
  ScanSearch,
  Coins,
  LayoutGrid,
  Wallet,
} from 'lucide-react';

/** Hero — left column matching institutional workflow positioning */
export const heroCopy = {
  badge: 'Institutional trading infrastructure',
  titleLine1: 'Digital asset trading infrastructure',
  titleAccent: 'for institutional desks.',
  subtitle:
    'Modular infrastructure for every workflow: OTC execution, electronic trading, and tokenized asset markets with enterprise controls, compliance, and settlement.',
  primaryCta: 'Browse Marketplace',
  secondaryCta: 'Request Demo',
};

/** Trust row under hero CTAs — title + subline + gold icon */
export const heroTrustBadges = [
  { icon: Shield, title: 'Compliance-ready', sub: 'Built for regulated desks' },
  { icon: Building2, title: 'Modular workflows', sub: 'Launch what you need' },
  { icon: ShieldCheck, title: 'Enterprise reliability', sub: 'Designed for live trading' },
];

/** Unified stats + trust block — gold eyebrow above the metrics row */
export const statsTrustEyebrow = 'Performance signals for execution desks, OTC teams, and asset issuers.';

/** Shown as a subtle caption at the bottom of the unified block */
export const statsIntro =
  'Key institutional metrics and market momentum for scalable digital asset infrastructure.';

/**
 * Momentum row (leading graphics composed in `HomeStatsTrustSection` when `leading` is set).
 */
export const stats = [
  { icon: UserRound, value: '100+', label: 'Institutional desks' },
  { leading: 'dollar-up', value: '$2B+', label: 'Liquidity capacity' },
  { icon: Building2, value: '3', label: 'Product suites' },
  { leading: 'user-shield', value: '99.99%', label: 'Platform uptime' },
];

/** How it works — horizontal flow (icons styled gold in HomeSteps) */
export const steps = [
  {
    icon: Search,
    title: 'Choose the workflow',
    description: 'Select the product path that fits your desk, custody, and market access needs.',
  },
  {
    icon: PieChart,
    title: 'Connect venues',
    description: 'Link counterparties, exchanges, and custodians through a unified execution fabric.',
  },
  {
    icon: CircleDollarSign,
    title: 'Execute with clarity',
    description: 'Trade OTC, spot, or tokenized assets with real-time risk controls and transparency.',
  },
  {
    icon: TrendingUp,
    title: 'Settle efficiently',
    description: 'Manage DvP settlement and custody workflows with proven market integrations.',
  },
  {
    icon: Shield,
    title: 'Monitor operations',
    description: 'Track execution, portfolio health, and compliance status from a single hub.',
  },
];

/** Advantages row — icon left, copy right */
export const features = [
  {
    icon: FileCode2,
    title: 'Mercury Pro',
    description: 'Advanced execution tools, smart routing, and market data for institutional desks.',
  },
  {
    icon: Wallet,
    title: 'Mercury OTC',
    description: 'Electronic RFQ/RFS workflows with multi-dealer pricing and embedded compliance.',
  },
  {
    icon: Coins,
    title: 'Mercury RWA',
    description: 'Secondary markets for tokenized real-world assets with DvP settlement.',
  },
  {
    icon: ShieldCheck,
    title: 'Regulated workflow controls',
    description: 'Built-in KYC, AML, and audit-ready operational transparency.',
  },
  {
    icon: LayoutGrid,
    title: 'White-label ready',
    description: 'Deliver the experience under your brand with configurable client workflows.',
  },
];

export const mechanicsItems = [
  {
    title: 'Map the workflow',
    description: 'Choose the suite that matches your desk and compliance posture.',
    icon: Building2,
  },
  {
    title: 'Connect counterparties',
    description: 'Integrate liquidity providers, exchanges, and custodians into a shared fabric.',
    icon: Wallet,
  },
  {
    title: 'Execute and settle',
    description: 'Run orders, RFQs, and DvP settlement with end-to-end traceability.',
    icon: FileCode2,
  },
  {
    title: 'Report with confidence',
    description: 'Maintain audit-ready records and operational visibility across every trade.',
    icon: ScanSearch,
  },
];

/** Feature cards under the stats row (same unified section) */
export const trustPoints = [
  {
    icon: Globe2,
    title: 'Connected liquidity',
    body: 'A platform that bridges OTC, venue execution, and tokenized asset markets.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance-first design',
    body: 'Every workflow is built with auditability, controls, and institutional standards.',
  },
  {
    icon: UserRound,
    title: 'Professional workflows',
    body: 'Designed for desks that need clarity, governance, and operational discipline.',
  },
  {
    icon: CircleDollarSign,
    title: 'Real-time performance',
    body: 'Execution visibility and P&L signals for every trade and position.',
  },
  {
    icon: Building2,
    title: 'Modular expansion',
    body: 'Start with one product and expand across OTC, execution, and RWA without rewrites.',
  },
];

export const featuresSection = {
  title: 'Modular infrastructure for every workflow',
  subtitle: 'Three product paths designed to work independently or together for professional digital asset operations.',
};

export const stepsSection = {
  title: 'How',
  titleAccent: 'the platform',
  titleSuffix: 'works',
  subtitle: 'A disciplined path for launching, executing, and managing institutional workflows.',
};

export const mechanicsSection = {
  title: 'From workflow selection to operational clarity',
  titleAccent: 'in four steps',
  subtitle:
    'A simpler way to bring execution, compliance, and settlement together for digital asset desks.',
};

export const propertiesSection = {
  title: 'Featured institutional workflows',
};

export const faqSection = {
  title: 'Frequently asked questions from institutional teams',
};

export const closingCta = {
  title: 'Ready to explore tokenized real estate?',
  subtitle: 'Browse live property listings on the marketplace or speak with our team about institutional workflows.',
  primaryLabel: 'Browse Marketplace',
  secondaryLabel: 'Contact Sales',
};
