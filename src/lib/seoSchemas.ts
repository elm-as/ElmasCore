export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SoftwareAppItem {
  name: string;
  description: string;
  url?: string;
  image?: string;
  category?: string;
  operatingSystem?: string;
}

export const SITE_URL = 'https://elmas.solutions';
export const ORG_NAME = 'Elmas Core';
export const ORG_LOGO = `${SITE_URL}/og-default.png`;

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME,
    url: SITE_URL,
    logo: ORG_LOGO,
    description:
      'Collectif de Développeurs, Ingénieurs Data et Créatifs pour bâtir les systèmes et jeux de demain.',
    founder: {
      '@type': 'Person',
      name: 'Elmas Tresor',
      url: `${SITE_URL}/team`,
    },
    sameAs: [
      'https://github.com/elmastresor',
      'https://twitter.com/elmastresor',
      'https://linkedin.com/company/elmas-core',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'technical support',
      email: 'contact@elmas.solutions',
      availableLanguage: ['French', 'English'],
    },
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG_NAME,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'fr-FR',
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  const itemListElement = items.map((it, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: it.name,
    item: it.item.startsWith('http') ? it.item : `${SITE_URL}${it.item}`,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: SITE_URL,
      },
      ...itemListElement.map((item, idx) => ({
        ...item,
        position: idx + 2,
      })),
    ],
  };
}

export function getSoftwareAppSchema(app: SoftwareAppItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.description,
    url: app.url || SITE_URL,
    image: app.image || ORG_LOGO,
    applicationCategory: app.category || 'DeveloperApplication',
    operatingSystem: app.operatingSystem || 'Web, Android, iOS, Windows, Linux',
    author: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
    },
  };
}

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getJobPostingSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Développeurs & Ingénieurs Associés — Elmas Core',
    description:
      'Elmas Core recrute des développeurs game/3D, mobile, web fullstack et ingénieurs desktop/système pour rejoindre le collectif en tant qu\'associés et co-bâtir des projets et jeux ambitieux.',
    identifier: {
      '@type': 'PropertyValue',
      name: ORG_NAME,
      value: 'JOIN-ELMAS-CORE-2026',
    },
    datePosted: '2026-01-01',
    employmentType: 'OTHER',
    hiringOrganization: {
      '@type': 'Organization',
      name: ORG_NAME,
      sameAs: SITE_URL,
      logo: ORG_LOGO,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CI',
        addressLocality: 'Abidjan / Daloa / Remote',
      },
    },
  };
}
