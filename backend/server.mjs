import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // Needed for __dirname in ES modules
import { connectDB } from "./config/db.mjs";
import noteRoute from "./routes/note.route.mjs";
import userRoute from "./routes/user.route.mjs";

dotenv.config();

// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin (e.g., mobile apps, Postman) or a valid origin
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

// API routes
app.use("/api/notes", noteRoute);
app.use("/api/user", userRoute);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Catch-all route to serve the React frontend
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"))
  );
}

// Start the server
connectDB(); // Ensure database is connected before starting the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
