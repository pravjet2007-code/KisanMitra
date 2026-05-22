import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star, X, Check, Home, Briefcase, Tractor, MoreHorizontal } from "lucide-react";
import { addressAPI } from "../utils/api";
import type { Address, AddressCreate } from "../types";

interface Props {
  userId: number;
}

type AddressFormState = Omit<Address, 'address_id' | 'user_id'>;

const EMPTY_FORM: AddressFormState = {
  address_type: "home",
  street_address: "",
  city: "",
  state: "",
  pincode: "",
  is_default: false,
};

const ADDRESS_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  home: {
    label: "Home",
    icon: <Home className="w-3.5 h-3.5" />,
    color: "text-emerald-700",
    bg: "bg-emerald-100",
  },
  farm: {
    label: "Farm",
    icon: <Tractor className="w-3.5 h-3.5" />,
    color: "text-amber-700",
    bg: "bg-amber-100",
  },
  office: {
    label: "Office",
    icon: <Briefcase className="w-3.5 h-3.5" />,
    color: "text-blue-700",
    bg: "bg-blue-100",
  },
  other: {
    label: "Other",
    icon: <MoreHorizontal className="w-3.5 h-3.5" />,
    color: "text-gray-700",
    bg: "bg-gray-100",
  },
};

function AddressTypeBadge({ type }: { type: string }) {
  const config = ADDRESS_TYPE_CONFIG[type] ?? ADDRESS_TYPE_CONFIG.other;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
        <div className="h-5 w-20 bg-gray-100 rounded-full" />
      </div>
      <div className="h-4 w-3/4 bg-gray-100 rounded" />
      <div className="h-4 w-1/2 bg-gray-100 rounded" />
      <div className="flex gap-2 pt-1">
        <div className="h-7 w-16 bg-gray-100 rounded-lg" />
        <div className="h-7 w-16 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}

export default function AddressManager({ userId }: Props) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── fetch ──────────────────────────────────────────────────────
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressAPI.getUserAddresses(userId);
      setAddresses(data);
    } catch {
      setError("Could not load addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  // ── open form ──────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.address_id);
    setForm({
      address_type: addr.address_type,
      street_address: addr.street_address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      is_default: addr.is_default,
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormError(null);
  };

  // ── save ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.street_address.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setFormError("Pincode must be exactly 6 digits.");
      return;
    }
    try {
      setSaving(true);
      setFormError(null);
      if (editingId !== null) {
        const updated = await addressAPI.updateAddress(editingId, form);
        setAddresses((prev) =>
          prev.map((a) => (a.address_id === editingId ? updated : a))
        );
      } else {
        const payload: AddressCreate = { ...form, user_id: userId };
        const created = await addressAPI.createAddress(payload);
        setAddresses((prev) => [...prev, created]);
      }
      closeForm();
    } catch {
      setFormError("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── delete ─────────────────────────────────────────────────────
  const handleDelete = async (addressId: number) => {
    try {
      setDeletingId(addressId);
      await addressAPI.deleteAddress(addressId);
      setAddresses((prev) => prev.filter((a) => a.address_id !== addressId));
    } catch {
      setError("Failed to delete address. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── render ─────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 leading-tight">My Addresses</h2>
              <p className="text-xs text-gray-400">
                {loading ? "Loading…" : `${addresses.length} saved address${addresses.length !== 1 ? "es" : ""}`}
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 shadow-sm shadow-green-200"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>

        {/* Global error */}
        {error && (
          <div className="flex items-start justify-between bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 gap-3">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="shrink-0 mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Address grid */}
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 border-2 border-dashed border-gray-200 rounded-2xl text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
              <MapPin className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">No addresses saved yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Add your home, farm, or office address</p>
            <button
              onClick={openCreate}
              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add your first address
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr.address_id}
                className={`relative rounded-2xl border p-5 space-y-2.5 transition-all duration-200 hover:shadow-md ${
                  addr.is_default
                    ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm shadow-green-100"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <AddressTypeBadge type={addr.address_type} />
                  {addr.is_default && (
                    <span className="flex items-center gap-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">
                      <Star className="w-3 h-3 fill-white" />
                      Default
                    </span>
                  )}
                </div>

                {/* Address text */}
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-800 leading-snug">{addr.street_address}</p>
                  <p className="text-sm text-gray-500">
                    {addr.city}, {addr.state}
                  </p>
                  <p className="text-xs text-gray-400 font-mono tracking-wide">{addr.pincode}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => openEdit(addr)}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 transition-colors font-medium"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.address_id)}
                    disabled={deletingId === addr.address_id}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-3 h-3" />
                    {deletingId === addr.address_id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0"
          onClick={(e) => e.target === e.currentTarget && closeForm()}
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  {editingId ? "Edit Address" : "New Address"}
                </h3>
              </div>
              <button
                onClick={closeForm}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              {/* Address Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Address Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(ADDRESS_TYPE_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, address_type: key }))}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        form.address_type === key
                          ? `border-green-500 ${cfg.bg} ${cfg.color} shadow-sm`
                          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Street Address <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.street_address}
                  onChange={(e) => setForm((f) => ({ ...f, street_address: e.target.value }))}
                  placeholder="e.g. 45, Gandhi Nagar, Near Water Tank"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              {/* City + State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="Bhopal"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    State <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    placeholder="Madhya Pradesh"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Pincode <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.pincode}
                  onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                  placeholder="462001"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Default toggle */}
              <div
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setForm((f) => ({ ...f, is_default: !f.is_default }))}
              >
                <div className="flex items-center gap-2.5">
                  <Star className={`w-4 h-4 ${form.is_default ? "text-green-600 fill-green-600" : "text-gray-400"}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Set as default</p>
                    <p className="text-xs text-gray-400">Used automatically at checkout</p>
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
                    form.is_default ? "bg-green-500" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      form.is_default ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>

              {/* Form error */}
              {formError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={closeForm}
                className="flex-1 border border-gray-200 bg-white rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm shadow-green-200"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {editingId ? "Update Address" : "Save Address"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
