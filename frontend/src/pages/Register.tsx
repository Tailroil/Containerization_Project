import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(
                import.meta.env.VITE_API_USER_SERVICE + "/register",
                { email, password }
            );
            navigate("/");
        } catch (error) {
            console.error("Erreur d'inscription", error);
        }
    };

    return (
        <div className="container is-flex is-justify-content-center is-align-items-center" style={{marginTop: "50px"}}>
            <div className="box" style={{ width: "400px" }}>
                <h1 className="title has-text-centered">Inscription</h1>
                <form onSubmit={handleRegister}>
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

                    <button className="button is-primary is-fullwidth mt-3">S'inscrire</button>
                </form>

                <p className="has-text-centered mt-4">
                    Déjà un compte ? <a href="/" className="has-text-primary">Connexion</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
