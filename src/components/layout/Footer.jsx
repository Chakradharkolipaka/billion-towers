import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Twitter,
  Instagram,
  Linkedin,
  Send,
  MessagesSquare,
  ArrowRight,
} from "lucide-react";
import Logo from "../ui/Logo";

const footerColumns = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
  ],
  platform: [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Platform", href: "/platform" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "Compliance", href: "/compliance" },
    { name: "Tokenomics", href: "/tokenomics" },
  ],
  support: [
    { name: "Help Center", href: "/help-center" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
    { name: "Status", href: "/status" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Risk Disclosure", href: "/risk-disclosure" },
    { name: "Compliance", href: "/compliance" },
  ],
};

const sectionLabel = {
  company: "Company",
  platform: "Platform",
  support: "Support",
  legal: "Legal",
};

const columnOrder = ["company", "platform", "support", "legal"];

const socialLinks = [
  { name: "X", icon: Twitter, href: "https://twitter.com" },
  { name: "Discord", icon: MessagesSquare, href: "#" },
  { name: "Telegram", icon: Send, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  const isExternal = (href) => href.startsWith("http");

  const LinkOrA = ({ href, className, children }) =>
    isExternal(href) ? (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ) : (
      <Link to={href} className={className}>
        {children}
      </Link>
    );

  return (
    <footer className="relative border-t border-white/[0.08] bg-brand-bg-raised/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:gap-10 lg:py-16">
          <div className="lg:col-span-3">
            <Link
              to="/"
              className="inline-flex max-w-full"
              aria-label="Billion Towers home"
            >
              <Logo placement="footer" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-ink-secondary">
              Institutional-grade tokenization and asset management for
              real-world capital.
              <br />
              Clear controls, verified listings, and scalable workflows.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-brand-bg-panel/60 text-brand-ink-secondary transition-colors hover:border-brand-cyan/35 hover:text-brand-cyan"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <s.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-6 lg:gap-6">
            {columnOrder.map((key) => (
              <div key={key}>
                <h3 className="text-sm font-bold text-white">
                  {sectionLabel[key]}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {footerColumns[key].map((link) => (
                    <li key={link.name}>
                      <LinkOrA
                        href={link.href}
                        className="text-sm text-brand-ink-secondary transition-colors hover:text-white"
                      >
                        {link.name}
                      </LinkOrA>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/[0.1] bg-brand-bg-panel/50 p-5 shadow-glass backdrop-blur-sm sm:p-6">
              <h3 className="text-base font-bold text-white">Stay Updated</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink-secondary">
                Subscribe to our newsletter for the latest updates.
              </p>
              <form onSubmit={handleEmailSubmit} className="mt-4 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-brand-bg-base/60 px-3 py-2.5 text-sm text-white placeholder:text-brand-ink-muted focus:border-brand-cyan focus:outline-none"
                  required
                />
                <motion.button
                  type="submit"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-cyan text-brand-bg-base shadow-glow-cyan transition-colors hover:bg-brand-cyan-mid"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
                </motion.button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] py-6 text-center">
          <p className="text-xs text-brand-ink-muted sm:text-sm">
            © {year} Billion Towers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
