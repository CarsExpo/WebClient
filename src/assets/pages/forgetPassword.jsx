import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await axios.post(API_BASE_URL + '/api/auth/forget-password', { email });
            setMessage('Email de réinitialisation de mot de passe envoyé avec succès.');
        } catch (error) {
            console.log(error.response.data);
            setMessage(error.response?.data?.message || 'Une erreur s\'est produite. Veuillez réessayer plus tard.');
        }
    }

    return (
        <div className='forget-pass'>
            <form onSubmit={handleSubmit}>
                <h2>Mot de passe oublié</h2>
                <div className="form__group field">
                    <input
                        type="input"
                        className="form__field"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email" className="form__label">Email</label>
                    <button type="submit">Envoyer l'email</button>
                    {message && <p className='message'>{message}</p>}
                </div>
            </form>
        </div>
    );
}

export default ForgetPassword;