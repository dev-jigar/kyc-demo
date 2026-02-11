import { useState } from "react";
import { ContactCard } from "./ContactCard";
import { KycCustomer } from "../../types";

export function CustomerCardGrid({
  customers,
  onResend,
  onDelete,
}: {
  customers: KycCustomer[];
  onResend: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 mb-6">
      {customers.map((c) => (
        <ContactCard
          key={c.id}
          contact={c}
          isMenuOpen={openMenuId === c.id}
          onMenuToggle={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
          closeMenu={() => setOpenMenuId(null)}
          onResend={onResend}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
