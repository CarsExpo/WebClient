import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../hooks/useAuth';

const Inscription = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useAuth();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password))) {
      setError('Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule et un chiffre.');
      return;
    }

    try {
      const response = await axios.post(API_BASE_URL + '/api/auth/register', {
        name,
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
      setError(err.response.data.message);
    }
  };

  return (
    <div className='inscription'>
      <form onSubmit={handleSubmit}>
        <h2>Inscription</h2>
        <div class="form__group field">
          <input type="input" class="form__field" placeholder="Nom" value={name} onChange={e => setName(e.target.value)} required />
          <label for="name" class="form__label">Nom</label>
        </div>
        <div class="form__group field">
          <input type="input" class="form__field" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label for="email" class="form__label">Email</label>
        </div>
        <div class="form__group field">
          <input type="password" class="form__field" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <label for="password" class="form__label">Mot de passe</label>
        </div>
        <button type="submit">S'inscire</button>
        {error && <p className='error'>{error}</p>}
        <p className='account'>Vous avez un compte? <a onClick={() => navigate("/login")}>Se connecter.</a></p>
      </form>
    </div>
  );
}

export default Inscription;
