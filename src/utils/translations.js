export const translations = {
  en: {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    users: 'Users',
    evaluations: 'Evaluations',
    governance: 'Governance',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    email: 'Email Address',
    password: 'Password',
    signIn: 'Sign In',
    register: 'Register',
    // Add more translations...
  },
  fr: {
    welcome: 'Bienvenue',
    dashboard: 'Tableau de bord',
    users: 'Utilisateurs',
    evaluations: 'Évaluations',
    governance: 'Gouvernance',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    login: 'Connexion',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    signIn: 'Se connecter',
    register: "S'inscrire",
    // Add more translations...
  },
  ar: {
    welcome: 'مرحبا',
    dashboard: 'لوحة القيادة',
    users: 'المستخدمون',
    evaluations: 'التقييمات',
    governance: 'الحوكمة',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    register: 'التسجيل',
    // Add more translations...
  },
};

export const t = (key, lang = 'en') => {
  return translations[lang]?.[key] || key;
};