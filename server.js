import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import incomeRoutes from "./routes/incomeRoutes.js"
import { sequelize } from "./config/db.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware to handle CROS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*", //permite cereri doar de la CLIENT_URL ori toti
        methods: ["GET", "POST", "PUT", "DELETE"], //ce tip de cereri permite
        allowedHeaders: ["Content-Type", "Authorization"], //tipul de continut si trimitere token
    })
);

app.use(express.json());
connectDB();
sequelize.sync({ alter: true }) //Sequelize a sincronizat modelele tale cu baza de date

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));



