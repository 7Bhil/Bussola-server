const SiteSettingsMongoose = require('../models/SiteSettings');

let prisma = null;
try {
  prisma = require('../lib/prisma');
} catch (e) {
  prisma = null;
}

const DEFAULT_SETTINGS = {
  colors: {
    primary: '#2764AE',
    secondary: '#0d1b2a',
    sable: '#FAF7F2',
    cobalt: '#2764AE',
    gold: '#C49A45',
    vert: '#27B074',
    dark: '#1B263B',
    light: '#F8F9FA'
  },
  typography: {
    primaryFont: 'Montserrat, sans-serif',
    headingFont: 'Montserrat, sans-serif',
    titleWeight: '900',
    bodyFontSize: '1rem'
  },
  hero: {
    badgeText: 'ONG BUSOLA • PARAKOU, BÉNIN',
    mainTitle: 'Autonomiser les femmes & les jeunes',
    highlightWord: 'pour un avenir équitable.',
    subtitle: 'Organisation Non Gouvernementale engagée pour la santé sexuelle et reproductive, la prévention des VBG, l’autonomisation socio-économique et la justice climatique au Bénin.',
    ctaPrimaryText: 'Découvrir nos actions',
    ctaPrimaryLink: '/actions',
    ctaSecondaryText: 'Nous soutenir',
    ctaSecondaryLink: '/support'
  },
  sloganBanner: {
    text: 'INFORMER, PROTÉGER ET AUTONOMISER POUR DES COMMUNAUTÉS ÉPANOUIES.',
    orangeWords: ['PROTÉGER', 'AUTONOMISER'],
    fontWeight: '900',
    fontStyle: 'italic',
    backgroundColor: '#2764AE',
    textColor: '#FFFFFF',
    highlightColor: '#F2994A',
    containerWidth: '1100px'
  },
  about: {
    storyTitle: 'Notre origine',
    storySubtitle: 'Une conviction née à Parakou',
    textParagraph1: 'Fondée à Parakou, l’ONG BUSOLA est née de la volonté d’apporter une réponse concrète aux défis majeurs auxquels sont confrontés les femmes et les jeunes dans les communautés vulnérables du Bénin.',
    textParagraph2: 'À travers une approche inclusive et ancrée sur le terrain, nous luttons contre les violences basées sur le genre, promouvons la santé et les droits sexuels et reproductifs, et favorisons l’autonomisation économique des femmes et l’engagement des jeunes.',
    imageUrl: '/optimized/about.webp?v=4',
    quoteText: 'Une communauté forte est celle où chaque individu connaît ses droits et dispose des moyens d’agir.',
    quoteAuthor: 'Équipe Dirigeante BUSOLA',
    strategicAxes: [
      { number: '01', title: 'Santé Reproductive & SDSR', subtitle: 'Promotion de la Santé et des Droits Sexuels et Reproductifs', icon: 'Heart', description: 'Éducation complète à la sexualité, sensibilisation à la santé menstruelle et accès aux services de santé de qualité pour tous.', color: '#2764AE' },
      { number: '02', title: 'Prévention des VBG', subtitle: 'Lutte contre les Violences Basées sur le Genre', icon: 'ShieldCheck', description: 'Prise en charge psychosociale, accompagnement juridique et campagnes de plaidoyer communautaire pour briser les tabous.', color: '#C49A45' },
      { number: '03', title: 'Autonomisation & Leadership', subtitle: 'Autonomisation Économique et Engagement des Jeunes', icon: 'Zap', description: 'Formations professionnelles, soutien aux micro-entreprises locales, pépinières écologiques et développement du leadership féminin.', color: '#27B074' },
      { number: '04', title: 'Paix & Justice Climatique', subtitle: 'Résilience Écologique et Cohésion Sociale', icon: 'Globe', description: 'Actions de sensibilisation environnementale, projets d’adaptation climatique communautaire et prévention des conflits.', color: '#0d1b2a' }
    ]
  },
  actionsPage: {
    bannerTitle: 'Nos Actions',
    bannerSubtitle: 'Des initiatives concrètes pour transformer des lives',
    steps: [
      {
        stepNumber: '01', stepLabel: 'Première Étape', title: 'ÉDUQUER', subtitle: "pour libérer l'esprit", color: '#2764AE',
        description: "Le changement commence par le savoir. Avant d'agir, il faut comprendre. Dans les écoles, les ateliers ou au sein des communautés, nous ouvrons des espaces de dialogue pour briser les tabous et donner les clés de la connaissance.",
        imageUrl: '/optimized/action-1.webp?v=2',
        bullets: [
          "Causeries sur la Santé Sexuelle et Reproductive (DSSR)",
          "Ateliers sur la dignité et l'hygiène menstruelle",
          "Sessions d'alphabétisation fonctionnelle pour les femmes adultes",
          "Formation des jeunes aux enjeux de la citoyenneté numérique",
          "Éducation Complète à la Sexualité (ECS) en milieu scolaire"
        ]
      },
      {
        stepNumber: '02', stepLabel: 'Deuxième Étape', title: 'PROTÉGER', subtitle: 'pour préserver la dignité', color: '#C49A45',
        description: 'Chaque personne a le droit de vivre à l’abri de la peur, de la violence et de l’injustice. Notre mission est d’être un bouclier et un refuge pour les victimes, tout en transformant les normes sociales pour empêcher que le mal ne se répète.',
        imageUrl: '/optimized/action-2.webp',
        bullets: [
          "Accueil, écoute et accompagnement des survivantes de VBG",
          "Prise en charge médicale et soutien psychologique d'urgence",
          "Orientation juridique et judiciaire en partenariat avec les structures locales",
          "Mise en place de réseaux communautaires d'alerte et de protection",
          "Plaidoyer auprès des leaders traditionnels et des autorités institutionnelles"
        ]
      },
      {
        stepNumber: '03', stepLabel: 'Troisième Étape', title: 'AUTONOMISER', subtitle: "pour bâtir l'avenir", color: '#27B074',
        description: "La véritable liberté est économique. Notre action vise à donner aux femmes et aux jeunes les outils pour construire leur propre indépendance. De la formation professionnelle à l'agro-écologie, nous soutenons des initiatives qui génèrent des revenus.",
        imageUrl: '/optimized/action-3.webp?v=2',
        bullets: [
          "Formation aux AGR et remise de kits matériels pour les femmes vulnérables",
          "Formation pratique en techniques de pépinière et agro-écologie",
          "Appui au leadership et à la participation à la vie publique",
          "Bootcamp de renforcement des capacités des jeunes catalyseurs",
          "Théâtre communautaire comme outil de plaidoyer et sensibilisation"
        ]
      }
    ]
  },
  supportPage: {
    title: 'Nous Soutenir',
    subtitle: 'Votre engagement transforme des vies',
    tiers: [
      { amount: 10000, currency: 'FCFA', title: 'Soutien Ponctuel', description: 'Kit d’hygiène menstruelle pour 2 jeunes filles', benefits: ['Achat de serviettes réutilisables', 'Sensibilisation aux soins d’hygiène'], highlight: false },
      { amount: 25000, currency: 'FCFA', title: 'Support d’Impact', description: 'Prise en charge médicale d’une survivante de VBG', benefits: ['Consultation et soins médicaux', 'Accompagnement psychologique'], highlight: true },
      { amount: 100000, currency: 'FCFA', title: 'Grand Partenaire', description: 'Organisation d’une causerie sur les VBG', benefits: ['Animation communautaire complète', 'Distribution de supports de sensibilisation'], highlight: false }
    ]
  },
  contact: {
    phone: '+229 01 97 00 00 00',
    email: 'contact@ongbusola.org',
    address: 'Quartier Titirou, Parakou, Bénin',
    facebookUrl: 'https://facebook.com/ongbusola',
    twitterUrl: 'https://twitter.com/ongbusola',
    linkedinUrl: 'https://linkedin.com/company/ongbusola',
    instagramUrl: 'https://instagram.com/ongbusola'
  },
  footer: {
    description: 'ONG BUSOLA est une organisation non gouvernementale œuvrant pour l’égalité des genres, la santé sexuelle et reproductive et l’autonomisation socio-économique des femmes et des jeunes au Bénin.',
    copyrightText: '© 2026 ONG BUSOLA. Tous droits réservés.'
  }
};

