import { Button } from "@/src/components";
import { MoreVertical } from "lucide-react";
import { useRef, useEffect } from "react";
import { Card, StatusPill } from "../kyc-onboarding-sdk/ui";
import { useRouter } from "next/navigation";
import { KycCustomer } from "../../types";

export function ContactCard({
  contact,
  isMenuOpen,
  onMenuToggle,
  closeMenu,
  onResend,
  onDelete,
}: {
  contact: KycCustomer;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  closeMenu: () => void;
  onResend: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = `${contact.firstName?.[0] ?? ""}${
    contact.lastName?.[0] ?? ""
  }`.toUpperCase();

  /* -------- Close on outside click -------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  const isPending = contact.status === "INVITED";
  const router = useRouter();

  return (
    <Card>
      <div
        className="p-5 transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
        onClick={() => {
          if (!isPending) {
            router.push(`/kyc/${contact.userId}`);
          }
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-center min-w-0">
            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold ">
              {initials}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold truncate text-emerald-700">
                {contact.firstName} {contact.lastName}
              </h3>
              <p className="text-sm text-slate-500 truncate">{contact.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusPill status={contact.status ?? "ACTIVE"} />

            {isPending && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={onMenuToggle}
                  className="p-1 rounded hover:bg-slate-100 text-black"
                >
                  <MoreVertical size={18} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-5 w-40 bg-white border rounded shadow-md z-20 text-black/50 border-emerald-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start rounded-none"
                      onClick={() => {
                        onResend(contact.id);
                        closeMenu();
                      }}
                    >
                      Resend Invite
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start rounded-none text-red-600 hover:bg-red-50"
                      onClick={() => {
                        onDelete(contact.id);
                        closeMenu();
                      }}
                    >
                      Delete Invite
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="my-4 h-px bg-slate-100" />

        <div className="flex justify-between text-sm text-slate-500">
          <div>
            <span className="text-xs uppercase text-slate-400">Invited</span>
            <div>{new Date(contact.createdAt).toISOString().split("T")[0]}</div>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase text-slate-400">Updated</span>
            <div>
              {contact.updatedAt
                ? new Date(contact.updatedAt).toISOString().split("T")[0]
                : "—"}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
