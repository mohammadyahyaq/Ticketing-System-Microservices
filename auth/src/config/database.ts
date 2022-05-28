import mongoose from "mongoose";

const start = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('the database is connected successfully');
        
    } catch (error) {
        console.error(error);
    }
}

start();