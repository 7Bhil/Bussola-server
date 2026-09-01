const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const User = require('../models/User');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/busola';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB:', uri);

  const username = process.env.SEED_ADMIN_USERNAME || 'admin123';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ username });
  if (existing) {
    console.log(`Admin '${username}' already exists. Nothing to do.`);
  } else {
    const user = new User({ username, password, role: 'admin' });
    await user.save();
    console.log(`Created admin '${username}'.`);
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  mongoose.disconnect().finally(() => process.exit(1));
});
