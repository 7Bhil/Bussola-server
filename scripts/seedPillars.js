const mongoose = require('mongoose');
const Project = require('../models/Project');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/busola';

const pillars = [
  {
    title: 'PAGEDA',
    description: "Autonomisation des femmes par l'alphabétisation fonctionnelle et l'accès aux droits fonciers.",
    coverImage: '/optimized/project-1.webp',
    color: '#2764ae',
    order: 1
  },
  {
    title: 'YES',
    description: "Youth Empowerment & Sexual Health : Leadership, citoyenneté active et santé des jeunes.",
    coverImage: '/optimized/project-2.webp',
    color: '#27b074',
    order: 2
  },
  {
    title: 'TEDIDJO',
    description: "Promotion de la santé de la reproduction et lutte contre les violences basées sur le genre.",
    coverImage: '/optimized/project-3.webp',
    color: '#f89d2a',
    order: 3
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB');

    for (const pillar of pillars) {
      const existing = await Project.findOne({ title: pillar.title });
      if (existing) {
        console.log(`Le pilier ${pillar.title} existe déjà.`);
      } else {
        await new Project(pillar).save();
        console.log(`Pilier ${pillar.title} créé avec succès !`);
      }
    }
  } catch (err) {
    console.error('Erreur:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
