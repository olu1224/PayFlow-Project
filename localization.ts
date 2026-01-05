
import { Country } from './types';

export const translations: Record<string, Record<'en' | 'fr', string>> = {
  // Common
  home: { en: 'Home', fr: 'Accueil' },
  dashboard: { en: 'Dashboard', fr: 'Tableau de bord' },
  workspace: { en: 'workspace', fr: 'espace' },
  good_morning: { en: 'Good Morning', fr: 'Bon Matin' },
  good_afternoon: { en: 'Good Afternoon', fr: 'Bon Après-midi' },
  good_evening: { en: 'Good Evening', fr: 'Bonsoir' },
  
  // Navigation
  money_hub: { en: 'Money Hub', fr: 'Hub d\'Argent' },
  loans: { en: 'Loans', fr: 'Prêts' },
  crypto: { en: 'Crypto', fr: 'Crypto' },
  forge: { en: 'Deal Forge', fr: 'Forge' },
  elite: { en: 'Elite', fr: 'Élite' },
  history: { en: 'History', fr: 'Historique' },
  settings: { en: 'Settings', fr: 'Paramètres' },
  logout: { en: 'Logout', fr: 'Déconnexion' },

  // Command Bar (Top Actions)
  send: { en: 'Send', fr: 'Envoyer' },
  request: { en: 'Request', fr: 'Demander' },
  scan: { en: 'Scan', fr: 'Scanner' },
  wallet: { en: 'Wallet', fr: 'Portefeuille' },
  money: { en: 'Money', fr: 'Argent' },
  funds: { en: 'Funds', fr: 'Fonds' },
  store_qr: { en: 'Store QR', fr: 'Boutique' },
  tap_to_pay: { en: 'Tap to Pay', fr: 'Paiement' },

  // Vault
  vault_balance: { en: 'Vault Balance', fr: 'Solde du Coffre' },
  withdraw: { en: 'Withdraw', fr: 'Retirer' },
  add_cash: { en: 'Add Cash', fr: 'Ajouter' },

  // Feature Cards (Main Dashboard Widget)
  bills_title: { en: 'Pay Bills', fr: 'Factures' },
  bills_desc: { en: 'Instantly pay for electricity, internet, and cable TV.', fr: 'Payez l\'électricité, l\'internet et la TV.' },
  bills_action: { en: 'Pay Now', fr: 'Payer' },
  
  transfer_title: { en: 'Transfer', fr: 'Transfert' },
  transfer_desc: { en: 'Send money to any bank or mobile wallet instantly.', fr: 'Envoyez de l\'argent vers n\'importe quelle banque.' },
  transfer_action: { en: 'Send Money', fr: 'Envoyer' },
  
  savings_title: { en: 'Savings', fr: 'Épargne' },
  savings_desc: { en: 'Protect your funds from inflation with smart goals.', fr: 'Protégez vos fonds contre l\'inflation.' },
  savings_action: { en: 'Start Saving', fr: 'Épargner' },
  
  crypto_title: { en: 'Crypto', fr: 'Crypto' },
  crypto_desc: { en: 'Buy and sell Bitcoin or Tether safely.', fr: 'Achetez du Bitcoin ou Tether en sécurité.' },
  crypto_action: { en: 'Go to Crypto', fr: 'Vers Crypto' },
  
  business_title: { en: 'Business', fr: 'Pro' },
  business_desc: { en: 'Enterprise tools for invoicing and bulk payments.', fr: 'Outils pro pour factures et paiements groupés.' },
  business_action: { en: 'Business Hub', fr: 'Hub Pro' },
  
  nearby_title: { en: 'Nearby', fr: 'À proximité' },
  nearby_desc: { en: 'Find verified agents and bank branches near you.', fr: 'Trouvez des agents et des banques proches.' },
  nearby_action: { en: 'Find Agents', fr: 'Chercher' },

  // Sections
  universal_grid: { en: 'Universal Grid', fr: 'Grille Universelle' },
  mpn_subtitle: { en: 'Mobile • Power • Network', fr: 'Mobile • Énergie • Réseau' },
  recent_activity: { en: 'Recent Activity', fr: 'Activité Récente' },
  audit_history: { en: 'Audit History', fr: 'Historique' },

  // About
  about_title: { en: 'Zynctra Pro', fr: 'Zynctra Pro' },
  about_quote: { en: 'The Pan-African financial infrastructure for high-velocity settlements.', fr: 'L\'infrastructure financière panafricaine pour les règlements à grande vitesse.' },
  security: { en: 'Security', fr: 'Sécurité' },
  usability: { en: 'Usability', fr: 'Utilisabilité' },
  simplicity: { en: 'Simplicity', fr: 'Simplicité' },
  mission_statement: { en: 'Mission Statement', fr: 'Déclaration de Mission' },

  // Onboarding
  plan: { en: 'Plan', fr: 'Plan' },
  define_identity: { en: 'Define your identity on the hub.', fr: 'Définissez votre identité sur le hub.' },
  full_legal_name: { en: 'Full Legal Name', fr: 'Nom Légal Complet' },
  continue: { en: 'Continue', fr: 'Continuer' },
  back: { en: 'Back', fr: 'Retour' }
};

export const getLanguage = (country: Country): 'en' | 'fr' => {
  return country === 'Senegal' ? 'fr' : 'en';
};

export const t = (key: string, country: Country): string => {
  const lang = getLanguage(country);
  const result = translations[key]?.[lang];
  
  if (!result) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  return result;
};
