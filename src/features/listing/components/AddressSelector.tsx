"use client";
import React from "react";

/* ---------------- Dummy Addresses (from DB later) ---------------- */

const dummyAddresses = [
  {
    id: "4030ddff-b4cb-4cb2-aad0-86989cee68ee",
    type: "Home",
    name: "Home",
    address: "69 W 33RD ST, READING, PA, 19606",
    city: "READING",
    state: "Pennsylvania",
    zip: "19606",
    country: "UNITED STATES OF AMERICA",
  },
  {
    id: "cb691460-b1cc-484e-8979-536c4ece9569",
    type: "Home",
    name: "test",
    address: "test",
    city: "Mount Penn",
    state: "Pennsylvania",
    zip: "19606",
    country: "United States",
  },
];

/* ---------------- Component ---------------- */

export function AddressSelector({
  onSelect,
}: {
  onSelect?: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    dummyAddresses[0].id
  );
  const [showList, setShowList] = React.useState(false);

  const selected = dummyAddresses.find((a) => a.id === selectedId);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Ship from
      </label>

      {/* Selected Address Card */}
      <div className="flex items-center justify-between border rounded-xl p-4 bg-gray-50">
        <div>
          <div className="font-medium text-gray-800">
            {selected?.name}
          </div>

          <div className="text-sm text-gray-500">
            {selected?.address}, {selected?.city}, {selected?.state}{" "}
            {selected?.zip}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowList((s) => !s)}
          className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100"
        >
          Change
        </button>
      </div>

      {/* Address List */}
      {showList && (
        <div className="border rounded-xl divide-y bg-white shadow-sm">
          {dummyAddresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => {
                setSelectedId(addr.id);
                setShowList(false);
                onSelect?.(addr.id);
              }}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedId === addr.id ? "bg-gray-100" : ""
              }`}
            >
              <div className="font-medium">{addr.name}</div>
              <div className="text-sm text-gray-500">
                {addr.address}, {addr.city}, {addr.state} {addr.zip}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}