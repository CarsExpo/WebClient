import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const EditAccount = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        axios
            .get(API_BASE_URL + "/api/user/info", {
                headers: { "x-auth-token": token },
                withCredentials: true,
            })
            .then((response) => {
                setEmail(response.data.email);
                setFirstName(response.data.firstname);
                setLastName(response.data.lastname);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }, [token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(API_BASE_URL + "/api/user/edit", { email, firstname, lastname, password, }, { headers: { "x-auth-token": token }, })
            .then((response) => {
                setMessage("Compte mis à jour avec succès!");
            })
            .catch((error) => {
                console.error("There was an error!", error);
                setMessage("Erreur lors de la mise à jour du compte.");
            });
    };

    return (
        <div className="edit-account">
            <form onSubmit={handleSubmit}>
                <h2>Modifier mon compte</h2>
                <div className="underlines"></div>
                <div className="form__group field">
                    <input
                        type="input"
                        className="form__field"
                        placeholder="Prénom"
                        name="firstname"
                        value={firstname}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label htmlFor="firstname" className="form__label">
                        Prénom
                    </label>
                </div>
                <div className="form__group field">
                    <input
                        type="input"
                        className="form__field"
                        placeholder="Nom"
                        name="lastname"
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <label htmlFor="lastname" className="form__label">
                        Nom
                    </label>
                </div>
                <div className="form__group field">
                    <input
                        type="input"
                        className="form__field"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email" className="form__label">
                        Email
                    </label>
                </div>
                <div className="form__group field">
                    <input
                        type="password"
                        className="form__field"
                        placeholder="Mot de passe"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password" className="form__label">
                        Mot de passe
                    </label>
                </div>
                <button type="submit">Mettre à jour</button>
                {message && <p>{message}</p>}
            </form>

        </div>
    );
};

export default EditAccount;