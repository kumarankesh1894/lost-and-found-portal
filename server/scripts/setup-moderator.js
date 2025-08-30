const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

<<<<<<< HEAD
async function setupModerator() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully');
=======

require('dotenv').config({ path: './config.env' });

const createModerator = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lost-found-portal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(' Connected to MongoDB');


    const existingModerator = await User.findOne({ email: 'moderator@example.com' });
    
    if (existingModerator) {
      console.log('Moderator user already exists');
      console.log(`Username: ${existingModerator.username}`);
      console.log(`Email: ${existingModerator.email}`);
      console.log(`Role: ${existingModerator.role}`);
      process.exit(0);
    }


    const hashedPassword = await bcrypt.hash('moderator123', 10);
>>>>>>> 4485b801d8813351b17028e3f8b297b986165720
    
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

<<<<<<< HEAD
    console.log('Initial moderator setup complete:', moderator.username);
    await mongoose.disconnect();
=======
    console.log('Moderator user created successfully!');
    console.log(' Login Credentials:');
    console.log('   Email: moderator@example.com');
    console.log('   Password: moderator123');
    console.log('   Role: moderator');
    console.log('');
    console.log(' You can now login with these credentials to access the moderator dashboard');

  } catch (error) {
    console.error(' Error creating moderator:', error);
  } finally {
    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB');
>>>>>>> 4485b801d8813351b17028e3f8b297b986165720
    process.exit(0);
  } catch (error) {
    console.error('Error setting up moderator:', error);
    process.exit(1);
  }
}

<<<<<<< HEAD
setupModerator();
=======
createModerator();
>>>>>>> 4485b801d8813351b17028e3f8b297b986165720
