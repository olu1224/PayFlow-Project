
import { Country } from './types';

export const translations: Record<string, Record<'en' | 'fr', string>> = {
  // Navigation
  nav_home: { en: 'Home', fr: 'Accueil' },
  nav_money_hub: { en: 'Money Hub', fr: 'Hub d\'Argent' },
  nav_loans: { en: 'Loans', fr: 'Prêts' },
  nav_crypto: { en: 'Crypto', fr: 'Crypto' },
  nav_work: { en: 'Work', fr: 'Travail' },
  nav_helpers: { en: 'Helpers', fr: 'Assistants' },
  nav_forge: { en: 'Deal Forge', fr: 'Forge des Deals' },
  nav_about: { en: 'About', fr: 'À Propos' },
  nav_settings: { en: 'Settings', fr: 'Paramètres' },
  nav_membership: { en: 'Elite Plan', fr: 'Plan Élite' },
  nav_elite: { en: 'Elite', fr: 'Élite' },
  history: { en: 'History', fr: 'Historique' },
  finance: { en: 'Finance', fr: 'Finance' },
  logout: { en: 'Logout', fr: 'Déconnexion' },

  // Command Bar
  send: { en: 'Send', fr: 'Envoyer' },
  request: { en: 'Request', fr: 'Demander' },
  scan: { en: 'Scan', fr: 'Scanner' },
  wallet: { en: 'Wallet', fr: 'Portefeuille' },
  money: { en: 'Money', fr: 'Argent' },
  funds: { en: 'Funds', fr: 'Fonds' },
  store_qr: { en: 'Store QR', fr: 'QR Boutique' },
  tap_to_pay: { en: 'Tap to Pay', fr: 'Paiement NFC' },
  withdraw: { en: 'Withdraw', fr: 'Retirer' },
  add_cash: { en: 'Add Cash', fr: 'Ajouter Fonds' },

  // Crypto Hub
  crypto_title: { en: 'Crypto Hub', fr: 'Hub Crypto' },
  crypto_subtitle: { en: 'Native African Liquidity Pool Active', fr: 'Pool de Liquidité Africaine Active' },
  crypto_market: { en: 'Market Grid', fr: 'Grille du Marché' },
  crypto_portfolio: { en: 'Your Portfolio', fr: 'Votre Portefeuille' },
  crypto_ledger: { en: 'Activity Ledger', fr: 'Grand Livre d\'Activité' },
  crypto_buy: { en: 'Buy', fr: 'Acheter' },
  crypto_sell: { en: 'Sell', fr: 'Vendre' },
  crypto_withdraw: { en: 'Withdraw', fr: 'Retirer' },
  crypto_success: { en: 'Transaction Finalized', fr: 'Transaction Finalisée' },

  // Deal Forge
  forge_title: { en: 'The Deal Forge', fr: 'La Forge des Deals' },
  forge_syndicate: { en: 'Live Syndicate Hub', fr: 'Hub de Syndicats en Direct' },
  forge_join: { en: 'Enter Syndicate', fr: 'Rejoindre le Syndicat' },
  forge_power: { en: 'Syndicate Power', fr: 'Puissance du Syndicat' },
  forge_members: { en: 'Members', fr: 'Membres' },
  forge_maker: { en: 'Become a Deal Maker', fr: 'Devenir un Créateur de Deal' },

  // History
  history_title: { en: 'Your History', fr: 'Votre Historique' },
  history_desc: { en: 'A complete list of your account activity.', fr: 'Une liste complète de vos activités.' },
  history_search: { en: 'Search by name or category...', fr: 'Rechercher par nom ou catégorie...' },
  history_sent: { en: 'Money Sent', fr: 'Argent Envoyé' },
  history_received: { en: 'Money Received', fr: 'Argent Reçu' },
  history_deposits: { en: 'Deposits', fr: 'Dépôts' },
  history_for: { en: 'What was it for?', fr: 'Pour quel usage ?' },
  history_cat: { en: 'Category', fr: 'Catégorie' },
  history_when: { en: 'When?', fr: 'Quand ?' },
  history_amount: { en: 'Amount', fr: 'Montant' },

  // Membership
  plan_title: { en: 'Select Your Sovereignty', fr: 'Choisissez Votre Souveraineté' },
  plan_standard: { en: 'Standard', fr: 'Standard' },
  plan_elite: { en: 'Elite Pro', fr: 'Élite Pro' },
  plan_enterprise: { en: 'Enterprise', fr: 'Entreprise' },
  plan_active: { en: 'Active Plan', fr: 'Plan Actif' },
  plan_activate: { en: 'Activate Plan', fr: 'Activer le Plan' },

  // Dashboard & Misc
  hello: { en: 'Hello', fr: 'Bonjour' },
  vault_balance: { en: 'Vault Balance', fr: 'Solde du Coffre' },
  universal_grid: { en: 'Universal Grid', fr: 'Grille Universelle' },
  recent_activity: { en: 'Recent Activity', fr: 'Activité Récente' },
  greeting_morning: { en: 'Good Morning', fr: 'Bon Matin' },
  greeting_afternoon: { en: 'Good Afternoon', fr: 'Bon Après-midi' },
  greeting_evening: { en: 'Good Evening', fr: 'Bonsoir' },
};

export const getLanguage = (country: Country): 'en' | 'fr' => {
  return country === 'Senegal' ? 'fr' : 'en';
};

export const t = (key: string, country: Country): string => {
  const lang = getLanguage(country);
  return translations[key]?.[lang] || key;
};
