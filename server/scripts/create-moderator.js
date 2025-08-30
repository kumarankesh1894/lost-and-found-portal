const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

<<<<<<< HEAD
async function createModerator(username, email, password) {
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

const createCustomModerator = async (username, email, password, phone = '+1234567890') => {
  try {
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB Atlas');

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      console.log(' User already exists with this email or username');
      console.log(`Username: ${existingUser.username}`);
      console.log(`Email: ${existingUser.email}`);
      console.log(`Role: ${existingUser.role}`);
      process.exit(0);
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);
>>>>>>> 4485b801d8813351b17028e3f8b297b986165720
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const moderator = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'moderator',
      isActive: true
    });

<<<<<<< HEAD
    console.log('New moderator created:', moderator.username);
    await mongoose.disconnect();
=======
    await moderator.save();

    console.log(' Moderator user created successfully!');
    console.log(' Login Credentials:');
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${moderator.role}`);
    console.log('');
    console.log(' You can now login with these credentials to access the moderator dashboard');

  } catch (error) {
    console.error('Error creating moderator:', error);
  } finally {
    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB Atlas');
>>>>>>> 4485b801d8813351b17028e3f8b297b986165720
    process.exit(0);
  } catch (error) {
    console.error('Error creating moderator:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

<<<<<<< HEAD
// Get command line arguments
const [,, username, email, password] = process.argv;
if (!username || !email || !password) {
  console.error('Usage: node create-moderator.js <username> <email> <password>');
  process.exit(1);
}

createModerator(username, email, password);
=======

const args = process.argv.slice(2);

if (args.length < 3) {
  console.log(' Usage: node create-moderator.js <username> <email> <password> [phone]');
  console.log(' Example: node create-moderator.js admin admin@example.com admin123 +1234567890');
  
  console.log(' Default moderator credentials (if no args):');
  console.log('   Username: admin');
  
  console.log('   Email: admin@example.com');
  console.log('   Password: admin123');
  process.exit(1);
}

const [username, email, password, phone] = args;


createCustomModerator(username, email, password, phone);
>>>>>>> 4485b801d8813351b17028e3f8b297b986165720
