import { TableColumnType } from "@/src/types/components";
import { classNames } from "@/src/utils";

export function Table({
  columns,
  children,
}: {
  columns: Array<TableColumnType>;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.label}
                  className={classNames(
                    "px-6 py-5 text-xs font-bold text-slate-600 uppercase tracking-wider",
                    c.align === "right"
                      ? "text-right"
                      : c.align === "center"
                        ? "text-center"
                        : "text-left",
                    c.className,
                  )}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
