import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

// Layout
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import FAQ from "./components/pages/FAQ";
import MarketPlace from "./components/pages/MarketPlace";
import SingleProperty from "./components/pages/SingleProperty";
import ContactUs from "./components/pages/ContactUs";
import StaticPage from "./components/pages/StaticPage";
import Careers from "./components/pages/Careers";
import Press from "./components/pages/Press";
import Blog from "./components/pages/Blog";
import Tokenomics from "./components/pages/Tokenomics";
import Roadmap from "./components/pages/Roadmap";
import HowItWorks from "./components/pages/HowItWorks";
import HelpCenter from "./components/pages/HelpCenter";
import Status from "./components/pages/Status";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import TermsOfService from "./components/pages/TermsOfService";
import Compliance from "./components/pages/Compliance";
import RiskDisclosure from "./components/pages/RiskDisclosure";
import NotFound from "./components/pages/NotFound";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import SessionPage from "./components/pages/SessionPage";
import AdminDashboard from "./components/pages/AdminDashboard";

// Styles
import "./index.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WalletProvider>
          <Router>
        <div className="relative min-h-screen overflow-x-hidden bg-brand-app">
          <div
            className="pointer-events-none fixed inset-0 z-0 bg-brand-mesh opacity-90"
            aria-hidden
          />
          <div
            className="pointer-events-none fixed inset-0 z-0 cyber-bg opacity-[0.35]"
            aria-hidden
          />

          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="relative z-10"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/marketplace" element={<MarketPlace />} />
                <Route path="/platform" element={<StaticPage pageKey="platform" />} />
                <Route path="/mercury-pro" element={<StaticPage pageKey="mercury-pro" />} />
                <Route path="/mercury-otc" element={<StaticPage pageKey="mercury-otc" />} />
                <Route path="/mercury-rwa" element={<StaticPage pageKey="mercury-rwa" />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/tokenomics" element={<Tokenomics />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/status" element={<Status />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/risk-disclosure" element={<RiskDisclosure />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/session"
                  element={
                    <ProtectedRoute>
                      <SessionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/products" replace />}
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/property/:id" element={<SingleProperty />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </Layout>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "rgba(7, 18, 38, 0.94)",
                color: "#ffffff",
                boxShadow:
                  "0 12px 40px rgba(0, 0, 0, 0.35), 0 0 24px rgba(0, 229, 255, 0.12)",
                borderRadius: "0.75rem",
                border: "1px solid rgba(0, 229, 255, 0.22)",
                backdropFilter: "blur(12px)",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#050816",
                },
              },
              error: {
                iconTheme: {
                  primary: "#f87171",
                  secondary: "#050816",
                },
              },
            }}
          />
        </div>
        </Router>
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
