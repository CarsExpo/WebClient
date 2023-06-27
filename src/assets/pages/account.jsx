import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const Account = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [discord, setDiscord] = useState("");
  const [work, setWork] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(token !== null);
    const fetchUser = async () => {
      try {
        if (token) {
          const response = await axios.get(API_BASE_URL + '/api/user/info', {
            headers: { 'x-auth-token': token },
            withCredentials: true
          });
          setUser(response.data);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setUser(null);
          localStorage.removeItemsetIsModalOpen('token');
        } else {
          console.log(err);
        }
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();


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
        setDiscord(response.data.discord);
        setWork(response.data.work);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [token]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification de l'e-mail
    if (!email || !validateEmail(email)) {
      setMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    // Vérification du mot de passe
    if (!password || !validatePassword(password)) {
      setMessage("Veuillez entrer un mot de passe valide. Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre et un chiffre.");
      return;
    }

    axios
      .post(
        API_BASE_URL + "/api/user/edit",
        { email, firstname, lastname, password, discord, work },
        { headers: { "x-auth-token": token } }
      )
      .then((response) => {
        setMessage("Compte mis à jour avec succès!");
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setMessage("Erreur lors de la mise à jour du compte.");
      });
  };

  return (
    <div className="account">
      <h2>Mon compte</h2>
      <div className="profile-con">
        <div className="profile">
          <div className="header">
            <div className="pdp">
              <i class='bx bx-user'></i>
            </div>
            <div className="username">
              {user?.firstname} {user?.lastname}
            </div>
          </div>
          <div className="body">
            <ul>
              <li>
                <p className='field'>Email</p>
                <p className='value'>{user?.email}</p>
              </li>
              <li>
                <p className='field'>Travail</p>
                <p className='value'>{user?.work}</p>
              </li>
              <li>
                <p className='field'>Discord</p>
                <p className='value'>{user?.discord}</p>
              </li>
            </ul>
          </div>
          <button onClick={handleOpenModal}>Modifier mes informations</button>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifier mon compte</h2>
            <form>
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
                  type="input"
                  className="form__field"
                  placeholder="Discord"
                  name="discord"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                />
                <label htmlFor="discord" className="form__label">
                  Pseudo discord
                </label>
              </div>
              <div className="form__group field">
                <input
                  type="input"
                  className="form__field"
                  placeholder="Ton métier"
                  name="work"
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                />
                <label htmlFor="work" className="form__label">
                  Métier en RP
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
              <div className="button-group">
                <button type="submit">Mettre à jour</button>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
              </div>
              {message && <p>{message}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;