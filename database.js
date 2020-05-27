const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    user: process.env.DATABASE_USERNAME,
    pass: process.env.DATABASE_PASSWORD,
    dbName: "waltham-forest"
};

const runWithDatabase = async (runWhileConnected) => {
    console.log('connecting to database...\n');
    await mongoose.connect(databaseUrl, options);
  
    console.log('dropping old data...\n');
    await mongoose.connection.db.dropDatabase();
  
    console.log('running function...\n');
    await runWhileConnected();
  
    console.log('\n');
  
    console.log('disconnecting from database...\n');
    await mongoose.disconnect();
    console.log('complete!\n');
};

module.exports = {
    mongoose,
    runWithDatabase,
};