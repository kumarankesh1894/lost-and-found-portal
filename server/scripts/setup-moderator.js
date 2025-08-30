const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function setupModerator() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully');
    
    // Create initial moderator account
    const moderatorData = {
      username: 'admin_moderator',
      email: 'moderator@example.com',
      password: await bcrypt.hash('moderator123', 10),
      role: 'moderator',
      isActive: true
    };

    const moderator = await User.findOneAndUpdate(
      { email: moderatorData.email },
      moderatorData,
      { upsert: true, new: true }
    );

    console.log('Initial moderator setup complete:', moderator.username);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error setting up moderator:', error);
    process.exit(1);
  }
}

setupModerator();
