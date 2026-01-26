import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/lib/connect.js";
import allRoutes from "./src/routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api", allRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Auth API is ready at /api/auth/`);
});
