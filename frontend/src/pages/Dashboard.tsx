import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ email: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        axios.get(`${import.meta.env.VITE_API_USER_SERVICE}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setUser(response.data);
        })
        .catch(() => {
            localStorage.removeItem("token");
            navigate("/");
        })
        .finally(() => {
            setLoading(false);
        });

    }, [navigate]);

    if (loading) {
        return <p className="has-text-centered">Chargement...</p>;
    }

    return (
        <div className="container mt-5">
            <div className="box">
                <h1 className="title has-text-centered">Bienvenue sur votre tableau de bord</h1>

                {user && (
                    <p className="has-text-centered mt-3">Connecté en tant que : <strong>{user.email}</strong></p>
                )}

                <button className="button is-danger is-fullwidth mt-4" onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/");
                }}>
                    Se déconnecter
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
