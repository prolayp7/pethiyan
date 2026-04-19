"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MapPin, Plus, Trash2, Star, Loader2, CheckCircle2, Edit2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAddresses, createAddress, updateAddress, deleteAddress,
  type ApiAddress,
} from "@/lib/api";
import { readLastPincodeFromCookie, writeLastPincodeCookie } from "@/lib/location-preferences";

// ─── Indian states ─────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const BLANK = {
  name: "", phone: "", company_name: "", address_line1: "", address_line2: "",
  city: "", state: "", pincode: "",
};

type FormData = typeof BLANK;

// ─── Address Form ─────────────────────────────────────────────────────────────

function AddressForm({
  value, onChange, onSave, onCancel, saving, title,
}: {
  value: FormData;
  onChange: (v: FormData) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  title: string;
}) {
  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...value, [field]: e.target.value });

  const cls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-(--color-primary) focus:bg-white transition-colors";

  const valid = value.name && value.phone.length === 10 && value.address_line1 &&
    value.city && value.state && value.pincode.length === 6;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h3 className="text-sm font-extrabold text-(--color-secondary)">{title}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Full Name *</label>
          <input className={cls} placeholder="e.g. Rahul Sharma" value={value.name} onChange={set("name")} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Mobile *</label>
          <input className={cls} placeholder="10-digit mobile" value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            inputMode="numeric" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Company Name</label>
        <input className={cls} placeholder="Company / Business name (optional)" value={value.company_name} onChange={set("company_name")} />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Address Line 1 *</label>
        <input className={cls} placeholder="Flat / House No., Street" value={value.address_line1} onChange={set("address_line1")} />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Address Line 2</label>
        <input className={cls} placeholder="Area, Colony (optional)" value={value.address_line2} onChange={set("address_line2")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">City *</label>
          <input className={cls} placeholder="City" value={value.city} onChange={set("city")} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">State *</label>
          <select className={cls} value={value.state} onChange={set("state")} title="State">
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Pincode *</label>
          <input className={cls} placeholder="6-digit PIN" value={value.pincode}
            onChange={(e) => onChange({ ...value, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
            inputMode="numeric" />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onSave}
          disabled={saving || !valid}
          className="btn-brand flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Save Address
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Address Card ─────────────────────────────────────────────────────────────

function AddressCard({
  address, onSetDefault, onDelete, onEdit, deleting, settingDefault,
}: {
  address: ApiAddress;
  onSetDefault: () => void;
  onDelete: () => void;
  onEdit: () => void;
  deleting: boolean;
  settingDefault: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm p-5 transition-all ${
      address.is_default ? "border-(--color-primary)" : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-bold text-(--color-secondary)">{address.name}</p>
            {address.is_default && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-(--color-primary) text-white">
                Default
              </span>
            )}
          </div>
          {address.company_name && <p className="text-sm text-gray-600">{address.company_name}</p>}
          <p className="text-sm text-gray-600">{address.address_line1}</p>
          {address.address_line2 && <p className="text-sm text-gray-600">{address.address_line2}</p>}
          <p className="text-sm text-gray-600">{address.city}, {address.state} — {address.pincode}</p>
          <p className="text-xs text-gray-400 mt-1">📞 +91 {address.phone}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Edit2 className="h-3 w-3" /> Edit
        </button>
        {!address.is_default && (
          <button
            onClick={onSetDefault}
            disabled={settingDefault}
            className="btn-brand flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50"
          >
            {settingDefault ? <Loader2 className="h-3 w-3 animate-spin" /> : <Star className="h-3 w-3" />}
            Set as Default
          </button>
        )}
        <button
          onClick={onDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 ml-auto"
        >
          {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
          Remove
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddressesPage() {
  const [addresses, setAddresses]   = useState<ApiAddress[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId]         = useState<number | null>(null);
  const [formData, setFormData]     = useState(BLANK);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [defaultingId, setDefaultingId] = useState<number | null>(null);
  const [lastPincode, setLastPincode] = useState("");

  useEffect(() => {
    setLastPincode(readLastPincodeFromCookie());
  }, []);

  useEffect(() => {
    getAddresses().then((list) => {
      setAddresses(list);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!showAddForm || !lastPincode) return;

    setFormData((current) => (
      current.pincode ? current : { ...current, pincode: lastPincode }
    ));
  }, [showAddForm, lastPincode]);

  const handleAdd = useCallback(async () => {
    setSaving(true);
    const saved = await createAddress({
      name: formData.name, phone: formData.phone,
      company_name: formData.company_name,
      address_line1: formData.address_line1, address_line2: formData.address_line2,
      city: formData.city, state: formData.state, pincode: formData.pincode,
    });
    setSaving(false);
    if (saved) {
      setAddresses((prev) => [...prev, saved]);
      writeLastPincodeCookie(saved.pincode);
      setLastPincode(saved.pincode);
      setShowAddForm(false);
      setFormData(BLANK);
      toast.success("Address saved!");
    } else {
      toast.error("Failed to save address. Please try again.");
    }
  }, [formData]);

  const handleEdit = useCallback(async () => {
    if (editId === null) return;
    setSaving(true);
    const updated = await updateAddress(editId, {
      name: formData.name, phone: formData.phone,
      company_name: formData.company_name,
      address_line1: formData.address_line1, address_line2: formData.address_line2,
      city: formData.city, state: formData.state, pincode: formData.pincode,
    });
    setSaving(false);
    if (updated) {
      setAddresses((prev) => prev.map((a) => (a.id === editId ? updated : a)));
      writeLastPincodeCookie(updated.pincode);
      setLastPincode(updated.pincode);
      setEditId(null);
      setFormData(BLANK);
      toast.success("Address updated!");
    } else {
      toast.error("Failed to update address.");
    }
  }, [editId, formData]);

  const handleDelete = useCallback(async (id: number) => {
    setDeletingId(id);
    const ok = await deleteAddress(id);
    if (ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address removed.");
    } else {
      toast.error("Could not delete address.");
    }
    setDeletingId(null);
  }, []);

  const handleSetDefault = useCallback(async (id: number) => {
    setDefaultingId(id);
    const updated = await updateAddress(id, { is_default: true });
    if (updated) {
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, is_default: a.id === id }))
      );
      writeLastPincodeCookie(updated.pincode);
      setLastPincode(updated.pincode);
      toast.success("Default address updated.");
    } else {
      toast.error("Could not set default address.");
    }
    setDefaultingId(null);
  }, []);

  const startEdit = useCallback((addr: ApiAddress) => {
    setEditId(addr.id);
    setShowAddForm(false);
    setFormData({
      name: addr.name, phone: addr.phone,
      company_name: addr.company_name ?? "",
      address_line1: addr.address_line1, address_line2: addr.address_line2 ?? "",
      city: addr.city, state: addr.state, pincode: addr.pincode,
    });
  }, []);

  const cancelForm = useCallback(() => {
    setShowAddForm(false);
    setEditId(null);
    setFormData(BLANK);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-(--color-primary)" />
          <h1 className="text-xl font-extrabold text-(--color-secondary)">Saved Addresses</h1>
        </div>
        {!showAddForm && editId === null && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-brand flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    {i === 0 && <div className="h-4 w-14 bg-gray-200 rounded-full" />}
                  </div>
                  <div className="h-3.5 w-64 bg-gray-200 rounded" />
                  <div className="h-3.5 w-48 bg-gray-200 rounded" />
                  <div className="h-3.5 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-28 bg-gray-100 rounded mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-7 w-16 bg-gray-200 rounded-lg" />
                {i !== 0 && <div className="h-7 w-28 bg-gray-200 rounded-lg" />}
                <div className="h-7 w-20 bg-gray-100 rounded-lg ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Add form */}
          {showAddForm && (
            <AddressForm
              value={formData}
              onChange={setFormData}
              onSave={handleAdd}
              onCancel={cancelForm}
              saving={saving}
              title="Add New Address"
            />
          )}

          {/* Address cards */}
          {addresses.map((addr) => (
            editId === addr.id ? (
              <AddressForm
                key={addr.id}
                value={formData}
                onChange={setFormData}
                onSave={handleEdit}
                onCancel={cancelForm}
                saving={saving}
                title="Edit Address"
              />
            ) : (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={() => startEdit(addr)}
                onSetDefault={() => handleSetDefault(addr.id)}
                onDelete={() => handleDelete(addr.id)}
                deleting={deletingId === addr.id}
                settingDefault={defaultingId === addr.id}
              />
            )
          ))}

          {/* Empty state */}
          {addresses.length === 0 && !showAddForm && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <MapPin className="h-10 w-10 text-gray-200 mx-auto mb-4" />
              <p className="text-sm font-semibold text-gray-500 mb-4">No saved addresses yet.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white mx-auto"
                style={{ background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" }}
              >
                <Plus className="h-4 w-4" />
                Add Your First Address
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
