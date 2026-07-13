import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Sparkles,
  Users,
  Award,
  ChevronDown,
  Mail,
} from "lucide-react";
import { containerVariants, itemVariants } from "./home/homeMotion";

const Careers = () => {
  const [expandedRole, setExpandedRole] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const roles = [
    {
      title: "Senior Full-Stack Engineer",
      team: "Engineering",
      requirements: [
        "5+ years of production TypeScript/JavaScript experience",
        "Strong expertise with React and Node.js",
        "Database design and optimization experience",
        "Experience with real estate, fintech, or marketplace platforms",
      ],
      responsibilities: [
        "Build and scale features for our marketplace platform",
        "Design and implement API endpoints and database schemas",
        "Collaborate with product and design teams on feature implementation",
        "Mentor junior engineers and lead technical discussions",
      ],
    },
    {
      title: "Product Manager",
      team: "Product",
      requirements: [
        "4+ years in product management or similar roles",
        "Experience with marketplace or two-sided platform products",
        "Strong analytical and communication skills",
        "Understanding of regulatory environments in fintech",
      ],
      responsibilities: [
        "Define product strategy and roadmap for marketplace features",
        "Conduct user research and define feature requirements",
        "Work with engineering and design to ship products",
        "Analyze metrics and iterate based on user feedback",
      ],
    },
    {
      title: "Frontend Developer",
      team: "Engineering",
      requirements: [
        "3+ years of React development experience",
        "Proficiency in TypeScript and modern CSS/Tailwind",
        "Strong attention to UI/UX implementation details",
        "Experience with Framer Motion or similar animation libraries",
      ],
      responsibilities: [
        "Build responsive, performant UI components",
        "Implement pixel-perfect designs from design mockups",
        "Optimize frontend performance and accessibility",
        "Contribute to design system improvements",
      ],
    },
    {
      title: "Compliance Analyst",
      team: "Operations",
      requirements: [
        "3+ years in compliance, legal, or regulatory roles",
        "Knowledge of SEC regulations and investment rules",
        "Experience with KYC/AML procedures",
        "Strong documentation and detail orientation",
      ],
      responsibilities: [
        "Monitor regulatory changes and update compliance policies",
        "Review investor documentation and ensure KYC compliance",
        "Work with legal to implement new regulatory requirements",
        "Conduct compliance audits and training",
      ],
    },
    {
      title: "Backend Engineer - Infrastructure",
      team: "Engineering",
      requirements: [
        "4+ years of backend development experience",
        "Expertise with cloud platforms (AWS/GCP)",
        "Experience with microservices and distributed systems",
        "Database optimization and scaling experience",
      ],
      responsibilities: [
        "Design and maintain scalable backend infrastructure",
        "Implement security best practices and data protection",
        "Optimize database performance and reliability",
        "Lead infrastructure planning for growth",
      ],
    },
    {
      title: "Investor Relations Specialist",
      team: "Growth",
      requirements: [
        "2+ years in investor relations or investor management",
        "Strong communication and presentation skills",
        "Understanding of real estate investing fundamentals",
        "Experience with investor onboarding and support",
      ],
      responsibilities: [
        "Manage investor relationships and communications",
        "Create investor educational content and materials",
        "Support investor onboarding and account setup",
        "Gather feedback and report to product team",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <motion.section
        className="border-b border-white/[0.06] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative mx-auto max-w-7xl text-center">
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Build a real estate platform that puts investors first.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-ink-secondary sm:text-lg">
            Join the team creating a modern, transparent real estate marketplace
            for fractional ownership and long-term growth.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="px-4 py-16 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                icon: Briefcase,
                title: "Mission-driven culture",
                details:
                  "Work with operators, engineers, and capital markets experts to make property investing accessible and transparent.",
              },
              {
                icon: Sparkles,
                title: "Fast-moving product",
                details:
                  "Ship meaningful features for investors, distribution, and marketplace operations every sprint.",
              },
              {
                icon: Users,
                title: "Collaborative teams",
                details:
                  "Cross-functional collaboration between product, design, compliance, and growth keeps us aligned.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/50 p-8 shadow-glass backdrop-blur-sm"
                variants={itemVariants}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cyan/10 text-brand-cyan">
                  <item.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-white">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-ink-secondary">
                  {item.details}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-semibold text-white">Open roles</h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
              Join our growing team. Click on any role to see detailed
              requirements and responsibilities.
            </p>
            <div className="mt-8 space-y-4">
              {roles.map((role, index) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.button
                    onClick={() =>
                      setExpandedRole(expandedRole === index ? null : index)
                    }
                    className="w-full rounded-2xl border border-white/[0.08] bg-dark-900/60 p-4 text-left transition hover:border-brand-cyan/30 hover:bg-dark-900/80"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">
                          {role.title}
                        </h3>
                        <p className="text-xs text-brand-cyan mt-1">
                          {role.team}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedRole === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-5 w-5 text-brand-cyan" />
                      </motion.div>
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedRole === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-b-2xl border-l border-r border-b border-white/[0.08] bg-dark-900/40 p-6 pt-0 space-y-6">
                          <div>
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-brand-cyan" />
                              Requirements
                            </h4>
                            <ul className="space-y-2 text-sm text-brand-ink-secondary">
                              {role.requirements.map((req) => (
                                <li key={req} className="flex gap-2">
                                  <span className="text-brand-cyan mt-1">
                                    •
                                  </span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-brand-gold" />
                              Responsibilities
                            </h4>
                            <ul className="space-y-2 text-sm text-brand-ink-secondary">
                              {role.responsibilities.map((resp) => (
                                <li key={resp} className="flex gap-2">
                                  <span className="text-brand-gold mt-1">
                                    •
                                  </span>
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <motion.a
                            href={`mailto:careers@billiontowers.com?subject=Application for ${role.title}`}
                            className="inline-flex gap-2 rounded-full bg-brand-cyan px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-cyan-mid mt-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Mail className="h-4 w-4" />
                            Apply for this role
                          </motion.a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.section
            className="grid gap-8 lg:grid-cols-2"
            variants={itemVariants}
          >
            <div className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm">
              <h2 className="text-3xl font-semibold text-white">Benefits</h2>
              <ul className="mt-6 space-y-4 text-brand-ink-secondary">
                {[
                  "Competitive compensation packages",
                  "Flexible and remote-friendly work model",
                  "Career development and mentorship",
                  "Meaningful ownership of the product experience",
                ].map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm">
                    <Award className="mt-1 h-5 w-5 text-brand-cyan" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-brand-bg-panel/45 p-8 shadow-glass backdrop-blur-sm">
              <h2 className="text-3xl font-semibold text-white">
                How to apply
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-ink-secondary">
                Share your experience, your product or operational point of
                view, and why you want to build the next generation of real
                estate investing.
              </p>
              <p className="mt-6 text-sm text-brand-ink-secondary">
                Email your resume and a short note to{" "}
                <a
                  className="text-brand-cyan hover:text-white"
                  href="mailto:careers@billiontowers.com"
                >
                  careers@billiontowers.com
                </a>
                .
              </p>
            </div>
          </motion.section>
        </div>
      </motion.section>
    </div>
  );
};

export default Careers;
