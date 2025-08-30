const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

<<<<<<< HEAD
async function listModerators() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully');
    
    const moderators = await User.find({ role: 'moderator' })
      .select('-password')
      .lean();

    console.log('\nCurrent Moderators:');
    console.table(moderators.map(m => ({
      Username: m.username,
      Email: m.email,
      Active: m.isActive,
      Created: m.createdAt
    })));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error listing moderators:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}
=======
require('dotenv').config({ path: './config.env' });

const listModerators = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(' Connected to MongoDB Atlas');
    console.log(' Searching for moderator accounts...\n');


    const moderators = await User.find({ role: 'moderator' }).select('-password');

    if (moderators.length === 0) {
      console.log(' No moderator accounts found in the database');
      console.log(' Use one of these scripts to create a moderator:');
      console.log('   - node scripts/setup-moderator.js (creates default moderator)');
      console.log('   - node scripts/create-moderator.js <username> <email> <password>');
    } else {
      console.log(` Found ${moderators.length} moderator account(s):\n`);
      
      moderators.forEach((mod, index) => {
        console.log(` Moderator ${index + 1}:`);
        console.log(`   Username: ${mod.username}`);
        console.log(`   Email: ${mod.email}`);
        console.log(`   Phone: ${mod.phone}`);
        console.log(`   Status: ${mod.isActive ? ' Active' : 'Inactive'}`);
        console.log(`   Created: ${mod.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error(' Error listing moderators:', error);
  } finally {
    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB Atlas');
    process.exit(0);
  }
};
>>>>>>> 4485b801d8813351b17028e3f8b297b986165720

listModerators();
