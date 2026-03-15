import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ✅ INLINE TRANSLATIONS - NO JSON IMPORT ISSUES
const resources = {
  en: {
    translation: {
      auth: {
        welcomeBack: "Welcome Back",
        signInToContinue: "Sign in to continue to your account",
        email: "Email Address",
        enterEmail: "Enter your email",
        password: "Password",
        enterPassword: "Enter your password",
        signIn: "Sign In",
        signUp: "Sign Up",
        register: "Register",
        login: "Login",
        logout: "Logout",
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: "Already have an account?",
        createAccount: "Create Your Account",
        getStarted: "Get started with your governance evaluation",
        fullName: "Full Name",
        enterFullName: "Enter your full name",
        confirmPassword: "Confirm Password",
        enterConfirmPassword: "Confirm your password",
        organizationName: "Organization Name",
        selectRole: "Select Role",
        organization: "Organization",
        evaluator: "Evaluator",
        admin: "Administrator"
      },
      user: {
        organization: "Organization",
        evaluator: "Evaluator",
        admin: "Administrator",
        profile: "Profile",
        settings: "Settings",
        account: "Account",
        role: "Role",
        roles: "Roles"
      },
      nav: {
        dashboard: "Dashboard",
        evaluations: "Evaluations",
        newEvaluation: "New Evaluation",
        results: "Results",
        settings: "Settings",
        logout: "Logout",
        queue: "Queue",
        review: "Review",
        users: "Users",
        governance: "Governance Framework",
        profile: "Profile",
        notifications: "Notifications",
        help: "Help",
        home: "Home"
      },
      ev: {
        principles: "Principles",
        principle: "Principle",
        practices: "Practices",
        practice: "Practice",
        criteria: "Criteria",
        criterion: "Criterion",
        maturityLevel: "Maturity Level",
        evidence: "Evidence",
        comments: "Comments",
        level0: "Not Implemented",
        level1: "Partially Implemented",
        level2: "Largely Implemented",
        level3: "Fully Implemented",
        saveProgress: "Save Progress",
        submitEvaluation: "Submit Evaluation",
        evaluationName: "Evaluation Name",
        period: "Period",
        description: "Description",
        createEvaluation: "Create Evaluation",
        fillAllFields: "Please fill all required fields",
        progressSaved: "Progress saved successfully",
        evaluationSubmitted: "Evaluation submitted successfully",
        provideEvidence: "Provide evidence for your assessment",
        addComments: "Add your comments here",
        selectMaturityLevel: "Select maturity level",
        next: "Next",
        previous: "Previous",
        of: "of",
        completed: "Completed",
        remaining: "Remaining"
      },
      common: {
        loading: "Loading...",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        view: "View",
        submit: "Submit",
        back: "Back",
        next: "Next",
        previous: "Previous",
        search: "Search",
        filter: "Filter",
        export: "Export",
        import: "Import",
        download: "Download",
        upload: "Upload",
        actions: "Actions",
        status: "Status",
        date: "Date",
        name: "Name",
        description: "Description",
        yes: "Yes",
        no: "No",
        confirm: "Confirm",
        close: "Close",
        period: "Period",
        score: "Score",
        total: "Total",
        of: "of",
        showing: "Showing",
        entries: "entries",
        noData: "No data available",
        viewAll: "View All",
        logout: "Logout"
      },
      dashboard: {
        welcome: "Welcome",
        welcomeBack: "Welcome back",
        overview: "Overview",
        recentActivity: "Recent Activity",
        statistics: "Statistics",
        quickActions: "Quick Actions",
        totalEvaluations: "Total Evaluations",
        pendingEvaluations: "Pending Evaluations",
        completedEvaluations: "Completed Evaluations",
        inProgressEvaluations: "In Progress",
        pendingReviews: "Pending Reviews",
        certificationRate: "Certification Rate",
        averageScore: "Average Score",
        recentEvaluations: "Recent Evaluations",
        noRecentActivity: "No recent activity",
        getStarted: "Get Started",
        createFirstEvaluation: "Create your first evaluation"
      },
      evaluation: {
        evaluations: "Evaluations",
        myEvaluations: "My Evaluations",
        newEvaluation: "New Evaluation",
        createEvaluation: "Create Evaluation",
        evaluationName: "Evaluation Name",
        evaluationPeriod: "Evaluation Period",
        evaluationDescription: "Description",
        startDate: "Start Date",
        endDate: "End Date",
        status: "Status",
        score: "Score",
        created: "Created",
        submitted: "Submitted",
        "in-progress": "In Progress",
        "under-review": "Under Review",
        approved: "Approved",
        rejected: "Rejected",
        draft: "Draft",
        pending: "Pending",
        viewDetails: "View Details",
        editEvaluation: "Edit Evaluation",
        deleteEvaluation: "Delete Evaluation",
        submitEvaluation: "Submit Evaluation",
        continueEvaluation: "Continue",
        noEvaluations: "No evaluations found",
        createFirst: "Create your first evaluation to get started",
        confirmDelete: "Are you sure you want to delete this evaluation?",
        evaluationDeleted: "Evaluation deleted successfully",
        evaluationSubmitted: "Evaluation submitted successfully",
        evaluationCreated: "Evaluation created successfully",
        fillAllFields: "Please fill in all required fields",
        enterName: "Enter evaluation name",
        enterPeriod: "Enter period (e.g., Q1 2026)",
        enterDescription: "Enter description"
      },
      results: {
        results: "Results",
        evaluationResults: "Evaluation Results",
        finalScore: "Final Score",
        certificationLevel: "Certification Level",
        certificationDate: "Certification Date",
        issuedDate: "Issued Date",
        validUntil: "Valid Until",
        viewCertificate: "View Certificate",
        downloadCertificate: "Download Certificate",
        viewRecommendations: "View Recommendations"
      },
      evaluator: {
        evaluationQueue: "Evaluation Queue",
        reviewEvaluation: "Review Evaluation",
        approveEvaluation: "Approve",
        rejectEvaluation: "Reject"
      },
      admin: {
        userManagement: "User Management",
        role: "Role",
        roles: "Roles",
        cannotDeleteUser: "Cannot delete user with existing evaluations"
      },
      settings: {
        settings: "Settings",
        accountSettings: "Account Settings",
        profileInformation: "Profile Information",
        changePassword: "Change Password",
        saveChanges: "Save Changes"
      },
      errors: {
        generic: "An error occurred. Please try again."
      },
      success: {
        operationSuccessful: "Operation completed successfully"
      }
    }
  }
};

// ✅ INITIALIZE i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

console.log('✅ i18n initialized successfully');
console.log('✅ Available translations:', Object.keys(resources.en.translation));

export default i18n;