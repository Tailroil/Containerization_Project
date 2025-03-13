import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div className="container mt-5">
            <div className="box">
                <h1 className="title has-text-centered">Bienvenue sur votre tableau de bord</h1>
                <button className="button is-danger is-fullwidth" onClick={() => {
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
