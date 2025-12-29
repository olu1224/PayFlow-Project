
export type Country = 'Nigeria' | 'Ghana' | 'Senegal';
export type Currency = 'NGN' | 'GHS' | 'XOF';

export interface User {
  uid: string;
  name: string;
  email?: string;
  country: Country;
  currency: Currency;
  balance: number;
  creditScore: number;
  avatar?: string;
  isBusiness?: boolean;
  isOnboarded: boolean;
  security: {
    twoFactorEnabled: boolean;
    biometricsEnabled: boolean;
    hideBalances: boolean;
    lastLogin: string;
    pin: string;
  };
  preferences: {
    notifications: boolean;
    marketing: boolean;
    dailyLimit: number;
  };
  wealth?: {
    emergencyFund: {
      tier1: number; // Instant Access
      tier2: number; // Growth/Fixed
      target: number;
    };
    dollarFund: {
      balanceUsd: number;
      investedNaira: number;
    };
    connectedPlatforms: string[];
  };
}

export interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  category: string;
  name: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method?: string; 
}

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  category: string;
  active: boolean;
}

export interface Beneficiary {
  id: string;
  name: string;
  type: 'mobile' | 'utility' | 'bank';
  category: string;
  account: string;
  provider: string;
  country: Country;
}

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  valueUsd: number;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'deploying';
  description: string;
}

export interface BudgetGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  color: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}
