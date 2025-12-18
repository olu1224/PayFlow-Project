
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
  services: { en: 'Bill Payment Center', fr: 'Centre de Paiement des Factures' },
  activity: { en: 'Recent Activity', fr: 'Activité Récente' },
  credit_rating: { en: 'Global Credit Rating', fr: 'Cote de Crédit Globale' },
  
  // Services
  internet_services: { en: 'Internet Services', fr: 'Services Internet' },
  order_food: { en: 'Order Food', fr: 'Commander Repas' },

  // Feature Guide Toggles
  guide_title: { en: 'MASTER PAYFLOW PRO', fr: 'MAÎTRISEZ PAYFLOW PRO' },
  guide_subtitle: { en: 'Your Pan-African Financial OS is active.', fr: 'Votre OS financier panafricain est activé.' },
  
  feat_bills_title: { en: 'MPN Bill Center', fr: 'Centre de Factures MPN' },
  feat_bills_detail: { en: 'Settle Electricity (IKEDC, ECG, Senelec), Water, and TV subscriptions instantly. Our Multi-Payment Network connects directly to local utility grids for zero-fail settlements.', fr: 'Réglez vos factures d\'électricité (Senelec), d\'eau et vos abonnements télé instantanément. Notre réseau se connecte directement aux réseaux locaux.' },
  
  feat_transfer_title: { en: 'Smart Transfers', fr: 'Transferts Intelligents' },
  feat_transfer_detail: { en: 'Experience friction-less cross-border rails. Move funds between Nigeria, Ghana, and Senegal with isolated currency wallets. Pay anyone via bank account or mobile wallet (MoMo/Wave) in seconds.', fr: 'Déplacez des fonds entre le Nigeria, le Ghana et le Sénégal. Payez n\'importe qui via compte bancaire ou portefeuille mobile (Wave/MoMo) en quelques secondes.' },
  
  feat_ai_title: { en: 'Gemini Analysis', fr: 'Analyse Gemini' },
  feat_ai_detail: { en: 'Gemini AI scans your transaction velocity to generate a unique credit score. This neural score unlocks instant micro-loans and personalized investment strategies tailored to West African market trends.', fr: 'L\'IA Gemini analyse votre vitesse de transaction pour générer un score de crédit unique. Ce score débloque des micro-crédits instantanés.' },
  
  feat_crypto_title: { en: 'Crypto Liquidity', fr: 'Liquidité Crypto' },
  feat_crypto_detail: { en: 'Trade BTC, ETH, and stablecoins directly using your local NGN, GHS, or XOF balance. No external P2P required—we provide deep liquidity pools for instant digital asset execution.', fr: 'Échangez du BTC, de l\'ETH et des stablecoins en utilisant votre solde local. Pas besoin de P2P externe—nous fournissons des pools de liquidité directs.' },
  
  feat_b2b_title: { en: 'Merchant Hub', fr: 'Hub Marchand' },
  feat_b2b_detail: { en: 'Professional invoicing tools for African entrepreneurs. Generate professional PDF invoices and handle bulk payroll disbursements to thousands of employees across the region with one click.', fr: 'Outils de facturation pour les entrepreneurs. Générez des factures PDF et gérez les paiements de salaires groupés en un clic.' },
  
  feat_nearby_title: { en: 'Infrastructure', fr: 'Infrastructure' },
  feat_nearby_detail: { en: 'Use Google Maps grounding to find the closest verified PayFlow agents, cash points, or bank branches. Never get stuck without a physical touchpoint for your cash-in and cash-out needs.', fr: 'Utilisez Google Maps pour trouver les agents PayFlow vérifiés, les points de retrait ou les agences bancaires les plus proches.' },

  dismiss_guide: { en: 'Got it, let\'s go!', fr: 'Compris, c\'est parti !' }
};

export const getLanguage = (country: Country): 'en' | 'fr' => {
  return country === 'Senegal' ? 'fr' : 'en';
};

export const t = (key: string, country: Country): string => {
  const lang = getLanguage(country);
  return translations[key]?.[lang] || key;
};
