import sequelize from "./database";
import User from "./models/User"; // ✅ Import obligatoire

const syncDatabase = async (): Promise<void> => {
    try {
        console.log("🔄 Synchronisation de la base de données...");

        // 🔥 Utilisation explicite du modèle pour s'assurer qu'il est bien pris en compte
        await User.sync();

        // 🔍 Vérification des modèles chargés
        console.log("📂 Modèles détectés :", sequelize.models);

        // 🔄 Supprime et recrée toutes les tables
        await sequelize.sync({ force: true });

        console.log("✅ Base de données synchronisée avec succès !");
        process.exit();
    } catch (error) {
        console.error("❌ Erreur lors de la synchronisation :", error);
        process.exit(1);
    }
};

// 🔍 Vérifie que `User` est bien reconnu
console.log("✅ Chargement du modèle User :", User === sequelize.models.User);

syncDatabase();
