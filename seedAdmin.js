const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.log('Usage: node seedAdmin.js <username> <password>');
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/busola';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB');

    const existing = await User.findOne({ username });
    if (existing) {
      console.log(`L'utilisateur ${username} existe déjà.`);
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
