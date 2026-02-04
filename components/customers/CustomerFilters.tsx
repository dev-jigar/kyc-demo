type CustomerFilterType = 'active' | 'pending';

export default function CustomerFilters({
  activeFilter,
  onFilterChange,
  counts,
}: {
  activeFilter: CustomerFilterType;
  onFilterChange: (f: CustomerFilterType) => void;
  counts: Record<CustomerFilterType, number>;
}) {
  const filters: { key: CustomerFilterType; label: string }[] = [
    { key: 'active', label: 'Active' },
    { key: 'pending', label: 'Pending Invites' },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`px-3 py-1.5 rounded-md border text-sm font-medium flex items-center gap-2 transition ${
            activeFilter === f.key
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {f.label}

          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              activeFilter === f.key
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {counts[f.key]}
          </span>
        </button>
      ))}
    </div>
  );
}
