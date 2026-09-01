const User = require('../models/User');

async function seedDefaultAdmin() {
  try {
    const username = 'isti';
    const password = 'isti';

    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, password, role: 'admin' });
      await user.save();
      console.log(`✅ Administrateur par défaut '${username}' créé avec succès !`);
    } else {
      // S'assurer que le compte n'est pas verrouillé et réinitialiser le mot de passe sur 'isti'
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.password = password; // pre('save') va hasher le mot de passe
      await user.save();
      console.log(`✅ Administrateur '${username}' prêt à la connexion (mot de passe réinitialisé).`);
    }
  } catch (err) {
    console.error('Erreur lors du seeding de l\'admin par défaut:', err.message);
  }
}

module.exports = seedDefaultAdmin;
