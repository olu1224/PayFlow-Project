
import { Country } from './types';

export const translations: Record<string, Record<'en' | 'fr', string>> = {
  home: { en: 'Home', fr: 'Accueil' },
  wallet: { en: 'Wallet', fr: 'Portefeuille' },
  history: { en: 'History', fr: 'Historique' },
  finance: { en: 'Finance', fr: 'Finance' },
  invest: { en: 'Invest', fr: 'Investir' },
  ai: { en: 'AI', fr: 'IA' },
  contacts: { en: 'Contacts', fr: 'Contacts' },
  welcome_back: { en: 'Welcome back', fr: 'Bon retour' },
  pay_all_bills: { en: 'Pay all your bills in one place', fr: 'Payez toutes vos factures au même endroit' },
  transfer: { en: 'Transfer', fr: 'Transférer' },
  top_up: { en: 'Top Up', fr: 'Recharger' },
  withdraw: { en: 'Withdraw', fr: 'Retirer' },
  receive: { en: 'Receive', fr: 'Recevoir' },
  total_balance: { en: 'Total Account Balance', fr: 'Solde Total du Compte' },
  services: { en: 'Services & Utilities', fr: 'Services et Utilités' },
  ai_intel: { en: 'Financial Intelligence', fr: 'Intelligence Financière' },
  explore_ai: { en: 'Explore AI Planning', fr: 'Explorer la Planification IA' },
  activity: { en: 'Recent Activity', fr: 'Activité Récente' },
  credit_rating: { en: 'Global Credit Rating', fr: 'Cote de Crédit Globale' },
  excellent_standing: { en: 'Excellent Standing', fr: 'Excellente Situation' },
  loan_repayment: { en: 'Loan Repayment', fr: 'Remboursement de Prêt' },
  insurance: { en: 'Insurance', fr: 'Assurance' },
  investment: { en: 'Investment', fr: 'Investissement' },
  transport: { en: 'Transport', fr: 'Transport' },
  car_services: { en: 'Car Services', fr: 'Services de Voiture' },
  gov_services: { en: 'Gov Services', fr: 'Services Gov' },
};

export const getLanguage = (country: Country): 'en' | 'fr' => {
  return country === 'Senegal' ? 'fr' : 'en';
};

export const t = (key: string, country: Country): string => {
  const lang = getLanguage(country);
  return translations[key]?.[lang] || key;
};
