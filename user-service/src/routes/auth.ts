import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router: Router = Router();

// Middleware d'authentification
const authenticate = (req: Request, res: Response, next: Function) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Accès refusé" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalide" });
    }
};

// Inscription
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe requis." });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });

        return res.status(201).json({ message: "Utilisateur créé !" });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
});

// Connexion
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe requis." });
        }

        const user = await User.findOne({ 
            where: { email },
            attributes: ["id", "email", "password"] 
        });

        console.log("Utilisateur trouvé :", user);

        if (!user || user ==null) return res.status(400).json({ error: "Utilisateur non trouvé" });

        console.log("Mot de passe récupéré :", user.password);

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: "Mot de passe incorrect" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        return res.json({ token });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        return res.status(500).json({ error: "Erreur lors de la connexion" });
    }
});

// Route pour récupérer l'utilisateur connecté
router.get("/me", authenticate, async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk((req as any).user.id, { attributes: ["id", "email"] });

        if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

        return res.json(user);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;
