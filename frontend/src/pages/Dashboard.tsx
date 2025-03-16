import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const appliances = [
    { name: "Réfrigérateur", power: 150, hours: 8760 },
    { name: "Congélateur", power: 250, hours: 8760 },
    { name: "Lave-linge", power: 2000, hours: 208 },
    { name: "Sèche-linge", power: 2500, hours: 208 },
    { name: "Lave-vaisselle", power: 1800, hours: 208 },
    { name: "Four électrique", power: 3000, hours: 156 },
    { name: "Plaque de cuisson", power: 3000, hours: 156 },
    { name: "Bouilloire", power: 2000, hours: 52 },
    { name: "Micro-ondes", power: 1000, hours: 156 },
    { name: "Télévision", power: 150, hours: 1460 },
    { name: "Ordinateur", power: 300, hours: 1460 },
    { name: "Éclairage (LED)", power: 10, hours: 1460 }
];

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [countries, setCountries] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>("Allemagne");
    const [countryEmission, setCountryEmission] = useState<number | null>(null);
    

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


    const [deviceCount, setDeviceCount] = useState(0);
    const [devices, setDevices] = useState<{ consumption: number; hours: number; }[]>([]);
    const [totalConsumption, setTotalConsumption] = useState(0);
    const [totalEmission, setTotalEmission] = useState(0);

    const handleDeviceCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setDeviceCount(count);
    setDevices(Array.from({ length: count }, () => ({ consumption: 0, hours: 0 })));
  };

  const handleDeviceChange = (index: number, field: "consumption" | "hours", value: string) => {
    const newDevices = [...devices];
    newDevices[index] = {
      ...newDevices[index],
      [field]: parseFloat(value) || 0, 
    };
    setDevices(newDevices);
  };
  
  const calculateConsumption = () => {
    const daysInYear = 365; 
    const total = devices.reduce((sum, device) => {
        const dailyConsumption = device.consumption * device.hours; 
        return sum + dailyConsumption * daysInYear; 
    }, 0);
    setTotalConsumption(parseFloat((total / 1000).toFixed(2)));
    if (selectedCountry) {
        axios.get(`http://localhost:3000/countries/${selectedCountry}`)
            .then(response => {
                const emissionFactor = parseFloat(response.data);
                const emission = totalConsumption * emissionFactor;
                setTotalEmission(parseFloat(emission.toFixed(2)));
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'empreinte carbone du pays:", error);
            });
    }
    else{
        console.error("Veuillez sélectionner un pays");
    }
  };
  
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);

    axios.get(`http://localhost:3000/countries/${country}`)
        .then(response => {
            setCountryEmission(parseFloat(response.data));
        })
        .catch(error => {
            console.error("Erreur lors de la récupération de l'empreinte carbone du pays:", error);
            setCountryEmission(null);
        });

    
};



useEffect(() => {
    axios.get("http://localhost:3000/countries")
     .then(response => {
         if (Array.isArray(response.data)) {
             setCountries(response.data.map((country: any) => country.pays));
         } else {
             console.error("Format inattendu des données :", response.data);
         }
     })
     .catch(error => {
         console.error("Erreur lors de la récupération des pays:", error);
     });

     axios.get(`http://localhost:3000/countries/${selectedCountry}`)
            .then(response => {
                setCountryEmission(parseFloat(response.data));
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'empreinte carbone du pays:", error);
                setCountryEmission(null);
            });
            
}, []);

    if (loading) {
        return <p className="has-text-centered">Chargement...</p>;
    }
    return (
        <div className="container mt-5">
        <div className="columns">
            
            {/* Tableau des appareils à gauche */}
            <div className="column is-one-third">
                <div className="box has-background-light p-3">
                    <h2 className="title is-5 has-text-dark">Consommation des appareils</h2>
                    <table className="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th>Appareil</th>
                                <th>Puissance (W)</th>
                                <th>Utilisation (h/an)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appliances.map((appareil, index) => (
                                <tr key={index}>
                                    <td>{appareil.name}</td>
                                    <td>{appareil.power}</td>
                                    <td>{appareil.hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        <div className="container mt-5">
            <div className="box has-background-dark p-5">
                <h1 className="title has-text-centered has-text-white">Bienvenue sur votre tableau de bord</h1>
    
                <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
                    <h1 className="text-xl font-bold text-center mb-4">Calcul de Consommation d'Appareils</h1>
    
                    {/* Sélection du pays */}
                    <div className="field">
                        <label className="label">Sélectionnez votre pays</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select value={selectedCountry} onChange={handleCountryChange}>
                                    {countries.map((country, index) => (
                                        <option key={index} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Affichage de l'empreinte du pays */}
                        {countryEmission !== null && (
                            <p className="has-text-info mt-2">Empreinte carbone de {selectedCountry} : {countryEmission} g CO₂/kWh</p>
                        )}
                    </div>
    
                    {/* Nombre d'appareils */}
                    <div className="field">
                        <label className="label">Combien d'appareils utilisez-vous par jour ?</label>
                        <div className="control">
                            <input
                                type="number"
                                className="input"
                                min="1"
                                value={deviceCount}
                                onChange={handleDeviceCountChange}
                            />
                        </div>
                    </div>
    
                    {/* Détails des appareils */}
                    <div className="space-y-4">
                        {devices.map((_, index) => (
                            <div key={index} className="p-4 border rounded">
                                <h3 className="subtitle is-5">Appareil {index + 1}</h3>
                                <label>Consommation (en Wh)</label>
                                <input
                                    type="number"
                                    className="input mt-2"
                                    onChange={(e) => handleDeviceChange(index, "consumption", e.target.value)}
                                />
                                <label className="mt-2">Temps allumé (en heure/jour)</label>
                                <input
                                    type="number"
                                    className="input mt-2"
                                    onChange={(e) => handleDeviceChange(index, "hours", e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
    
                    {/* Bouton de calcul */}
                    {deviceCount > 0 && (
                        <button className="button is-danger is-fullwidth mt-4" onClick={calculateConsumption}>
                            Calculer la consommation totale
                        </button>
                    )}
    
                    {/* Résultats */}
                    <div className="mt-4 p-3 has-background-light">
                        <h2 className="text-lg font-semibold has-text-dark">Consommation sur l'année : {totalConsumption} kWh</h2>
                        <h3 className="text-md has-text-dark">Empreinte des appareils sur l'année : {totalEmission} g CO₂ eq</h3>
                    </div>
                </div>
    
                {/* Informations utilisateur */}
                {user && (
                    <p className="has-text-centered mt-3 has-text-white">
                        Connecté en tant que : <strong>{user.email}</strong>
                    </p>
                )}
    
                {/* Bouton de déconnexion */}
                <button
                    className="button is-danger is-fullwidth mt-4"
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                    }}
                >
                    Se déconnecter
                </button>
            </div>
        </div>
    </div>

    </div>
    );
};

export default Dashboard;
