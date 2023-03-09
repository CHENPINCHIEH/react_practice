import mongoose from 'mongoose';
import dotenv from "dotenv-defaults"; 
dotenv.config();



export default {
    connect: () => { /* code to connect Mongoose DB */ 
    mongoose.connect(
        // const db = mongoose.connection; p.91頁
        process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((res) => console.log("mongo db connection created"));}
};