import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavItem } from "@/src/utils/sidebar.config";
import { classNames } from "@/src/utils";

type KycShellProps = {
  activeKey: string;
  onNavigate: (key: string) => void;
  breadcrumb: string[];
  title: string;
  navigation?: NavItem[];
  children: React.ReactNode;
};

export function KycShell({
  activeKey,
  onNavigate,
  breadcrumb,
  navigation = [],
  children,
}: KycShellProps) {
  console.log("🚀 ~ KycShell ~ breadcrumb:", breadcrumb);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(navigation.map((item) => item.key)),
  );

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.key);
    const isActive =
      activeKey === item.key ||
      (hasChildren && item.children?.some((child) => activeKey === child.key));
    const isChildActive =
      hasChildren &&
      item.children?.some((child) => activeKey.includes(child.key));
    console.log(
      "🚀 ~ renderNavItem ~ isChildActive:",
      isChildActive,
      item,
      activeKey,
    );

    if (!hasChildren) {
      return (
        <button
          key={item.key}
          type="button"
          onClick={() => onNavigate(item.key)}
          className={classNames(
            "flex w-full items-center gap-3 rounded-lg py-2.5 px-3 text-left text-sm font-medium transition-all duration-150",
            level > 0 ? "ml-6" : "",
            activeKey.includes(item.key)
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-300 hover:bg-slate-700 hover:text-white",
          )}
        >
          <span
            className={classNames(
              "grid h-7 w-7 flex-shrink-0 place-items-center rounded-md text-xs font-bold",
              activeKey.includes(item.key) ? "bg-white/20" : "bg-slate-700/50",
            )}
          >
            {item.label.charAt(0).toUpperCase()}
          </span>
          <span className="flex-1">{item.label}</span>
        </button>
      );
    }

    return (
      <div key={item.key} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleExpand(item.key)}
          className={classNames(
            "flex w-full items-center gap-3 rounded-lg py-2.5 px-3 text-left text-sm font-medium transition-all duration-150",
            isChildActive
              ? "bg-slate-700 text-white"
              : "text-slate-300 hover:bg-slate-700 hover:text-white",
          )}
        >
          <span
            className={classNames(
              "grid h-7 w-7 flex-shrink-0 place-items-center rounded-md text-xs font-bold",
              isChildActive ? "bg-emerald-600 text-white" : "bg-slate-700/50",
            )}
          >
            {item.label.charAt(0).toUpperCase()}
          </span>
          <span className="flex-1 font-semibold">{item.label}</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {isExpanded && (
          <div className="ml-4 space-y-1 border-slate-700 pl-2">
            {item.children?.map((child) => (
              <button
                key={child.key}
                type="button"
                onClick={() => onNavigate(child.key)}
                className={classNames(
                  "flex w-full items-center gap-3 rounded-lg py-2 px-3 text-left text-sm font-medium transition-all duration-150",
                  activeKey.includes(child.key)
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-700 hover:text-slate-200",
                )}
              >
                <span
                  className={classNames(
                    "grid h-6 w-6 flex-shrink-0 place-items-center rounded text-xs",
                    activeKey.includes(child.key)
                      ? "bg-white/20 font-bold"
                      : "",
                  )}
                >
                  {child.label.charAt(0).toUpperCase()}
                </span>
                <span>{child.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-[280px] flex-col bg-slate-800 md:flex">
          {/* <div className="border-b border-slate-700 px-4 py-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600">
                <span className="text-lg font-black text-white">D</span>
              </div>
              <div>
                <div className="text-base font-bold text-white">Demo</div>
                <div className="text-xs text-slate-400">Management Portal</div>
              </div>
            </div>
          </div> */}

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <nav className="space-y-1.5">
              {navigation.map((item) => renderNavItem(item))}
            </nav>
          </div>

          <div className="border-t border-slate-700 px-4 py-4">
            <div className="flex items-center gap-3 rounded-lg bg-slate-700/50 px-3 py-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                U
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  User Account
                </div>
                <div className="text-xs text-slate-400">admin@example.com</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                  {breadcrumb.map((b, idx) => (
                    <span
                      key={`${b}-${idx}`}
                      className="flex items-center gap-1.5"
                    >
                      {idx > 0 && (
                        <ChevronRight className="h-3 w-3 text-slate-300" />
                      )}
                      <span
                        className={classNames(
                          idx === breadcrumb.length - 1
                            ? "text-slate-900 font-semibold"
                            : "text-slate-500",
                        )}
                      >
                        {b}
                      </span>
                    </span>
                  ))}
                </div>
                {/* <h1 className="text-2xl font-bold text-slate-900">{title}</h1> */}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
