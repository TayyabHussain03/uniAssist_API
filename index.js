import express, { urlencoded } from "express";
import queryRoutes from "./routes/requestRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// Load environment variables from a .env file into process.env
dotenv.config();

const app = express();

// Connect to the MongoDB database
connectDB();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Use the query routes defined in requestRoutes.js for API requests
app.use('/api/queries', queryRoutes);

// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
