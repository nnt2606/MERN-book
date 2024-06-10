import mongoose from 'mongoose';
import {dbURI} from './config.js';

const connectDB = async () => {
    try{
        if (!dbURI) {
            console.error('DB URI is not defined');
            process.exit(1);
          }
        await mongoose.connect(dbURI, {})
        .then(() =>{
            console.log("App connected to database");
        })
    }catch(error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

export default connectDB;
