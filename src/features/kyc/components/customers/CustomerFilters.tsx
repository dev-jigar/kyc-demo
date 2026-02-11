import { CustomerFilterType } from "../../types";

export function CustomerFilters({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: CustomerFilterType;
  onFilterChange: (f: CustomerFilterType) => void;
}) {
  const filters: { key: CustomerFilterType; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "invites", label: "Pending Invites" },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`px-3 py-1.5 rounded-md border text-sm font-medium flex items-center gap-2 transition ${
            activeFilter === f.key
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
