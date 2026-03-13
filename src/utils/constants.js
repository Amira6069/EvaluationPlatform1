export const USER_ROLES = {
  ORGANIZATION: 'ORGANIZATION',
  EVALUATOR: 'EVALUATOR',
  ADMIN: 'ADMIN',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',

  ORG_DASHBOARD: '/organization/dashboard',
  ORG_EVALUATIONS: '/organization/evaluations',
  ORG_RESULTS: '/organization/results',
  ORG_SETTINGS: '/organization/settings',

  EVAL_DASHBOARD: '/evaluator/dashboard',
  EVAL_PENDING: '/evaluator/pending',
  EVAL_REVIEWED: '/evaluator/reviewed',

  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_EVALUATIONS: '/admin/evaluations',
  ADMIN_GOVERNANCE: '/admin/governance',
};

export const STORAGE_KEYS = {
  TOKEN: 'governance_token',
  USER: 'governance_user',
  LANGUAGE: 'governance_language',
};

export const EVALUATION_STATUS = {
  CREATED: 'CREATED',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const CERTIFICATION_LABELS = {
  NOT_CERTIFIED: 'Not Certified',
  CERTIFIED: 'Bronze',
  CERTIFIED_SILVER: 'Silver',
  CERTIFIED_GOLD: 'Gold',
  CERTIFIED_PLATINUM: 'Platinum',
};

export const MATURITY_LEVELS = {
  0: "N'existe pas",
  1: 'En cours de développement',
  2: 'Réalisé',
  3: 'Validé et optimisé',
};

export const MATURITY_LEVEL_OPTIONS = [
  { value: 0, label: "0 - N'existe pas" },
  { value: 1, label: '1 - En cours' },
  { value: 2, label: '2 - Réalisé' },
  { value: 3, label: '3 - Validé' },
];

export const GOVERNANCE_PRINCIPLES = [
  {
    id: 1,
    number: 1,
    name: 'Finalité',
    color: '#3b82f6',
    practices: [
      {
        id: 1,
        name: 'Définir la finalité',
        criteria: [
          { id: 1, text: "L'organisation a défini sa finalité de manière claire", evidence: 'Document de finalité' },
          { id: 2, text: "La finalité est communiquée à toutes les parties prenantes", evidence: 'Plan de communication' },
        ],
      },
      {
        id: 2,
        name: 'Alignement stratégique',
        criteria: [
          { id: 1, text: "Les objectifs sont alignés avec la finalité", evidence: 'Plan stratégique' },
        ],
      },
    ],
  },
  {
    id: 2,
    number: 2,
    name: 'Création de valeur',
    color: '#8b5cf6',
    practices: [
      {
        id: 1,
        name: 'Identifier les sources de valeur',
        criteria: [
          { id: 1, text: "L'organisation a identifié ses sources de création de valeur", evidence: 'Analyse de valeur' },
          { id: 2, text: "Les indicateurs de valeur sont définis", evidence: 'Tableau de bord' },
        ],
      },
      {
        id: 2,
        name: 'Mesurer la valeur créée',
        criteria: [
          { id: 1, text: "Un système de mesure de la valeur est en place", evidence: 'Système de mesure' },
        ],
      },
    ],
  },
  {
    id: 3,
    number: 3,
    name: 'Stratégie',
    color: '#ec4899',
    practices: [
      {
        id: 1,
        name: 'Élaborer la stratégie',
        criteria: [
          { id: 1, text: "Une stratégie documentée existe", evidence: 'Document stratégique' },
          { id: 2, text: "La stratégie est revue régulièrement", evidence: 'Procès-verbaux de révision' },
        ],
      },
      {
        id: 2,
        name: 'Déployer la stratégie',
        criteria: [
          { id: 1, text: "Un plan de déploiement est en place", evidence: 'Plan de déploiement' },
        ],
      },
    ],
  },
  {
    id: 4,
    number: 4,
    name: 'Surveillance',
    color: '#f59e0b',
    practices: [
      {
        id: 1,
        name: 'Surveiller les performances',
        criteria: [
          { id: 1, text: "Un système de surveillance est établi", evidence: 'Système de monitoring' },
          { id: 2, text: "Des rapports réguliers sont produits", evidence: 'Rapports mensuels' },
        ],
      },
      {
        id: 2,
        name: 'Audits internes',
        criteria: [
          { id: 1, text: "Des audits internes sont réalisés régulièrement", evidence: 'Rapports d\'audit' },
        ],
      },
    ],
  },
  {
    id: 5,
    number: 5,
    name: 'Redevabilité',
    color: '#10b981',
    practices: [
      {
        id: 1,
        name: 'Définir les responsabilités',
        criteria: [
          { id: 1, text: "Les rôles et responsabilités sont clairement définis", evidence: 'Organigramme' },
          { id: 2, text: "Un système de reddition de comptes existe", evidence: 'Procédures de reddition' },
        ],
      },
      {
        id: 2,
        name: 'Transparence',
        criteria: [
          { id: 1, text: "L'organisation communique de manière transparente", evidence: 'Rapports publics' },
        ],
      },
    ],
  },
  {
    id: 6,
    number: 6,
    name: 'Parties prenantes',
    color: '#06b6d4',
    practices: [
      {
        id: 1,
        name: 'Identifier les parties prenantes',
        criteria: [
          { id: 1, text: "Les parties prenantes sont identifiées", evidence: 'Cartographie des PP' },
          { id: 2, text: "Les attentes des PP sont documentées", evidence: 'Registre des attentes' },
        ],
      },
      {
        id: 2,
        name: 'Engager les parties prenantes',
        criteria: [
          { id: 1, text: "Un plan d'engagement existe", evidence: 'Plan d\'engagement' },
        ],
      },
    ],
  },
  {
    id: 7,
    number: 7,
    name: 'Leadership',
    color: '#6366f1',
    practices: [
      {
        id: 1,
        name: 'Exercer le leadership',
        criteria: [
          { id: 1, text: "La direction démontre son leadership", evidence: 'Évaluations 360°' },
          { id: 2, text: "Une culture de gouvernance est promue", evidence: 'Programme de formation' },
        ],
      },
      {
        id: 2,
        name: 'Développer les compétences',
        criteria: [
          { id: 1, text: "Un plan de développement des compétences existe", evidence: 'Plan de formation' },
        ],
      },
    ],
  },
  {
    id: 8,
    number: 8,
    name: 'Données et décisions',
    color: '#8b5cf6',
    practices: [
      {
        id: 1,
        name: 'Gérer les données',
        criteria: [
          { id: 1, text: "Un système de gestion des données est en place", evidence: 'Politique de données' },
          { id: 2, text: "La qualité des données est assurée", evidence: 'Procédures qualité' },
        ],
      },
      {
        id: 2,
        name: 'Prendre des décisions éclairées',
        criteria: [
          { id: 1, text: "Les décisions sont basées sur des données", evidence: 'Processus décisionnel' },
        ],
      },
    ],
  },
  {
    id: 9,
    number: 9,
    name: 'Gouvernance de risque',
    color: '#ef4444',
    practices: [
      {
        id: 1,
        name: 'Identifier les risques',
        criteria: [
          { id: 1, text: "Un registre des risques existe", evidence: 'Registre des risques' },
          { id: 2, text: "Les risques sont évalués régulièrement", evidence: 'Évaluations de risques' },
        ],
      },
      {
        id: 2,
        name: 'Gérer les risques',
        criteria: [
          { id: 1, text: "Des plans de mitigation sont en place", evidence: 'Plans de mitigation' },
        ],
      },
    ],
  },
  {
    id: 10,
    number: 10,
    name: 'Responsabilité sociétale',
    color: '#22c55e',
    practices: [
      {
        id: 1,
        name: 'Définir les engagements sociétaux',
        criteria: [
          { id: 1, text: "Des engagements RSE sont définis", evidence: 'Politique RSE' },
          { id: 2, text: "Les impacts sociétaux sont mesurés", evidence: 'Rapport d\'impact' },
        ],
      },
      {
        id: 2,
        name: 'Mettre en œuvre les actions RSE',
        criteria: [
          { id: 1, text: "Un plan d'action RSE est déployé", evidence: 'Plan d\'action RSE' },
        ],
      },
    ],
  },
  {
    id: 11,
    number: 11,
    name: 'Viabilité et pérennité',
    color: '#14b8a6',
    practices: [
      {
        id: 1,
        name: 'Assurer la viabilité',
        criteria: [
          { id: 1, text: "Un modèle économique viable est établi", evidence: 'Business plan' },
          { id: 2, text: "La pérennité financière est surveillée", evidence: 'Indicateurs financiers' },
        ],
      },
      {
        id: 2,
        name: 'Planifier la continuité',
        criteria: [
          { id: 1, text: "Un plan de continuité existe", evidence: 'Plan de continuité' },
        ],
      },
    ],
  },
  {
    id: 12,
    number: 12,
    name: 'Maîtrise de la corruption',
    color: '#dc2626',
    practices: [
      {
        id: 1,
        name: 'Prévenir la corruption',
        criteria: [
          { id: 1, text: "Une politique anti-corruption existe", evidence: 'Politique anti-corruption' },
          { id: 2, text: "Des formations sont dispensées", evidence: 'Programme de formation' },
        ],
      },
      {
        id: 2,
        name: 'Détecter et signaler',
        criteria: [
          { id: 1, text: "Un système de signalement est en place", evidence: 'Ligne d\'alerte éthique' },
        ],
      },
    ],
  },
];

export const LANGUAGES = {
  EN: 'en',
  FR: 'fr',
  AR: 'ar',
};

export const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇹🇳' },
];