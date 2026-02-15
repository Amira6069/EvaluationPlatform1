export const USER_ROLES = {
  ORGANIZATION: 'ORGANIZATION',
  EVALUATOR: 'EVALUATOR',
  ADMINISTRATOR: 'ADMINISTRATOR',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ORG_DASHBOARD: '/organization/dashboard',
  ORG_EVALUATIONS: '/organization/evaluations',
  ORG_EVALUATION_NEW: '/organization/evaluations/new',
  ORG_EVALUATION_FORM: '/organization/evaluations/:id/form',
  ORG_EVALUATION_DETAILS: '/organization/evaluations/:id',
  ORG_RESULTS: '/organization/results',
  EVAL_DASHBOARD: '/evaluator/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
};

export const STORAGE_KEYS = {
  TOKEN: 'governance_token',
  USER: 'governance_user',
};

// MATURITY LEVELS (4-level scale: 0-3)
export const MATURITY_LEVELS = [
  {
    value: 0,
    label: "N'existe pas",
    labelEn: "Does not exist",
    color: '#ef4444',
    description: "Aucune pratique n'est mise en place",
  },
  {
    value: 1,
    label: 'En cours',
    labelEn: 'In progress',
    color: '#f59e0b',
    description: 'Pratique en cours de développement',
  },
  {
    value: 2,
    label: 'Réalisé',
    labelEn: 'Completed',
    color: '#3b82f6',
    description: 'Pratique mise en œuvre',
  },
  {
    value: 3,
    label: 'Validé',
    labelEn: 'Validated',
    color: '#10b981',
    description: 'Pratique validée et suivie',
  },
];

