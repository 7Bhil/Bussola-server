const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// load .env from server folder
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const User = require('../models/User');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/busola';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB:', uri);

  const keep = 'admin123';
  // Count admins to delete
  const toDelete = await User.countDocuments({ role: 'admin', username: { $ne: keep } });
  if (toDelete === 0) {
    console.log(`No admin users to delete (except '${keep}').`);
  } else {
    const res = await User.deleteMany({ role: 'admin', username: { $ne: keep } });
    console.log(`Deleted ${res.deletedCount} admin user(s) (kept '${keep}').`);
  }

  const remaining = await User.find({ role: 'admin' }).select('username createdAt updatedAt').lean();
  console.log('Remaining admin accounts:');
  remaining.forEach(u => console.log(` - ${u.username}`));

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(err => {
  console.error('Error:', err);
  mongoose.disconnect().finally(() => process.exit(1));
});
