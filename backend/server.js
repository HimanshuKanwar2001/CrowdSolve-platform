import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import authRoutes from "./routes/auth.route.js";
import featureRoutes from "./routes/feature.route.js";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/feature", featureRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