// 12 GOVERNANCE PRINCIPLES WITH PRACTICES AND CRITERIA
export const GOVERNANCE_PRINCIPLES = [
  {
    id: 1,
    name: 'Finalité',
    nameEn: 'Purpose',
    description: 'Mission, vision et objectifs de l\'organisme',
    practices: [
      {
        id: 1,
        name: 'Définition de la mission',
        criteria: [
          {
            id: 1,
            text: 'Une mission claire soit définie et documentée',
            evidence: 'Document de mission, charte organisationnelle',
          },
          {
            id: 2,
            text: 'La mission soit communiquée à toutes les parties prenantes',
            evidence: 'Plan de communication, supports de communication',
          },
        ],
      },
      {
        id: 2,
        name: 'Vision stratégique',
        criteria: [
          {
            id: 3,
            text: 'Une vision à long terme soit établie',
            evidence: 'Document de vision stratégique',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Création de valeur',
    nameEn: 'Value Creation',
    description: 'Création et distribution de valeur',
    practices: [
      {
        id: 1,
        name: 'Mesure de la valeur créée',
        criteria: [
          {
            id: 1,
            text: 'Des indicateurs de création de valeur soient définis',
            evidence: 'Tableau de bord, KPIs',
          },
          {
            id: 2,
            text: 'La valeur créée soit mesurée périodiquement',
            evidence: 'Rapports de performance, bilans',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Stratégie',
    nameEn: 'Strategy',
    description: 'Planification stratégique',
    practices: [
      {
        id: 1,
        name: 'Plan stratégique',
        criteria: [
          {
            id: 1,
            text: 'Un plan stratégique pluriannuel soit élaboré',
            evidence: 'Plan stratégique 3-5 ans',
          },
          {
            id: 2,
            text: 'Le plan stratégique soit révisé régulièrement',
            evidence: 'Rapports de révision, mises à jour',
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Surveillance',
    nameEn: 'Monitoring',
    description: 'Systèmes de contrôle et surveillance',
    practices: [
      {
        id: 1,
        name: 'Contrôle interne',
        criteria: [
          {
            id: 1,
            text: 'Un système de contrôle interne soit mis en place',
            evidence: 'Manuel de contrôle interne, procédures',
          },
          {
            id: 2,
            text: 'Des audits internes soient réalisés périodiquement',
            evidence: 'Rapports d\'audit interne, calendrier',
          },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'Redevabilité',
    nameEn: 'Accountability',
    description: 'Responsabilité et transparence',
    practices: [
      {
        id: 1,
        name: 'Information publique',
        criteria: [
          {
            id: 1,
            text: 'Un site web officiel existe',
            evidence: 'URL du site web, captures d\'écran',
          },
          {
            id: 2,
            text: 'Les informations financières sont publiées',
            evidence: 'Rapports financiers publiés',
          },
        ],
      },
      {
        id: 2,
        name: 'Reporting',
        criteria: [
          {
            id: 3,
            text: 'Des rapports annuels sont publiés',
            evidence: 'Rapports annuels',
          },
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'Dialogue avec les parties prenantes',
    nameEn: 'Stakeholder Dialogue',
    description: 'Communication avec les parties prenantes',
    practices: [
      {
        id: 1,
        name: 'Engagement des parties prenantes',
        criteria: [
          {
            id: 1,
            text: 'Les parties prenantes soient identifiées',
            evidence: 'Cartographie des parties prenantes',
          },
          {
            id: 2,
            text: 'Des mécanismes de consultation soient établis',
            evidence: 'Procédures de consultation, comptes-rendus',
          },
        ],
      },
    ],
  },
  {
    id: 7,
    name: 'Leadership',
    nameEn: 'Leadership',
    description: 'Leadership et culture organisationnelle',
    practices: [
      {
        id: 1,
        name: 'Gouvernance du conseil',
        criteria: [
          {
            id: 1,
            text: 'Un conseil d\'administration/conseil soit constitué',
            evidence: 'Composition du conseil, règlement intérieur',
          },
          {
            id: 2,
            text: 'Le conseil se réunit régulièrement',
            evidence: 'Calendrier des réunions, PV',
          },
        ],
      },
    ],
  },
  {
    id: 8,
    name: 'Données et décisions',
    nameEn: 'Data & Decisions',
    description: 'Gestion des données et prise de décision',
    practices: [
      {
        id: 1,
        name: 'Gestion des données',
        criteria: [
          {
            id: 1,
            text: 'Un système de gestion des données soit mis en place',
            evidence: 'Système informatique, base de données',
          },
          {
            id: 2,
            text: 'Les décisions soient basées sur des données',
            evidence: 'Rapports d\'analyse, tableaux de bord',
          },
        ],
      },
    ],
  },
  {
    id: 9,
    name: 'Gouvernance de risque',
    nameEn: 'Risk Governance',
    description: 'Gestion des risques',
    practices: [
      {
        id: 1,
        name: 'Identification des risques',
        criteria: [
          {
            id: 1,
            text: 'Une cartographie des risques soit élaborée',
            evidence: 'Cartographie des risques, registre',
          },
          {
            id: 2,
            text: 'Des plans de mitigation soient définis',
            evidence: 'Plans d\'action, mesures de mitigation',
          },
        ],
      },
    ],
  },
  {
    id: 10,
    name: 'Responsabilité sociétale',
    nameEn: 'Social Responsibility',
    description: 'Impact social et environnemental',
    practices: [
      {
        id: 1,
        name: 'Impact social',
        criteria: [
          {
            id: 1,
            text: 'L\'impact social soit mesuré',
            evidence: 'Rapport d\'impact social, indicateurs',
          },
          {
            id: 2,
            text: 'Des actions RSE soient mises en œuvre',
            evidence: 'Plan RSE, actions concrètes',
          },
        ],
      },
    ],
  },
  {
    id: 11,
    name: 'Viabilité et pérennité',
    nameEn: 'Sustainability',
    description: 'Durabilité de l\'organisation',
    practices: [
      {
        id: 1,
        name: 'Planification financière',
        criteria: [
          {
            id: 1,
            text: 'Un budget prévisionnel soit élaboré',
            evidence: 'Budget annuel, plan financier',
          },
          {
            id: 2,
            text: 'La viabilité financière soit assurée',
            evidence: 'États financiers, ratio de liquidité',
          },
        ],
      },
    ],
  },
  {
    id: 12,
    name: 'Maîtrise de la corruption',
    nameEn: 'Corruption Control',
    description: 'Prévention et lutte contre la corruption',
    practices: [
      {
        id: 1,
        name: 'Code d\'éthique',
        criteria: [
          {
            id: 1,
            text: 'Un code d\'éthique soit élaboré',
            evidence: 'Code ou charte d\'éthique',
          },
          {
            id: 2,
            text: 'Le personnel soit sensibilisé au code d\'éthique',
            evidence: 'Plan de sensibilisation, attestations',
          },
          {
            id: 3,
            text: 'Le code d\'éthique soit signé par tous les membres',
            evidence: 'Registre des signataires',
          },
        ],
      },
      {
        id: 2,
        name: 'Gestion des conflits d\'intérêts',
        criteria: [
          {
            id: 4,
            text: 'Un processus de déclaration des intérêts soit défini',
            evidence: 'Procédure, formulaires de déclaration',
          },
          {
            id: 5,
            text: 'Une politique des cadeaux soit mise en place',
            evidence: 'Politique des cadeaux',
          },
        ],
      },
    ],
  },
];
