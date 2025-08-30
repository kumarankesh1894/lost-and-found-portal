const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function fixModerator(email) {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully');
    
    const moderator = await User.findOne({ email });
    if (!moderator) {
      console.error('Moderator not found');
      await mongoose.disconnect();
      process.exit(1);
    }

    moderator.role = 'moderator';
    moderator.isActive = true;
    await moderator.save();

    console.log('Moderator fixed:', moderator.username);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing moderator:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

// Get command line arguments
const [,, email] = process.argv;
if (!email) {
  console.error('Usage: node fix-moderator.js <email>');
  process.exit(1);
}

fixModerator(email);
