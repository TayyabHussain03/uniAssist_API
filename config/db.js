import mongoose from "mongoose";

const connectDB = async () => {
    console.log('MongoDB URL:', process.env.MONGO_URL);  // Debugging output

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error(`Stack Trace: ${error.stack}`);
        process.exit(1);
    }
}

export default connectDB;
