import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                import.meta.env.VITE_API_USER_SERVICE + "/login",
                { email, password }
            );
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Erreur de connexion", error);
        }
    };

    return (
        <div className="container">
            
            {/* Titre bien positionné en haut */}
            <h1 className="title is-1 has-text-primary has-text-centered mt-5" 
                style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px" }}>
                Site de Conversion
            </h1>

            {/* Conteneur du formulaire bien centré horizontalement mais en bas */}
            <div className="is-flex is-justify-content-center" style={{ marginTop: "50px" }}>
                <div className="box" style={{ width: "400px" }}>
                    <h2 className="title has-text-centered">Connexion</h2>
                    <form onSubmit={handleLogin}>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Mot de passe</label>
                            <div className="control">
                                <input className="input" type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                        </div>

                        <button className="button is-primary is-fullwidth mt-3">Se connecter</button>
                    </form>

                    <p className="has-text-centered mt-4">
                        Pas encore de compte ? <a href="/register" className="has-text-primary">Inscription</a>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Login;
