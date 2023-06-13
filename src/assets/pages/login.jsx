import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL } from '../../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useAuth();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_BASE_URL + "/api/auth/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      setError('Email ou mot de passe incorrect');
      console.log(error)
    }
  };

  return (
    <div className='login'>
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <div className="form__group field">
                <input 
                  type="input" 
                  className="form__field" 
                  placeholder="Email" 
                  name="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <label htmlFor="email" className="form__label">Email</label>
            </div>
            <div className="form__group field">
                <input 
                  type="password" 
                  className="form__field" 
                  placeholder="Mot de passe" 
                  name="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <label htmlFor="password" className="form__label">Mot de passe</label>
            </div>
            <button>Se connecter</button>
            {error && <p className='error'>{error}</p>}
            <p className='account'>
              Vous n'avez pas de compte? 
              <a onClick={() => navigate("/inscription")}>S'inscrire.</a>
            </p>
            <p className='reset-password'>
              Mot de passe oublié?
              <a onClick={() => navigate("/forget-password")}>Rénitialisé.</a>
            </p>
        </form>
    </div>
  );
}

export default Login;
