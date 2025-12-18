
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

  // Onboarding / Tour
  tour_welcome_title: { en: 'Operational Briefing', fr: 'Briefing Opérationnel' },
  tour_welcome_desc: { en: 'Prepare to navigate the regional financial grid.', fr: 'Préparez-vous à naviguer sur la grille financière.' },
  tour_step1_title: { en: 'MPN SETTLEMENT', fr: 'RÈGLEMENT MPN' },
  tour_step1_desc: { en: 'Direct utility node connections for instant payments.', fr: 'Connexions directes pour paiements instantanés.' },
  tour_step2_title: { en: 'LIQUIDITY POOLS', fr: 'POOLS DE LIQUIDITÉ' },
  tour_step2_desc: { en: 'Native GHS, NGN, and XOF crypto on-ramps.', fr: 'Passerelles crypto GHS, NGN et XOF natives.' },
  tour_step3_title: { en: 'NEURAL SCORING', fr: 'SCORE NEURAL' },
  tour_step3_desc: { en: 'AI-driven credit limits based on transaction velocity.', fr: 'Limites de crédit IA basées sur votre activité.' },
  tour_finish: { en: 'Complete Briefing', fr: 'Terminer le Briefing' },

  // Feature Guide Toggles
  guide_title: { en: 'MASTER PAYFLOW PRO', fr: 'MAÎTRISEZ PAYFLOW PRO' },
  guide_subtitle: { en: 'Your Pan-African Financial OS is active.', fr: 'Votre OS financier panafricain est activé.' },
  
  feat_bills_title: { en: 'MPN Bill Center', fr: 'Centre de Factures MPN' },
  feat_bills_detail: { en: 'Settle Electricity (IKEDC, ECG, Senelec), Water, and TV subscriptions instantly.', fr: 'Réglez vos factures d\'électricité, d\'eau et télé instantanément.' },
  
  feat_transfer_title: { en: 'Smart Transfers', fr: 'Transferts Intelligents' },
  feat_transfer_detail: { en: 'Experience friction-less cross-border rails between NG, GH, and SN.', fr: 'Déplacez des fonds sans friction entre NG, GH et SN.' },
  
  feat_ai_title: { en: 'Gemini Analysis', fr: 'Analyse Gemini' },
  feat_ai_detail: { en: 'Gemini AI scans your transaction velocity to generate a unique credit score.', fr: 'L\'IA Gemini analyse votre vitesse de transaction pour un score unique.' },
  
  feat_crypto_title: { en: 'Crypto Liquidity', fr: 'Liquidité Crypto' },
  feat_crypto_detail: { en: 'Trade BTC, ETH, and stablecoins directly using local fiat.', fr: 'Échangez du BTC et ETH en utilisant votre monnaie locale.' },
  
  feat_b2b_title: { en: 'Merchant Hub', fr: 'Hub Marchand' },
  feat_b2b_detail: { en: 'Professional invoicing and bulk payroll tools for African entrepreneurs.', fr: 'Facturation pro et outils de paie pour les entrepreneurs.' },
  
  feat_nearby_title: { en: 'Infrastructure', fr: 'Infrastructure' },
  feat_nearby_detail: { en: 'Find verified PayFlow agents and ATMs near you using Google Maps.', fr: 'Trouvez des agents et distributeurs via Google Maps.' },

  dismiss_guide: { en: 'Got it, let\'s go!', fr: 'Compris, c\'est parti !' }
};

export const getLanguage = (country: Country): 'en' | 'fr' => {
  return country === 'Senegal' ? 'fr' : 'en';
};

export const t = (key: string, country: Country): string => {
  const lang = getLanguage(country);
  return translations[key]?.[lang] || key;
};
