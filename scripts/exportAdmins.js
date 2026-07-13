const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const User = require('../models/User');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/busola';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB:', uri);

  const admins = await User.find({ role: 'admin' }).select('-password').lean();
  const out = path.resolve(__dirname, '..', 'backups', `admins-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(admins, null, 2));
  console.log(`Exported ${admins.length} admin(s) to ${out}`);

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  mongoose.disconnect().finally(() => process.exit(1));
});
