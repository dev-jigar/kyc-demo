import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Home,
  ShoppingBag,
  Users,
  BarChart3,
  Lock,
  Package,
  FileText,
  Layers,
  Activity,
  Menu,
  Origami,
} from "lucide-react";
import { NavItem } from "@/src/utils/sidebar.config";

type KycShellProps = {
  activeKey: string;
  onNavigate: (key: string) => void;
  breadcrumb: string[];
  title: string;
  navigation?: NavItem[];
  children: React.ReactNode;
};

const getNavIcon = (label: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    KYC: <Lock size={20} />,
    PRODUCT: <ShoppingBag size={20} />,
    USERS: <Users size={20} />,
    ANALYTICS: <BarChart3 size={20} />,
    DASHBOARD: <Home size={20} />,
  };
  return iconMap[label] || <Package size={20} />;
};

const getSubItemIcon = (label: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "All Products": <Package size={18} />,
    "Product Listing": <Layers size={18} />,
    Categories: <Activity size={18} />,
    Inventory: <ShoppingBag size={18} />,
    "KYC Users": <Users size={18} />,
  };
  return iconMap[label] || <FileText size={18} />;
};

export function KycShell({
  activeKey,
  onNavigate,
  breadcrumb,
  navigation = [],
  children,
}: KycShellProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(navigation.map((item) => item.key)),
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
    const isChildActive =
      hasChildren &&
      item.children?.some((child) => activeKey.includes(child.key));

    if (!hasChildren) {
      const isActive = activeKey.includes(item.key);

      if (!sidebarOpen) {
        return (
          <div key={item.key} className="relative group">
            <button
              type="button"
              onClick={() => onNavigate(item.key)}
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`relative flex w-full items-center justify-center rounded-xl p-3 transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {getNavIcon(item.label)}
            </button>
            {hoveredItem === item.key && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            )}
          </div>
        );
      }

      return (
        <button
          key={item.key}
          type="button"
          onClick={() => onNavigate(item.key)}
          className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span className="flex-shrink-0">{getNavIcon(item.label)}</span>
          <span className="flex-1 text-left">{item.label}</span>
          {!isActive && (
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-emerald-500/20 transition-colors" />
          )}
        </button>
      );
    }

    if (!sidebarOpen) {
      return (
        <div key={item.key} className="relative group">
          <button
            type="button"
            onClick={() => toggleExpand(item.key)}
            onMouseEnter={() => setHoveredItem(item.key)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`relative flex w-full items-center justify-center rounded-xl p-3 transition-all duration-200 ${
              isChildActive
                ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {getNavIcon(item.label)}
          </button>
          {hoveredItem === item.key && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
              {item.label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.key} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleExpand(item.key)}
          className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
            isChildActive
              ? "bg-emerald-50 text-emerald-700"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span
            className={`flex-shrink-0 ${isChildActive ? "text-emerald-600" : ""}`}
          >
            {getNavIcon(item.label)}
          </span>
          <span className="flex-1 text-left">{item.label}</span>
          <div
            className={`flex-shrink-0 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : "rotate-0"
            } ${isChildActive ? "text-emerald-600" : "text-slate-400"}`}
          >
            <ChevronDown size={18} />
          </div>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-1 pl-4 pr-1 py-1">
            {item.children?.map((child) => {
              const isChildItemActive = activeKey.includes(child.key);
              return (
                <button
                  key={child.key}
                  type="button"
                  onClick={() => onNavigate(child.key)}
                  className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group ${
                    isChildItemActive
                      ? " text-emerald-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 ${
                      isChildItemActive
                        ? "text-emerald-700 font-semibold"
                        : "text-slate-400"
                    }`}
                  >
                    {getSubItemIcon(child.label)}
                  </span>
                  <span className="flex-1 text-left">{child.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      <div className="flex h-screen">
        <aside
          className={`${
            sidebarOpen ? "w-72" : "w-20"
          } flex flex-col border-r border-slate-200 bg-white shadow-xl transition-all duration-300 ease-in-out relative`}
        >
          {/* <div className="absolute top-6 -right-3 z-50">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? (
                <ChevronLeft size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          </div> */}

          <div
            className="border-b border-slate-200 px-4 py-4
          "
          >
            <div
              className={`flex items-center ${sidebarOpen ? "gap-3" : "justify-center"}`}
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/30">
                <Origami size={24} className="text-white" />
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <div className="text-lg font-bold text-slate-900 tracking-tight">
                    Demo
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Management
                  </div>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 px-3 py-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            <div className="space-y-2">
              {navigation.map((item) => renderNavItem(item))}
            </div>
          </nav>

          <div className="border-t border-slate-200 px-3 py-4 space-y-2">
            {!sidebarOpen ? (
              <>
                <div className="relative group">
                  <button
                    onMouseEnter={() => setHoveredItem("settings")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="flex w-full items-center justify-center rounded-xl p-3 text-slate-600 hover:bg-slate-100 transition-all duration-200"
                  >
                    <Settings size={20} />
                  </button>
                  {hoveredItem === "settings" && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                      Settings
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                    </div>
                  )}
                </div>
                {/* <div className="relative group">
                  <button
                    onMouseEnter={() => setHoveredItem("logout")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="flex w-full items-center justify-center rounded-xl p-3 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                  >
                    <LogOut size={20} />
                  </button>
                  {hoveredItem === "logout" && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                      Logout
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                    </div>
                  )}
                </div> */}
              </>
            ) : (
              <>
                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-all duration-200">
                  <Settings size={18} className="flex-shrink-0" />
                  <span>Settings</span>
                </button>
                {/* <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-slate-700 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-all duration-200">
                  <LogOut size={18} className="flex-shrink-0" />
                  <span>Logout</span>
                </button> */}
              </>
            )}
          </div>

          {/* {sidebarOpen && (
            <div className="border-t border-slate-200 px-3 py-4">
              <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-3 border border-emerald-100">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-bold text-white shadow-md">
                  JD
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    John Doe
                  </div>
                  <div className="truncate text-xs text-slate-600">
                    admin@demo.com
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* {!sidebarOpen && (
            <div className="border-t border-slate-200 px-3 py-4">
              <div className="flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-bold text-white shadow-md cursor-pointer hover:shadow-lg transition-all hover:scale-105">
                  JD
                </div>
              </div>
            </div>
          )} */}
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
            <div className="flex items-center justify-between gap-4 px-8 py-5">
              <div className="min-w-0 flex items-center gap-4">
                {/* <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex lg:hidden items-center justify-center h-10 w-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Menu size={20} />
                </button> */}
                <div className="flex items-center gap-2 text-sm">
                  <Home size={16} className="text-slate-400" />
                  {breadcrumb.map((b, idx) => (
                    <span
                      key={`${b}-${idx}`}
                      className="flex items-center gap-2"
                    >
                      <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
                      <span
                        className={
                          idx === breadcrumb.length - 1
                            ? "text-slate-900 font-semibold"
                            : "text-slate-500 hover:text-slate-700 cursor-pointer"
                        }
                      >
                        {b}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* <button className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all hover:scale-105">
                  <Activity size={18} />
                </button>
                <button className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all hover:scale-105 relative">
                  <Settings size={18} />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
                </button> */}
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold shadow-md cursor-pointer hover:shadow-lg transition-all hover:scale-105">
                  D
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
            <div className="mx-auto max-w-7xl px-8 py-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
