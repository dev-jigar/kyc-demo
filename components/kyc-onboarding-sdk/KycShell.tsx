'use client';

import { classNames, IconDot } from './ui';

type NavItem = {
  key: string;
  label: string;
  indent?: boolean;
};


export default function KycShell({
  activeKey,
  onNavigate,
  breadcrumb,
  title,
  topRight,
  navigation = [],
  children,
}: {
  activeKey: string;
  onNavigate: (key: string) => void;
  breadcrumb: string[];
  title: string;
  topRight?: React.ReactNode;
  navigation?: NavItem[];
  children: React.ReactNode;
}) {
  const productItems: NavItem[] = navigation.length > 0 ? navigation : [
    { key: 'kyc', label: 'KYC' },
    { key: 'kyc-contacts', label: 'Contacts', indent: true },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[260px] flex-col bg-slate-800 text-slate-200 md:flex">
          {/* <ChainItLogo /> */}
          <div className="px-3 pb-4">
            {/* <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Products</div> */}
            <nav className="mt-2 space-y-1">
              {productItems.map((item) => {
                const active = item.key === activeKey || (item.key === 'kyc' && activeKey.startsWith('kyc-'));
                const isKycParent = item.key === 'kyc';
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onNavigate(item.key)}
                    className={classNames(
                      'flex w-full items-center gap-3 rounded-md py-2 text-left text-sm font-semibold transition',
                      item.indent ? 'pl-10 pr-3' : 'px-3',
                      active ? 'bg-emerald-600 text-white' : 'text-slate-200 hover:bg-slate-700',
                    )}
                  >
                    {isKycParent ? (
                      <span className={classNames('grid h-8 w-8 place-items-center rounded-md', active ? 'bg-white/15' : 'bg-slate-700')}>
                        <span className={classNames('text-xs font-black', active ? 'text-white' : 'text-slate-200')}>K</span>
                      </span>
                    ) : (
                      <IconDot active={active} />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col">
          {/* Topbar */}
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 flex-col gap-1">
                <div className="text-xs font-semibold text-slate-500">
                  {breadcrumb.map((b, idx) => (
                    <span key={`${b}-${idx}`}>
                      {idx > 0 ? <span className="px-2 text-slate-300">›</span> : null}
                      <span className={idx === breadcrumb.length - 1 ? 'text-slate-700' : ''}>{b}</span>
                    </span>
                  ))}
                </div>
                <div className="truncate text-base font-extrabold text-slate-900">{title}</div>
              </div>

             
            </div>
          </header>

          {/* Content */}
          <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}


