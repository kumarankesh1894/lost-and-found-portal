const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

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

listModerators();
