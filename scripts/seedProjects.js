const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const Project = require('../models/Project');

const PILLAR_PROJECTS = [
  {
    title: 'DSSR et VBG',
    description: "Santé Sexuelle et Reproductive & Lutte contre les Violences Basées sur le Genre.",
    coverImage: '/optimized/project-1.webp',
    color: '#2764ae',
    order: 1,
    pillar: 'dssr'
  },
  {
    title: 'Paix et Cohésion Sociale',
    description: "Promotion du vivre-ensemble, prévention de la radicalisation et dialogue intergénérationnel.",
    coverImage: '/optimized/project-2.webp',
    color: '#27b074',
    order: 2,
    pillar: 'paix'
  },
  {
    title: 'Leadership et Autonomisation',
    description: "Renforcement du pouvoir d'agir des femmes et des jeunes pour un impact communautaire durable.",
    coverImage: '/optimized/project-3.webp',
    color: '#f89d2a',
    order: 3,
    pillar: 'leadership'
  }
];

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/busola';
  await mongoose.connect(uri);
  console.log('Connecté à MongoDB:', uri);

  for (const projectData of PILLAR_PROJECTS) {
    const existing = await Project.findOne({ pillar: projectData.pillar });
    if (existing) {
      console.log(`✅ Projet "${projectData.title}" (pilier: ${projectData.pillar}) existe déjà.`);
    } else {
      const project = new Project(projectData);
      await project.save();
      console.log(`🆕 Projet "${projectData.title}" créé avec succès.`);
    }
  }

  console.log('\n✔ Seed des projets terminé.');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Erreur:', err);
  mongoose.disconnect().finally(() => process.exit(1));
});
