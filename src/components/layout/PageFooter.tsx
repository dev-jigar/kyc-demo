export function PaginationFooter({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 0,
  onPageChange,
}: {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <div>
        Showing {start}–{end} of {totalItems}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white disabled:opacity-50"
          >
            ‹
          </button>

          <span className="grid h-8 w-8 place-items-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">
            {currentPage}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white disabled:opacity-50"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
