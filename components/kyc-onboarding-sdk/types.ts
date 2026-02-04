export type KycStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'INVITED' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';

export type KycConfigListItem = {
  id: string;
  title: string;
  description?: string | null;
  updatedAt: string; // ISO or display date
};

export type KycConfigDetails = {
  id: string;
  title: string;
  description?: string | null;
  groupedAddOns?: Array<{
    type: 'INDIVIDUAL' | 'BUSINESS' | string;
    addOns: Array<{ id: string; addOn: string; type: string; metadata?: unknown }>;
  }>;
};

export type KycCustomer = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  status?: 'ACTIVE' | 'INVITED';
  createdAt?: string;
  updatedAt?: string;
};

export type KycReverificationRow = {
  id: string;
  name: string;
  type: string;
  requestedBy: string;
  requestedAt: string;
  frequency: 'ONE_TIME' | 'RECURRING' | string;
  status: 'CANCELLED' | 'OVERDUE' | 'SCHEDULED' | 'COMPLETED' | string;
};