// GET /api/settings
exports.getSettings = async (req, res, next) => {
  try {
    if (process.env.DATABASE_URL && prisma) {
      let record = await prisma.siteSettings.findFirst();
      if (!record) {
        record = await prisma.siteSettings.create({
          data: { data: DEFAULT_SETTINGS }
        });
      }
      const settingsData = record.data || DEFAULT_SETTINGS;
      return res.json({ id: record.id, _id: record.id, ...settingsData });
    }

    let settings = await SiteSettingsMongoose.findOne();
    if (!settings) {
      settings = new SiteSettingsMongoose({});
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings
exports.updateSettings = async (req, res, next) => {
  try {
    if (process.env.DATABASE_URL && prisma) {
      let record = await prisma.siteSettings.findFirst();
      let currentData = record ? (record.data || DEFAULT_SETTINGS) : DEFAULT_SETTINGS;
      const mergedData = { ...currentData, ...req.body };

      if (!record) {
        record = await prisma.siteSettings.create({
          data: { data: mergedData }
        });
      } else {
        record = await prisma.siteSettings.update({
          where: { id: record.id },
          data: { data: mergedData }
        });
      }

      const updatedData = record.data;
      return res.json({
        message: 'Configuration du site mise à jour avec succès !',
        settings: { id: record.id, _id: record.id, ...updatedData }
      });
    }

    let settings = await SiteSettingsMongoose.findOne();
    if (!settings) {
      settings = new SiteSettingsMongoose(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    const updatedSettings = await settings.save();
    res.json({ message: 'Configuration du site mise à jour avec succès !', settings: updatedSettings });
  } catch (error) {
    next(error);
  }
};
