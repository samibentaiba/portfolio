// src/lib/legal-content.ts

export const legalContent = {
  organization: {
    name: "National Office of Agricultural Development",
    shortName: "Algis",
    email: "contact@algis-preview.vercel.app",
    address: "Ministry of Agriculture and Rural Development, Algiers, Algeria",
    founded: "2024",
    website: "https://algis-preview.vercel.app",
  },

  about: {
    hero: {
      title: "About Algis",
      subtitle: "Modernizing Algerian agriculture through digital transformation, data centralization, and sustainable resource management",
    },
    mission: {
      title: "Our Mission",
      description: "To empower the national agricultural sector by providing a unified digital ecosystem for managing Agricultural Production Units (UAPs). We are committed to enhancing food security, optimizing resource allocation, and fostering data-driven decision-making across all wilayas.",
    },
    story: {
      title: "Our Vision",
      content: ["Established under the tutelage of the Ministry of Agriculture and Rural Development, Algis represents a strategic shift towards the digitization of Algeria's agricultural infrastructure.", "Our platform consolidates data from scattered manual records into a robust, centralized system, enabling real-time monitoring of livestock, crop yields, and machinery across the nation.", "By connecting regional coordinators, UAP managers, and central decision-makers, Algis serves as the backbone for a more efficient, transparent, and productive agricultural future."],
    },
    values: [
      {
        title: "Sovereignty",
        description: "We contribute to national food security by maximizing the potential of our agricultural assets.",
      },
      {
        title: "Transparency",
        description: "We ensure data integrity and accountability in the management of public agricultural resources.",
      },
      {
        title: "Efficiency",
        description: "We optimize operations through digitalization, reducing waste and improving productivity.",
      },
      {
        title: "Sustainability",
        description: "We promote practices that ensure the long-term viability of our land and livestock.",
      },
    ],
    events: [
      {
        name: "National Harvest Review",
        icon: "🌾",
        description: "Annual gathering of regional directors and UAP managers to analyze crop yields, discuss challenges, and set production targets for the upcoming season.",
      },
      {
        name: "AgriTech Training",
        icon: "🚜",
        description: "Workshops dedicated to training farm operators on modern machinery, irrigation techniques, and the effective use of the Algis digital platform.",
      },
      {
        name: "Livestock Health Seminar",
        icon: "🐄",
        description: "Sessions led by veterinary experts to discuss herd health management, disease prevention, and breeding best practices.",
      },
    ],
    achievements: [
      {
        year: "2023",
        title: "Digital Initiative",
        description: "Ministry launch of the agricultural digitalization roadmap",
      },
      {
        year: "2024",
        title: "Platform Launch",
        description: "Deployment of Algis V1 across pilot UAPs",
      },
      {
        year: "2025",
        title: "National Integration",
        description: "Full rollout to all Agricultural Production Units nationwide",
      },
      {
        year: "Future",
        title: "Smart Farming",
        description: "Planned integration of IoT sensors and AI analytics",
      },
    ],
    futureGoals: ["Achieve 100% digital tracking of national livestock inventory", "Implement AI-driven crop yield forecasting models", "Expand the platform to include private sector partnerships", "Establish a centralized marketplace for agricultural surplus", "Enhance water resource management through smart irrigation monitoring"],
    cta: {
      title: "Partner with Us",
      description: "Join the national effort to revolutionize agriculture. Whether you are a researcher, investor, or technology partner, your contribution matters.",
      buttonText: "Contact Administration",
    },
  },

  faq: {
    hero: {
      title: "Frequently Asked Questions",
      subtitle: "Support for UAP Managers and Regional Coordinators",
    },
    categories: [
      {
        id: "general",
        name: "General Platform",
        icon: "❓",
        questions: [
          {
            question: "What is the Algis platform?",
            answer: "Algis is the official enterprise resource planning (ERP) system for the National Office of Agricultural Development. It is used to manage and track the activities, production, and resources of Agricultural Production Units (UAPs) across Algeria.",
          },
          {
            question: "Who has access to Algis?",
            answer: "Access is restricted to authorized personnel, including Ministry officials, Regional Coordinators, UAP Managers, and administrative staff. Accounts are provisioned by the central administration.",
          },
          {
            question: "Is the data secure?",
            answer: "Yes, Algis is hosted on secure government servers with strict access controls and regular backups to ensure the confidentiality and integrity of national agricultural data.",
          },
        ],
      },
      {
        id: "account",
        name: "Account & Access",
        icon: "👤",
        questions: [
          {
            question: "How do I get an account?",
            answer: "Accounts are created by the central IT administration. If you are a new UAP Manager, please contact your Regional Coordinator to initiate the account creation process.",
          },
          {
            question: "I forgot my password.",
            answer: "Please use the 'Forgot Password' link on the login page. You will receive reset instructions via your official email address. If you do not have access to your email, contact IT support.",
          },
          {
            question: "How do I update my profile?",
            answer: "Log in and navigate to the 'Settings' page. You can update your contact information and notification preferences. Critical role information can only be changed by an administrator.",
          },
        ],
      },
      {
        id: "production",
        name: "Production Entry",
        icon: "📊",
        questions: [
          {
            question: "How often should I update production data?",
            answer: "Livestock counts (births, deaths) should be updated weekly. Milk production data should be entered daily or consolidated weekly. Crop yields must be recorded at the end of each harvest cycle.",
          },
          {
            question: "Can I upload Excel files?",
            answer: "Yes, the Production module supports bulk import via Excel/CSV files. Please ensure you use the standard template provided in the 'Resources' section to avoid formatting errors.",
          },
          {
            question: "What if I make a mistake in a submission?",
            answer: "You can edit entries within 24 hours of submission. After that period, data is locked for validation. To correct locked data, please submit a 'Correction Request' ticket to your Regional Coordinator.",
          },
        ],
      },
      {
        id: "inventory",
        name: "Stock & Machinery",
        icon: "🚜",
        questions: [
          {
            question: "How do I report broken machinery?",
            answer: "Go to the Stock module, locate the specific machine in the asset list, and update its status to 'En Panne' (Broken). You must also attach a brief maintenance report describing the issue.",
          },
          {
            question: "How are consumables tracked?",
            answer: "Consumables (seeds, fertilizer, fuel) are tracked by quantity. When you receive a new shipment, use the 'Stock In' function. When resources are used, use 'Stock Out' to deduct from the inventory.",
          },
        ],
      },
      {
        id: "support",
        name: "Technical Support",
        icon: "🛠️",
        questions: [
          {
            question: "Who do I contact for technical issues?",
            answer: "For platform errors or connectivity issues, please email support@algis-preview.vercel.app or call the IT Helpdesk at the number provided in your onboarding pack.",
          },
          {
            question: "Is there a user manual?",
            answer: "Yes, a comprehensive PDF user guide is available for download in the 'Docs' section of the dashboard. Video tutorials are also available for key tasks.",
          },
        ],
      },
    ],
    contactCta: {
      title: "Need Assistance?",
      description: "Our support team is available Sunday through Thursday, 08:30 - 16:30.",
      buttonText: "Contact Helpdesk",
      email: "support@algis-preview.vercel.app",
    },
  },

  policy: {
    hero: {
      title: "Data Governance Policy",
      subtitle: "Standards for the collection, usage, and protection of national agricultural data",
      lastUpdated: "January 2025",
    },
    sections: [
      {
        title: "Introduction",
        content: ["This policy outlines the protocols for data governance within the Algis platform, operated by the National Office of Agricultural Development. It applies to all users accessing the system.", "Algis handles sensitive national data regarding food security and production capabilities. Strict adherence to these guidelines is mandatory."],
      },
      {
        title: "Data Collection Scope",
        subsections: [
          {
            subtitle: "Operational Data",
            content: ["We collect detailed data on:", "• Livestock inventory (counts, health status, movements)", "• Crop production (acreage, yields, types)", "• Machinery status and maintenance logs", "• Water and energy resource consumption"],
          },
          {
            subtitle: "Personnel Data",
            content: ["For system administration, we store:", "• Professional contact details of staff", "• Role assignments and UAP affiliations", "• System access logs and activity audit trails"],
          },
        ],
      },
      {
        title: "Data Usage & Integrity",
        content: ["Data collected via Algis is used strictly for:", "• National agricultural planning and strategy", "• Resource allocation and subsidy management", "• Performance monitoring of Production Units", "• Statistical reporting to the Ministry", "Users are responsible for the accuracy of the data they enter. Falsification of production data is a serious violation of administrative protocols."],
      },
      {
        title: "Confidentiality & Sharing",
        content: ["Agricultural data is classified as internal government information.", "• Data must not be shared with unauthorized third parties or external entities without explicit written permission from the General Directorate.", "• Aggregated statistics may be published in official Ministry reports.", "• Access is granted on a 'need-to-know' basis corresponding to the user's role."],
      },
      {
        title: "Security Protocols",
        content: ["To maintain system security:", "• Passwords must be strong and changed every 90 days.", "• User sessions automatically time out after periods of inactivity.", "• Suspicious activity must be reported immediately to IT Security.", "• Use of the platform is monitored for compliance and security purposes."],
      },
    ],
  },

  terms: {
    hero: {
      title: "Terms of Use",
      subtitle: "User agreement for the Algis National Platform",
      lastUpdated: "January 2025",
    },
    sections: [
      {
        title: "Acceptance",
        content: ["By accessing the Algis platform, you agree to comply with these Terms of Use and all applicable national regulations regarding digital administration.", "This platform is the property of the National Office of Agricultural Development. Unauthorized access is prohibited."],
      },
      {
        title: "User Obligations",
        content: ["Users agree to:", "• Use the platform exclusively for professional duties related to UAP management.", "• Ensure all entered data is accurate and up-to-date to the best of their knowledge.", "• Protect their login credentials and not share accounts.", "• Cooperate with audits and verification procedures."],
      },
      {
        title: "Prohibited Conduct",
        content: ["Users must not:", "• Attempt to access data outside their assigned scope.", "• Export bulk data for personal or non-official use.", "• Upload malicious software or attempt to disrupt platform services.", "• Modify historical records without proper authorization."],
      },
      {
        title: "Liability",
        content: ["The National Office is not liable for operational decisions made based on incorrect data entered by users.", "Users found violating data integrity or security policies may be subject to administrative and legal action."],
      },
      {
        title: "Contact Information",
        content: ["For policy inquiries:", "National Office of Agricultural Development", "Legal Affairs Division", "Algiers, Algeria", "Email: legal@algis-preview.vercel.app"],
      },
    ],
  },
};

export type LegalContent = typeof legalContent;
