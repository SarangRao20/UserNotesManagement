import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("📡 Connecting to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("\n=======================================================================================");
        console.error(" ❌ MONGODB CONNECTION FAILED");
        console.error(" =======================================================================================");
        console.error(` 🔍 Error Name: ${error.name}`);
        console.error(` 📝 Error Message: ${error.message}`);
        console.error(" =======================================================================================");

        if (error.name === 'MongooseServerSelectionError') {
            console.error(" 💡 DIAGNOSIS: The server could not reach the database.");
            console.error("    1. CHECK YOUR INTERNET: Are you on a restricted network (Office/School)?");
            console.error("    2. CHECK IP WHITELIST: Did your IP change? Re-add it in Atlas.");
        }

        console.error("=======================================================================================\n");
        process.exit(1);
    }
};

export default connectDB;
