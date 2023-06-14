import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from "../../config";

const ConfirmEdit = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);

    const handleConfirm = async (confirmation) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/user/confirm-edit/${token}`, { confirmation });
            setMessage(response.data.message);
            setTimeout(() => {
              navigate('/');
              window.location.reload();
            }, 2000);
        } catch (err) {
            if (err.response?.status === 403) {
                setMessage('Votre IP a été bannie. Vous ne pouvez plus accéder à cette page.');
                localStorage.removeItem('token');
            } else {
                setMessage(err.response?.data?.message || 'Une erreur s\'est produite.');
            }
            console.error(err);
        }
    };

    return (
        <div className='confirm-edit'>
            <form>
                <h2>Avez-vous modifier votre compte?</h2>
                <div className="button">
                    <button type="button" onClick={() => handleConfirm(true)}>Oui</button>
                    <button type="button" onClick={() => handleConfirm(false)}>Non</button>
                </div>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default ConfirmEdit;
