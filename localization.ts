
import { Country } from './types';

export const translations: Record<string, Record<'en' | 'fr', string>> = {
  // Navigation
  nav_home: { en: 'Home', fr: 'Accueil' },
  nav_money_hub: { en: 'Money Hub', fr: 'Hub d\'Argent' },
  nav_loans: { en: 'Loans', fr: 'Prêts' },
  nav_crypto: { en: 'Crypto', fr: 'Crypto' },
  nav_work: { en: 'Work', fr: 'Travail' },
  nav_helpers: { en: 'Helpers', fr: 'Assistants' },
  nav_forge: { en: 'Forge', fr: 'Forge' },
  nav_about: { en: 'About', fr: 'À Propos' },
  nav_settings: { en: 'Settings', fr: 'Paramètres' },
  nav_membership: { en: 'Elite Plan', fr: 'Plan Élite' },
  nav_elite: { en: 'Elite', fr: 'Élite' },
  history: { en: 'History', fr: 'Historique' },
  finance: { en: 'Finance', fr: 'Finance' },

  // Dashboard
  hello: { en: 'Hello', fr: 'Bonjour' },
  select_grid: { en: 'Select Regional Node', fr: 'Choisir le Nœud Régional' },
  wallet_balance: { en: 'Vault Balance', fr: 'Solde du Coffre' },
  mpn_grid: { en: 'The MPN Grid', fr: 'La Grille MPN' },
  mpn_subtitle: { en: 'Mobile • Power • Network Settlements', fr: 'Règlements Mobile • Énergie • Réseau' },
  recent_transactions: { en: 'Recent Transactions', fr: 'Transactions Récentes' },
  see_more: { en: 'See More', fr: 'Voir Plus' },
  built_in_2025: { en: 'Built for 2025', fr: 'Conçu pour 2025' },
  secure_regional_payments: { en: 'Secure Regional Node', fr: 'Nœud Régional Sécurisé' },
  greeting_morning: { en: 'Good Morning', fr: 'Bon Matin' },
  greeting_afternoon: { en: 'Good Afternoon', fr: 'Bon Après-midi' },
  greeting_evening: { en: 'Good Evening', fr: 'Bonsoir' },

  // Feature Cards
  feat_bills_title: { en: 'Pay Your Bills', fr: 'Payez Vos Factures' },
  feat_bills_action: { en: 'PAY A BILL', fr: 'PAYER' },
  feat_bills_detail: { en: "Pay for electricity, internet, and TV subscriptions instantly.", fr: "Payez l'électricité, l'internet et les abonnements TV instantanément." },
  feat_transfer_title: { en: 'Send Money', fr: 'Envoyer l\'Argent' },
  feat_transfer_action: { en: 'SEND MONEY', fr: 'ENVOYER' },
  feat_transfer_detail: { en: "Quickly send money to friends and family in the region.", fr: "Envoyez rapidement de l'argent à vos proches dans la région." },
  feat_savings_title: { en: 'Save & Grow', fr: 'Épargner & Grandir' },
  feat_savings_action: { en: 'START SAVING', fr: 'ÉPARGNER' },
  feat_savings_detail: { en: "Build your future. We help you save small amounts daily.", fr: "Préparez votre avenir. Nous vous aidons à épargner quotidiennement." },
  feat_crypto_title: { en: 'Buy & Sell Crypto', fr: 'Achat/Vente Crypto' },
  feat_crypto_action: { en: 'GO TO CRYPTO', fr: 'VERS CRYPTO' },
  feat_crypto_detail: { en: "Safely buy or sell Bitcoin and other digital coins.", fr: "Achetez ou vendez du Bitcoin et d'autres jetons en sécurité." },
  feat_business_title: { en: 'For Your Business', fr: 'Pour Votre Business' },
  feat_business_action: { en: 'BUSINESS TOOLS', fr: 'OUTILS PRO' },
  feat_business_detail: { en: "Create invoices and pay your staff easily.", fr: "Créez des factures et payez votre personnel facilement." },
  feat_nearby_title: { en: 'Find Help Nearby', fr: 'Aide à Proximité' },
  feat_nearby_action: { en: 'FIND AGENTS', fr: 'TROUVER AGENTS' },
  feat_nearby_detail: { en: "Need cash or assistance? Find the closest Zynctra agents.", fr: "Besoin d'argent ou d'aide ? Trouvez les agents Zynctra proches." },

  // Grid Items
  grid_electricity: { en: 'Electricity', fr: 'Électricité' },
  grid_internet: { en: 'Internet', fr: 'Internet' },
  grid_tv: { en: 'TV & Cable', fr: 'Télévision' },
  grid_food: { en: 'Order Food', fr: 'Restauration' },
  grid_transfer: { en: 'Transfer', fr: 'Transfert' },
  grid_airtime: { en: 'Airtime', fr: 'Crédit Appels' },
  grid_groceries: { en: 'Groceries', fr: 'Courses' },
  grid_transport: { en: 'Transport', fr: 'Transport' },
  grid_betting: { en: 'Betting', fr: 'Jeux & Paris' },
  grid_gov: { en: 'Gov Services', fr: 'Services Publics' },
  grid_international: { en: 'International', fr: 'International' },

  grid_desc_electricity: { en: 'Pay for light', fr: 'Payer le courant' },
  grid_desc_internet: { en: 'Data & Fiber', fr: 'Data & Fibre' },
  grid_desc_tv: { en: 'Canal+ / DSTV', fr: 'Canal+ / TNT' },
  grid_desc_food: { en: 'Fast Delivery', fr: 'Livraison Rapide' },
  grid_desc_transfer: { en: 'To Banks', fr: 'Vers Banques' },
  grid_desc_airtime: { en: 'Refill Credit', fr: 'Recharge Crédit' },
  grid_desc_groceries: { en: 'Supermarkets', fr: 'Supermarchés' },
  grid_desc_transport: { en: 'Bus & Cab', fr: 'Bus & Taxis' },
  grid_desc_betting: { en: 'Wallet top-ups', fr: 'Recharge Compte' },
  grid_desc_gov: { en: 'Utility settlements', fr: 'Services Publics' },

  // About Page
  about_title: { en: 'The Zynctra Protocol', fr: 'Le Protocole Zynctra' },
  about_quote: { en: 'Engineering the financial future of West Africa, one node at a time.', fr: 'Façonner l\'avenir financier de l\'Afrique de l\'Ouest, un nœud à la fois.' },
  security: { en: 'Ironclad Security', fr: 'Sécurité d\'Acier' },
  usability: { en: 'Inclusive Design', fr: 'Conception Inclusive' },
  simplicity: { en: 'Total Simplicity', fr: 'Simplicité Totale' },
  mission_statement: { en: 'Our Mission', fr: 'Notre Mission' },
};

export const getLanguage = (country: Country): 'en' | 'fr' => {
  return country === 'Senegal' ? 'fr' : 'en';
};

export const t = (key: string, country: Country): string => {
  const lang = getLanguage(country);
  return translations[key]?.[lang] || key;
};
