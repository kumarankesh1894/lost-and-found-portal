const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


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
    
    const moderator = new User({
      username: 'moderator',
      email: 'moderator@example.com',
      password: hashedPassword,
      role: 'moderator',
      phone: '+1234567890',
      isActive: true
    });

    await moderator.save();

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
    process.exit(0);
  }
};

createModerator();
