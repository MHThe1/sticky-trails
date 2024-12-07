import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.mjs";
import noteRoute from "./routes/note.route.mjs";
import userRoute from './routes/user.route.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // parse JSON request bodies

app.use("/api/notes", noteRoute);
app.use('/api/user', userRoute);


app.listen(PORT, () => {
  connectDB();
  console.log("Server is running at http://localhost:" + PORT);
});
