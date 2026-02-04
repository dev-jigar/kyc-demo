import { ContactCard } from '@/components/kyc-onboarding-sdk/ui';

export default function CustomerCardGrid({ customers }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 mb-6">
      {customers.map((c: any) => (
        <ContactCard key={c.id} contact={c} />
      ))}
    </div>
  );
}
