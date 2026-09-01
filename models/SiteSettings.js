const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // --- 1. Charte Graphique & Style ---
  colors: {
    primary: { type: String, default: '#2764AE' },
    secondary: { type: String, default: '#0d1b2a' },
    sable: { type: String, default: '#FAF7F2' },
    cobalt: { type: String, default: '#2764AE' },
    gold: { type: String, default: '#C49A45' },
    vert: { type: String, default: '#27B074' },
    dark: { type: String, default: '#1B263B' },
    light: { type: String, default: '#F8F9FA' }
  },

  // --- 2. Typographies & Styles Globaux ---
  typography: {
    primaryFont: { type: String, default: 'Montserrat, sans-serif' },
    headingFont: { type: String, default: 'Montserrat, sans-serif' },
    titleWeight: { type: String, default: '900' },
    bodyFontSize: { type: String, default: '1rem' }
  },

  // --- 3. Accueil & Hero ---
  hero: {
    badgeText: { type: String, default: 'ONG BUSOLA • PARAKOU, BÉNIN' },
    mainTitle: { type: String, default: 'Autonomiser les femmes & les jeunes' },
    highlightWord: { type: String, default: 'pour un avenir équitable.' },
    subtitle: { type: String, default: 'Organisation Non Gouvernementale engagée pour la santé sexuelle et reproductive, la prévention des VBG, l’autonomisation socio-économique et la justice climatique au Bénin.' },
    ctaPrimaryText: { type: String, default: 'Découvrir nos actions' },
    ctaPrimaryLink: { type: String, default: '/actions' },
    ctaSecondaryText: { type: String, default: 'Nous soutenir' },
    ctaSecondaryLink: { type: String, default: '/support' }
  },

  // --- 4. Bannière Slogan Grand Format ---
  sloganBanner: {
    text: { type: String, default: 'INFORMER, PROTÉGER ET AUTONOMISER POUR DES COMMUNAUTÉS ÉPANOUIES.' },
    orangeWords: { type: [String], default: ['PROTÉGER', 'AUTONOMISER'] },
    fontWeight: { type: String, default: '900' },
    fontStyle: { type: String, default: 'italic' },
    backgroundColor: { type: String, default: '#2764AE' },
    textColor: { type: String, default: '#FFFFFF' },
    highlightColor: { type: String, default: '#F2994A' },
    containerWidth: { type: String, default: '1100px' }
  },

  // --- 5. Section À Propos & Conviction ---
  about: {
    storyTitle: { type: String, default: 'Notre origine' },
    storySubtitle: { type: String, default: 'Une conviction née à Parakou' },
    textParagraph1: { type: String, default: 'Fondée à Parakou, l’ONG BUSOLA est née de la volonté d’apporter une réponse concrète aux défis majeurs auxquels sont confrontés les femmes et les jeunes dans les communautés vulnérables du Bénin.' },
    textParagraph2: { type: String, default: 'À travers une approche inclusive et ancrée sur le terrain, nous luttons contre les violences basées sur le genre, promouvons la santé et les droits sexuels et reproductifs, et favorisons l’autonomisation économique des femmes et l’engagement des jeunes.' },
    imageUrl: { type: String, default: '/optimized/about.webp?v=4' },
    quoteText: { type: String, default: 'Une communauté forte est celle où chaque individu connaît ses droits et dispose des moyens d’agir.' },
    quoteAuthor: { type: String, default: 'Équipe Dirigeante BUSOLA' },
    
    // Les 4 Axes Stratégiques
    strategicAxes: [{
      number: { type: String, default: '01' },
      title: { type: String, default: 'Santé Reproductive & SDSR' },
      subtitle: { type: String, default: 'Promotion de la Santé et des Droits Sexuels et Reproductifs' },
      icon: { type: String, default: 'Heart' },
      description: { type: String, default: 'Éducation complète à la sexualité, sensibilisation à la santé menstruelle et accès aux services de santé de qualité pour tous.' },
      color: { type: String, default: '#2764AE' }
    }, {
      number: { type: String, default: '02' },
      title: { type: String, default: 'Prévention des VBG' },
      subtitle: { type: String, default: 'Lutte contre les Violences Basées sur le Genre' },
      icon: { type: String, default: 'ShieldCheck' },
      description: { type: String, default: 'Prise en charge psychosociale, accompagnement juridique et campagnes de plaidoyer communautaire pour briser les tabous.' },
      color: { type: String, default: '#C49A45' }
    }, {
      number: { type: String, default: '03' },
      title: { type: String, default: 'Autonomisation & Leadership' },
      subtitle: { type: String, default: 'Autonomisation Économique et Engagement des Jeunes' },
      icon: { type: String, default: 'Zap' },
      description: { type: String, default: 'Formations professionnelles, soutien aux micro-entreprises locales, pépinières écologiques et développement du leadership féminin.' },
      color: { type: String, default: '#27B074' }
    }, {
      number: { type: String, default: '04' },
      title: { type: String, default: 'Paix & Justice Climatique' },
      subtitle: { type: String, default: 'Résilience Écologique et Cohésion Sociale' },
      icon: { type: String, default: 'Globe' },
      description: { type: String, default: 'Actions de sensibilisation environnementale, projets d’adaptation climatique communautaire et prévention des conflits.' },
      color: { type: String, default: '#0d1b2a' }
    }]
  },

  // --- 6. Section Nos Actions (Piliers) ---
  actionsPage: {
    bannerTitle: { type: String, default: 'Nos Actions' },
    bannerSubtitle: { type: String, default: 'Des initiatives concrètes pour transformer des lives' },
    steps: [{
      stepNumber: { type: String, default: '01' },
      stepLabel: { type: String, default: 'Première Étape' },
      title: { type: String, default: 'ÉDUQUER' },
      subtitle: { type: String, default: "pour libérer l'esprit" },
      color: { type: String, default: '#2764AE' },
      description: { type: String, default: "Le changement commence par le savoir. Avant d'agir, il faut comprendre. Dans les écoles, les ateliers ou au sein des communautés, nous ouvrons des espaces de dialogue pour briser les tabous et donner les clés de la connaissance." },
      imageUrl: { type: String, default: '/optimized/action-1.webp?v=2' },
      bullets: { type: [String], default: [
        "Causeries sur la Santé Sexuelle et Reproductive (DSSR)",
        "Ateliers sur la dignité et l'hygiène menstruelle",
        "Sessions d'alphabétisation fonctionnelle pour les femmes adultes",
        "Formation des jeunes aux enjeux de la citoyenneté numérique",
        "Éducation Complète à la Sexualité (ECS) en milieu scolaire"
      ] }
    }, {
      stepNumber: { type: String, default: '02' },
      stepLabel: { type: String, default: 'Deuxième Étape' },
      title: { type: String, default: 'PROTÉGER' },
      subtitle: { type: String, default: 'pour préserver la dignité' },
      color: { type: String, default: '#C49A45' },
      description: { type: String, default: 'Chaque personne a le droit de vivre à l’abri de la peur, de la violence et de l’injustice. Notre mission est d’être un bouclier et un refuge pour les victimes, tout en transformant les normes sociales pour empêcher que le mal ne se répète.' },
      imageUrl: { type: String, default: '/optimized/action-2.webp' },
      bullets: { type: [String], default: [
        "Accueil, écoute et accompagnement des survivantes de VBG",
        "Prise en charge médicale et soutien psychologique d'urgence",
        "Orientation juridique et judiciaire en partenariat avec les structures locales",
        "Mise en place de réseaux communautaires d'alerte et de protection",
        "Plaidoyer auprès des leaders traditionnels et des autorités institutionnelles"
      ] }
    }, {
      stepNumber: { type: String, default: '03' },
      stepLabel: { type: String, default: 'Troisième Étape' },
      title: { type: String, default: 'AUTONOMISER' },
      subtitle: { type: String, default: "pour bâtir l'avenir" },
      color: { type: String, default: '#27B074' },
      description: { type: String, default: "La véritable liberté est économique. Notre action vise à donner aux femmes et aux jeunes les outils pour construire leur propre indépendance. De la formation professionnelle à l'agro-écologie, nous soutenons des initiatives qui génèrent des revenus." },
      imageUrl: { type: String, default: '/optimized/action-3.webp?v=2' },
      bullets: { type: [String], default: [
        "Formation aux AGR et remise de kits matériels pour les femmes vulnérables",
        "Formation pratique en techniques de pépinière et agro-écologie",
        "Appui au leadership et à la participation à la vie publique",
        "Bootcamp de renforcement des capacités des jeunes catalyseurs",
        "Théâtre communautaire comme outil de plaidoyer et sensibilisation"
      ] }
    }]
  },

  // --- 7. Section Nous Soutenir (Dons) ---
  supportPage: {
    title: { type: String, default: 'Nous Soutenir' },
    subtitle: { type: String, default: 'Votre engagement transforme des vies' },
    tiers: [{
      amount: { type: Number, default: 10000 },
      currency: { type: String, default: 'FCFA' },
      title: { type: String, default: 'Soutien Ponctuel' },
      description: { type: String, default: 'Kit d’hygiène menstruelle pour 2 jeunes filles' },
      benefits: { type: [String], default: ['Achat de serviettes réutilisables', 'Sensibilisation aux soins d’hygiène'] },
      highlight: { type: Boolean, default: false }
    }, {
      amount: { type: Number, default: 25000 },
      currency: { type: String, default: 'FCFA' },
      title: { type: String, default: 'Support d’Impact' },
      description: { type: String, default: 'Prise en charge médicale d’une survivante de VBG' },
      benefits: { type: [String], default: ['Consultation et soins médicaux', 'Accompagnement psychologique'] },
      highlight: { type: Boolean, default: true }
    }, {
      amount: { type: Number, default: 100000 },
      currency: { type: String, default: 'FCFA' },
      title: { type: String, default: 'Grand Partenaire' },
      description: { type: String, default: 'Organisation d’une causerie sur les VBG' },
      benefits: { type: [String], default: ['Animation communautaire complète', 'Distribution de supports de sensibilisation'] },
      highlight: { type: Boolean, default: false }
    }]
  },

  // --- 8. Informations de Contact & Footer ---
  contact: {
    phone: { type: String, default: '+229 01 97 00 00 00' },
    email: { type: String, default: 'contact@ongbusola.org' },
    address: { type: String, default: 'Quartier Titirou, Parakou, Bénin' },
    facebookUrl: { type: String, default: 'https://facebook.com/ongbusola' },
    twitterUrl: { type: String, default: 'https://twitter.com/ongbusola' },
    linkedinUrl: { type: String, default: 'https://linkedin.com/company/ongbusola' },
    instagramUrl: { type: String, default: 'https://instagram.com/ongbusola' }
  },

  footer: {
    description: { type: String, default: 'ONG BUSOLA est une organisation non gouvernementale œuvrant pour l’égalité des genres, la santé sexuelle et reproductive et l’autonomisation socio-économique des femmes et des jeunes au Bénin.' },
    copyrightText: { type: String, default: '© 2026 ONG BUSOLA. Tous droits réservés.' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
