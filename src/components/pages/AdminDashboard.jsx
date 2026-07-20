import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import * as productApi from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";
import {
  buildProductPayload,
  mapProductToForm,
  mapProductToProperty,
} from "../../utils/propertyMapper";
import MarketplaceControls from "../admin/MarketplaceControls";
import TokenListingManager from "../admin/TokenListingManager";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  cuttedPrice: "",
  category: "residential",
  city: "",
  state: "",
  country: "USA",
  totalShares: 1000,
  availableShares: 1000,
  investors: 0,
  targetYield: 8,
  projectedRoi: 10,
  occupancy: 90,
  features: "",
  imageUrl: "",
  logoUrl: "",
  brandname: "Billion Towers",
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAdminProducts();
      setProducts(data.products || []);
    } catch (error) {
      toast.error(error.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(`[FORM] Field changed: ${name} = "${value}"`);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm(mapProductToForm(product));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      // Validation
      if (!form.description || form.description.trim().length < 10) {
        toast.error("Description must be at least 10 characters");
        setSaving(false);
        return;
      }

      if (!form.name || form.name.trim().length < 3) {
        toast.error("Name must be at least 3 characters");
        setSaving(false);
        return;
      }

      const payload = buildProductPayload(form);
      
      // Debug: Log what we're sending
      console.log("[FRONTEND] Submitting payload:", JSON.stringify(payload, null, 2));
      console.log("[FRONTEND] Description field:", payload.description);
      console.log("[FRONTEND] Description length:", payload.description?.length);
      
      if (editingId) {
        await productApi.updateProduct(editingId, payload);
        toast.success("Property updated");
      } else {
        await productApi.createProduct(payload);
        toast.success("Property created");
      }
      resetForm();
      await loadProducts();
    } catch (error) {
      console.error("[FRONTEND] Error:", error);
      toast.error(error.message || "Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this property listing?")) return;

    try {
      await productApi.deleteProduct(productId);
      toast.success("Property deleted");
      if (editingId === productId) resetForm();
      await loadProducts();
    } catch (error) {
      toast.error(error.message || "Failed to delete property");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <div className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-cyan">
              Admin
            </p>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Product management
            </h1>
            <p className="mt-2 text-sm text-brand-ink-secondary">
              Signed in as {user?.name} ({user?.email})
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadProducts}
              className="btn btn-hero-secondary inline-flex min-h-[44px] items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <Link to="/session" className="btn btn-hero-secondary min-h-[44px]">
              Session
            </Link>
            <Link to="/marketplace" className="btn btn-hero-secondary min-h-[44px]">
              Marketplace
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-hero-secondary inline-flex min-h-[44px] items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        {/* Marketplace Controls Section */}
        <div className="mb-8">
          <MarketplaceControls />
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/[0.08] bg-brand-bg-panel/60 p-6 shadow-glass backdrop-blur-md sm:p-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6 flex items-center gap-3">
              {editingId ? (
                <Pencil className="h-5 w-5 text-brand-cyan" />
              ) : (
                <Plus className="h-5 w-5 text-brand-cyan" />
              )}
              <h2 className="text-xl font-semibold text-white">
                {editingId ? "Edit property" : "Add property"}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Name</span>
                <input name="name" value={form.name} onChange={handleChange} required className="admin-input" />
              </label>
              <label className="sm:col-span-2 block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">
                  Description (min 10 characters) {form.description.length > 0 && `- ${form.description.length} chars`}
                </span>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  required 
                  minLength={10}
                  rows={4} 
                  className="admin-input"
                  placeholder="Enter a detailed description of the property (minimum 10 characters)"
                />
                {form.description.length > 0 && form.description.length < 10 && (
                  <span className="mt-1 text-xs text-red-500">
                    Need {10 - form.description.length} more characters
                  </span>
                )}
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Price (ETH equiv.)</span>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="admin-input" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Category</span>
                <select name="category" value={form.category} onChange={handleChange} className="admin-input">
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="mixed-use">Mixed-use</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">City</span>
                <input name="city" value={form.city} onChange={handleChange} required className="admin-input" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">State</span>
                <input name="state" value={form.state} onChange={handleChange} className="admin-input" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Total shares</span>
                <input name="totalShares" type="number" value={form.totalShares} onChange={handleChange} required className="admin-input" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Available shares</span>
                <input name="availableShares" type="number" value={form.availableShares} onChange={handleChange} required className="admin-input" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Target yield (%)</span>
                <input name="targetYield" type="number" step="0.1" value={form.targetYield} onChange={handleChange} className="admin-input" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Projected ROI (%)</span>
                <input name="projectedRoi" type="number" step="0.1" value={form.projectedRoi} onChange={handleChange} className="admin-input" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Occupancy (%)</span>
                <input name="occupancy" type="number" value={form.occupancy} onChange={handleChange} className="admin-input" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Investors</span>
                <input name="investors" type="number" value={form.investors} onChange={handleChange} className="admin-input" />
              </label>
              <label className="sm:col-span-2 block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Features (comma-separated)</span>
                <input name="features" value={form.features} onChange={handleChange} className="admin-input" placeholder="Pool, Gym, Parking" />
              </label>
              <label className="sm:col-span-2 block">
                <span className="mb-2 block text-sm text-brand-ink-secondary">Image URLs (one per line)</span>
                <textarea name="imageUrl" value={form.imageUrl} onChange={handleChange} rows={3} className="admin-input" placeholder="https://images.unsplash.com/..." />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className="btn btn-hero-primary min-h-[44px] disabled:opacity-60">
                {saving ? "Saving…" : editingId ? "Update property" : "Create property"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-hero-secondary min-h-[44px]">
                  Cancel edit
                </button>
              )}
            </div>
          </motion.form>

          <div className="rounded-2xl border border-white/[0.08] bg-brand-bg-panel/60 p-6 shadow-glass backdrop-blur-md sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Building2 className="h-5 w-5 text-brand-gold-light" />
              <h2 className="text-xl font-semibold text-white">Listed properties</h2>
            </div>

            {loading ? (
              <p className="text-sm text-brand-ink-secondary">Loading properties…</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-brand-ink-secondary">
                No API properties yet. Create one using the form, or ensure MongoDB is connected.
              </p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => {
                  const property = mapProductToProperty(product);
                  return (
                    <div
                      key={product._id}
                      className="rounded-xl border border-white/[0.08] bg-brand-bg-base/50 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-white">{property.name}</h3>
                          <p className="mt-1 text-sm text-brand-ink-secondary">
                            {property.location.city}, {property.location.state} · {property.category}
                          </p>
                          <p className="mt-2 text-xs text-brand-ink-muted">
                            {property.availableShares} / {property.totalShares} shares available
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="rounded-lg border border-white/10 p-2 text-brand-cyan hover:bg-brand-cyan/10"
                            aria-label={`Edit ${property.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            className="rounded-lg border border-white/10 p-2 text-red-300 hover:bg-red-500/10"
                            aria-label={`Delete ${property.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Token Listing Manager */}
                      <TokenListingManager product={product} onUpdate={loadProducts} />
                      
                      <Link
                        to={`/property/${property.id}`}
                        className="mt-3 inline-block text-sm text-brand-cyan hover:text-brand-cyan-mint"
                      >
                        View on marketplace →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
