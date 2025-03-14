import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./database";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connexion à PostgreSQL réussie !");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

    } catch (error) {
        console.error("Erreur de connexion à PostgreSQL :", error);
    }
};

startServer();
