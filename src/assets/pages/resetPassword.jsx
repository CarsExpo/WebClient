import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    let { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (password !== repeatPassword) {
            setMessage('Les mots de passe ne correspondent pas.');
            return;
        }

        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password))) {
            setMessage('Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule et un chiffre.');
            return;
        }

        try {
            await axios.post(API_BASE_URL + `/api/auth/reset-password/${token}`, { password });
            navigate('/');
        } catch (error) {
            console.log(error.response?.data);
            setMessage(error.response?.data?.message || 'Une erreur s\'est produite. Veuillez réessayer plus tard.');
        }
    }

    return (
        <div className='reset-pass' autocomplete="off">
            <form onSubmit={handleSubmit}>
                <h2>Réinitialiser le mot de passe</h2>
                <div className="form__group field">
                    <input
                        type="password"
                        className="form__field"
                        placeholder="Nouveau mot de passe"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        
                    />
                    <label htmlFor="password" className="form__label">Nouveau mot de passe</label>
                </div>
                <div className="form__group field">
                    <input
                        type="password"
                        className="form__field"
                        placeholder="Répetez le mot de passe"
                        name="repeat-password"
                        value={repeatPassword} 
                        onChange={e => setRepeatPassword(e.target.value)} 
                        required
                        
                    />
                    <label htmlFor="repeat-password" className="form__label">Répetez le mot de passe</label>
                </div>
                <button type="submit">Rénitialiser</button>
                {message && <p className='message'>{message}</p>}
            </form>
        </div>
    );
}

export default ResetPassword;
