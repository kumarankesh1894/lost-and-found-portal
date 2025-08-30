const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

<<<<<<< HEAD
async function fixModerator(email) {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully');
=======
 
require('dotenv').config({ path: '../config.env' });

const fixModerator = async () => {
  try {
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lost-found-portal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(' Connected to MongoDB');
 
    await User.deleteOne({ email: 'moderator@example.com' });
    console.log(' Removed old moderator account');

    
    const hashedPassword = await bcrypt.hash('moderator123', 10);
>>>>>>> 4485b801d8813351b17028e3f8b297b986165720
    
    const moderator = await User.findOne({ email });
    if (!moderator) {
      console.error('Moderator not found');
      await mongoose.disconnect();
      process.exit(1);
    }

    moderator.role = 'moderator';
    moderator.isActive = true;
    await moderator.save();

<<<<<<< HEAD
    console.log('Moderator fixed:', moderator.username);
    await mongoose.disconnect();
=======
    console.log(' Moderator user recreated successfully!');
    console.log(' Login Credentials:');
    console.log('   Email: moderator@example.com');
    console.log('   Password: moderator123');
    console.log('   Role: moderator');
    console.log('');
    console.log(' You can now login with these credentials to access the moderator dashboard');

  } catch (error) {
    console.error(' Error fixing moderator:', error);
  } finally {
    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB');
>>>>>>> 4485b801d8813351b17028e3f8b297b986165720
    process.exit(0);
  } catch (error) {
    console.error('Error fixing moderator:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

<<<<<<< HEAD
// Get command line arguments
const [,, email] = process.argv;
if (!email) {
  console.error('Usage: node fix-moderator.js <email>');
  process.exit(1);
}

fixModerator(email);
=======
fixModerator();
>>>>>>> 4485b801d8813351b17028e3f8b297b986165720
