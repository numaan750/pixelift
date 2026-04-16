import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import session from "express-session";
import passport from "./config/passport.config.js";
import loginrouter from "./router/loginrouter.js";
import authRoutes from "./router/auth.routes.js";
import premiumRoutes from "./router/premium.routes.js";
import generateRoutes from "./router/generate.routes.js";
import creemRoutes from "./router/creem.routes.js";

const app = express();
app.use(cors());
// Ye line add karo express.json() se PEHLE
app.use((req, res, next) => {
  if (req.originalUrl === "/api/creem/webhook") {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      req.rawBody = data;
      next();
    });
  } else {
    next();
  }
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api", loginrouter);
app.use("/api/auth", authRoutes);
app.use("/api", premiumRoutes);
app.use("/api", generateRoutes);
app.use("/api", creemRoutes);

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Pixelift Backend is running");
});

export default app;
