import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../hooks/useAuth';

const Inscription = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [lastname, setLastName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password))) {
      setError('Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule et un chiffre.');
      return;
    }

    try {
      const response = await axios.post(API_BASE_URL + '/api/auth/register', {
        lastname,
        firstname,
        email,
        password,
      }, {
        withCredentials: true,  
      });

      if (response.status !== 200) {
        throw new Error('Erreur lors de l\'inscription');
      }

      sessionStorage.setItem('emailse', email);
      navigate('/otp-verify', { state: { fromInscription: true } });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else if (err.request) {

        setError('Aucune réponse reçue du serveur.');
      } else {
      
        setError('Erreur lors de la création de la requête :' + err.message);
      }
    }
  };

  return (
    <div className='inscription'>
      <form onSubmit={handleSubmit} autocomplete="off">
        <h2>Inscription</h2>
        <div className="form__group field">
          <input type="input" className="form__field" placeholder="Prénom" value={firstname} onChange={e => setFirstName(e.target.value)} required />
          <label htmlFor="firstname" className="form__label">Prénom</label>
        </div>
        <div className="form__group field">
          <input type="input" className="form__field" placeholder="Prénom" value={lastname} onChange={e => setLastName(e.target.value)} required />
          <label htmlFor="lastname" className="form__label">Nom</label>
        </div>
        <div className="form__group field">
          <input type="input" className="form__field" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label htmlFor="email" className="form__label">Email</label>
        </div>
        <div className="form__group field">
          <input type="password" className="form__field" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <label htmlFor="password" className="form__label">Mot de passe</label>
        </div>
        <div className="form__group field">
          <input type="password" className="form__field" placeholder="Retapez le mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          <label htmlFor="confirmPassword" className="form__label">Retapez le mot de passe</label>
        </div>
        <button type="submit">S'inscrire</button>
        {error && <p className='error'>{error}</p>}
        <p className='account'>Vous avez un compte? <a onClick={() => navigate("/login")}>Se connecter.</a></p>
      </form>
    </div>
  );
}

export default Inscription;