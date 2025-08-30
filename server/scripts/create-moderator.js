const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function createModerator(username, email, password) {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const moderator = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'moderator',
      isActive: true
    });

    console.log('New moderator created:', moderator.username);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating moderator:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

// Get command line arguments
const [,, username, email, password] = process.argv;
if (!username || !email || !password) {
  console.error('Usage: node create-moderator.js <username> <email> <password>');
  process.exit(1);
}

createModerator(username, email, password);
