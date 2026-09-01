const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const username = process.argv[2] || 'isti';
const password = process.argv[3] || 'isti';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/busola';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB');

    let existing = await User.findOne({ username });
    if (existing) {
      existing.password = password;
      existing.loginAttempts = 0;
      existing.lockUntil = undefined;
      await existing.save();
      console.log(`Utilisateur ${username} mis à jour avec le mot de passe spécifié.`);
    } else {
      const user = new User({
        username,
        password,
        role: 'admin'
      });
      await user.save();
      console.log(`Administrateur ${username} créé avec succès !`);
    }
  } catch (err) {
    console.error('Erreur:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
