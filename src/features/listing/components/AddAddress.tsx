"use client";

import { USERID } from "@/src/lib";
import { useState } from "react";

type AddressType =
    | "Billing"
    | "Home"
    | "Office"
    | "Warehouse"
    | "Company"
    | "Factory"
    | "Current"
    | "Others";

type AddressForm = {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    name: string;
    address: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    type: AddressType;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (createdAddress: any) => void;
};

export default function AddAddressModal({
    isOpen,
    onClose,
    onSave,
}: Props) {
    const [form, setForm] = useState<AddressForm>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        name: "",
        address: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        type: "Home",
        userId: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = (key: keyof AddressForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    form.userId = USERID

    const validate = () => {
        if (!form.firstName.trim()) return "First name is required";
        if (!form.lastName.trim()) return "Last name is required";
        if (!form.email.includes("@")) return "Valid email is required";
        if (form.phone.length < 8) return "Valid phone is required";
        if (!form.name.trim()) return "Address name is required";
        if (!form.address.trim()) return "Address is required";
        if (!form.addressLine1.trim()) return "Address Line 1 is required";
        if (!form.city.trim()) return "City is required";
        if (!form.state.trim()) return "State is required";
        if (!form.country.trim()) return "Country is required";
        if (!form.zip.trim()) return "Zip code is required";
        return null;
    };

    const save = async () => {
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json?.message || "Failed to create address");
            }

            onSave(json.data);
            onClose();
        } catch (err: any) {
            console.error("Create address failed", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-black">Add Address</h2>
                    <button className="text-black" onClick={onClose}>✕</button>
                </div>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-black">
                    <Input label="First Name *" value={form.firstName} onChange={(v) => update("firstName", v)} />
                    <Input label="Last Name *" value={form.lastName} onChange={(v) => update("lastName", v)} />
                    <Input label="Email *" value={form.email} onChange={(v) => update("email", v)} />
                    <Input label="Phone *" value={form.phone} onChange={(v) => update("phone", v)} />
                    <Input label="Address Name *" value={form.name} onChange={(v) => update("name", v)} />
                    <Input label="Address *" value={form.address} onChange={(v) => update("address", v)} />
                    <Input label="Address Line 1 *" value={form.addressLine1} onChange={(v) => update("addressLine1", v)} />
                    <Input label="Address Line 2" value={form.addressLine2} onChange={(v) => update("addressLine2", v)} />
                    <Input label="City *" value={form.city} onChange={(v) => update("city", v)} />
                    <Input label="State *" value={form.state} onChange={(v) => update("state", v)} />
                    <Input label="Country *" value={form.country} onChange={(v) => update("country", v)} />
                    <Input label="Zip *" value={form.zip} onChange={(v) => update("zip", v)} />
                </div>

                <div className="mt-6">
                    <p className="font-medium mb-2 text-black">Type of Address</p>
                    <div className="flex flex-wrap gap-2">
                        {["Billing", "Home", "Office", "Warehouse", "Company", "Factory", "Current", "Others"].map((t) => (
                            <button
                                key={t}
                                onClick={() => update("type", t)}
                                className={`px-3 py-1 rounded-md border ${form.type === t ? "bg-green-100 border-green-600 text-black" : "text-black"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-8">
                    <button onClick={onClose} className="px-4 py-2 border rounded-md text-black">
                        Cancel
                    </button>

                    <button
                        onClick={save}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md"
                    >
                        {loading ? "Saving..." : "Save Address"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Input({ label, value, onChange }: any) {
    return (
        <div>
            <label className="text-sm font-medium">{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
    );
}